import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=ja&format=json`
        );
        const data = await res.json();

        if (!data.results) {
            return NextResponse.json({ results: [] });
        }

        const results = data.results.map((item: any) => ({
            id: item.id,
            name: item.name,
            country_code: item.country_code,
            latitude: item.latitude,
            longitude: item.longitude,
            admin1: item.admin1 || ""
        }));

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Open-Meteo Search error:", error);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
