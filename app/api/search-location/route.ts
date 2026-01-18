import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const [openMeteoRes, gsiRes] = await Promise.all([
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=ja&format=json`)
                .then(res => res.json())
                .catch(err => ({ results: [] })),
            fetch(`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .catch(err => [])
        ]);

        const results: any[] = [];

        // Process GSI Results (Priority for Japanese addresses)
        // GSI returns array of GeoJSON features
        if (Array.isArray(gsiRes)) {
            gsiRes.slice(0, 5).forEach((item: any, index: number) => {
                const title = item.properties.title;
                // Simple heuristic to split Prefecture and City
                // This isn't perfect but works for display
                // GSI title format: "Prefecture City Town..." or just "City..."
                let name = title;
                let admin1 = "";

                // Try to extract admin1 (Prefecture)
                // Basic list of prefectures could be used here for robustness, but for now we look for Ken/Fu/Do/To
                // A simple approach: use the whole string as name, or let the UI handle it. 
                // Let's try to keep name clean if possible.

                results.push({
                    id: 2000000 + index, // Custom ID range for GSI
                    name: title, // Use full address as name for clarity in list
                    country_code: "JP",
                    latitude: item.geometry.coordinates[1],
                    longitude: item.geometry.coordinates[0],
                    admin1: "国内(GSI)" // Marker to show source or generic context
                });
            });
        }

        // Process Open-Meteo Results
        if (openMeteoRes.results && Array.isArray(openMeteoRes.results)) {
            openMeteoRes.results.forEach((item: any) => {
                // simple de-duplication: check if lat/lon is very close to existing GSI result? 
                // Or just append. We'll just append for now to give options.
                results.push({
                    id: item.id,
                    name: item.name,
                    country_code: item.country_code,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    admin1: item.admin1 || ""
                });
            });
        }

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Hybrid Search error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
