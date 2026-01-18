import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const res = await fetch(
            `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        // GSI API returns an array of GeoJSON features
        const results = data.map((item: any, index: number) => ({
            id: index, // GSI doesn't provide stable IDs, so we use index
            name: item.properties.title,
            country_code: "JP",
            latitude: item.geometry.coordinates[1],
            longitude: item.geometry.coordinates[0],
            admin1: "" // GSI title usually includes the full address
        }));

        return NextResponse.json({ results });
    } catch (error) {
        console.error("GSI Search error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
