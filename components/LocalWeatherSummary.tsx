"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from "lucide-react"

interface LocalWeatherSummaryProps {
    latitude: number
    longitude: number
    placeName: string
}

// Simple WMO code mapper
function getWeatherIcon(code: number, size = "h-8 w-8") {
    if (code === 0 || code === 1) return <Sun className={`${size} text-yellow-500`} />
    if (code === 2 || code === 3) return <Cloud className={`${size} text-gray-400`} />
    if (code >= 45 && code <= 48) return <Wind className={`${size} text-gray-500`} /> // Fog
    if (code >= 51 && code <= 67) return <CloudRain className={`${size} text-blue-400`} />
    if (code >= 71 && code <= 77) return <CloudSnow className={`${size} text-cyan-200`} />
    if (code >= 80 && code <= 82) return <CloudRain className={`${size} text-blue-600`} />
    if (code >= 85 && code <= 86) return <CloudSnow className={`${size} text-cyan-400`} />
    if (code >= 95 && code <= 99) return <CloudLightning className={`${size} text-yellow-600`} />
    return <Sun className={`${size} text-yellow-500`} />
}

function getWeatherDescription(code: number) {
    if (code === 0) return "快晴"
    if (code === 1) return "晴れ"
    if (code === 2) return "一部曇り"
    if (code === 3) return "曇り"
    if (code >= 51 && code <= 67) return "雨"
    if (code >= 71 && code <= 77) return "雪"
    if (code >= 95) return "雷雨"
    return "不明"
}

export function LocalWeatherSummary({ latitude, longitude, placeName }: LocalWeatherSummaryProps) {
    const [current, setCurrent] = React.useState<any>(null)
    const [daily, setDaily] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(false)

    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (!latitude || !longitude) return

        setLoading(true)
        setError(null)
        // Fetch current and daily weather
        // Removed specific model request to allow auto-selection (fixes 400 error)
        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Weather API Error: ${res.statusText}`)
                }
                return res.json()
            })
            .then((data) => {
                if (!data.current || !data.daily) {
                    throw new Error("Invalid weather data received")
                }
                setCurrent(data.current)
                setDaily(data.daily)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setError("天気情報の取得に失敗しました。")
                setLoading(false)
            })
    }, [latitude, longitude])

    if (loading) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
                <p>{error}</p>
            </div>
        )
    }

    if (!current || !daily) return null

    return (
        <div className="space-y-6">
            {/* Current Weather */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-blue-900">
                        {placeName} の現在の天気
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    {getWeatherIcon(current.weather_code)}
                    <div>
                        <div className="text-3xl font-bold text-blue-900">
                            {current.temperature_2m}<span className="text-lg font-normal">°C</span>
                        </div>
                        <div className="text-sm text-blue-700 font-medium">
                            {getWeatherDescription(current.weather_code)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Forecast */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 ml-1">週間予報</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {daily.time.map((date: string, index: number) => {
                        // Only show up to 7 days
                        if (index > 6) return null

                        const d = new Date(date)
                        const dayName = d.toLocaleDateString("ja-JP", { weekday: "short" })
                        const isToday = index === 0

                        return (
                            <Card key={date} className={`flex flex-col items-center justify-center p-2 text-center ${isToday ? 'border-orange-300 bg-orange-50' : ''}`}>
                                <div className="text-xs text-muted-foreground mb-1">{date.slice(5).replace('-', '/')} ({dayName})</div>
                                <div className="mb-2">
                                    {getWeatherIcon(daily.weather_code[index], "h-6 w-6")}
                                </div>
                                <div className="text-xs font-medium">
                                    <span className="text-red-500">{Math.round(daily.temperature_2m_max[index])}°</span>
                                    <span className="mx-1 text-slate-300">|</span>
                                    <span className="text-blue-500">{Math.round(daily.temperature_2m_min[index])}°</span>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
