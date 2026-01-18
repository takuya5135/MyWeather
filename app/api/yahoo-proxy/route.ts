import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const prefectureCode = searchParams.get("prefectureCode");
    const cityName = searchParams.get("cityName");

    if (!prefectureCode || !cityName) {
        return NextResponse.json({ url: null }, { status: 400 });
    }

    // Fallback URL (Search)
    const fallbackUrl = `https://weather.yahoo.co.jp/weather/search/?k=${encodeURIComponent(cityName)}`;

    try {
        // Strategy Change: The Prefecture page does not list all cities (it lists Areas).
        // It is more reliable to "Auto-Search" by scraping the search result page.

        // Ensure "市" or "区" is attached for better search precision if it's a simple name like "西宮"
        let searchName = cityName;
        if (!searchName.endsWith("市") && !searchName.endsWith("区") && !searchName.endsWith("町") && !searchName.endsWith("村")) {
            // Heuristic: Append nothing, relying on Yahoo's search.
            // But "西宮" -> "西宮市" is safer for exact match in title.
            // Let's just use the raw name first.
        }

        const targetUrl = `https://weather.yahoo.co.jp/weather/search/?k=${encodeURIComponent(searchName)}`;

        const res = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        if (!res.ok) {
            return NextResponse.json({ url: fallbackUrl });
        }

        const html = await res.text();

        // Search Result Parsing
        // The results usually look like:
        // <div class="serch-table"> ... <a href="/weather/jp/28/6310/28204.html">西宮市（兵庫県）</a>

        // Regex to find the first valid City Weather Link
        // Pattern: href="(/weather/jp/\d+/\d+/\d+.html)"
        const linkRegex = /href="(\/weather\/jp\/\d+\/\d+\/\d+\.html)"/i;
        const match = linkRegex.exec(html);

        if (match && match[1]) {
            return NextResponse.json({ url: `https://weather.yahoo.co.jp${match[1]}` });
        }

        // If no direct city link found, maybe it was a direct hit? 
        // (Sometimes Yahoo Search redirects directly if 1 result? Unlikely for search/?k=...)
        // If no format matches, return fallback.

        return NextResponse.json({ url: fallbackUrl });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ url: fallbackUrl });
    }
}
