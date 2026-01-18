"use client"

import * as React from "react"
import { ProviderCard } from "./ProviderCard"
import { GeoLocation } from "./RegionSelector"

interface WeatherAggregatorProps {
    location: GeoLocation | null
}

export function WeatherAggregator({ location }: WeatherAggregatorProps) {
    if (!location) {
        return (
            <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                <p>地域を選択すると、各社の天気予報リンクが表示されます。</p>
            </div>
        )
    }

    // Yahoo Portal Search URL
    const yahooSearchUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(location.name + " 天気")}`;

    // Priority for Tenki.jp search: Address (City+Town) > Postal Code > Name
    let tenkiUrl = `https://tenki.jp/search/?keyword=${encodeURIComponent(location.name)}`
    let tenkiDesc = "地域名で検索します。"

    if (location.address) {
        tenkiUrl = `https://tenki.jp/search/?keyword=${location.address}`
        tenkiDesc = `詳細住所「${location.address}」で検索します。`
    } else if (location.postalCode) {
        tenkiUrl = `https://tenki.jp/search/?keyword=${location.postalCode}`
        tenkiDesc = `郵便番号「${location.postalCode}」で検索します。`
    }

    const providers = [
        {
            name: "Yahoo! JAPAN (検索結果)",
            url: yahooSearchUrl,
            description: "Yahoo! JAPANで「地名 + 天気」を検索した結果を表示します。一番確実で慣れ親しんだ画面です。",
            // Yahoo Brand Color Red
            color: "bg-[#ff0033]"
        },
        {
            name: "ウェザーニュース (ピンポイント)",
            // Weathernews OneBox supports Lat/Long directly
            url: `https://weathernews.jp/onebox/${location.latitude}/${location.longitude}/`,
            description: "現在地（経度緯度）でピンポイント表示。地域設定が不要で最もスムーズです。",
            color: "bg-gradient-to-r from-pink-500 to-rose-500"
        },
        {
            name: "Google 検索",
            url: `https://www.google.com/search?q=${encodeURIComponent(location.name + " 天気")}`,
            description: "Googleで天気を検索します。",
            color: "bg-blue-500"
        },
        {
            name: "tenki.jp (検索)",
            url: tenkiUrl,
            description: tenkiDesc,
            color: "bg-sky-600"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {providers.map((p) => (
                <ProviderCard
                    key={p.name}
                    name={p.name}
                    url={p.url}
                    description={p.description}
                    colorClass={p.color}
                />
            ))}
        </div>
    )
}
