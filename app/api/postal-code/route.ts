import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
    }

    try {
        // HeartRails Express API (Reverse Geocoding)
        // Note: It's often HTTP only or unstable on HTTPS. Fetching from server side avoids Mixed Content/CORS.
        const apiUrl = `https://express.heartrails.com/api/json?method=getPostal&x=${lon}&y=${lat}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.response && data.response.location && data.response.location.length > 0) {
            const loc = data.response.location[0];
            return NextResponse.json({
                postalCode: loc.postal,
                city: loc.city,
                town: loc.town
            });
        }

        return NextResponse.json({ postalCode: null });

    } catch (e) {
        console.error("Postal fetch failed", e);
        return NextResponse.json({ postalCode: null });
    }
}
