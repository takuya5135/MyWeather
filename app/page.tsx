"use client"

import * as React from "react"
import { RegionSelector, GeoLocation } from "@/components/RegionSelector"
import { WeatherAggregator } from "@/components/WeatherAggregator"
import { LocalWeatherSummary } from "@/components/LocalWeatherSummary"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Heart, Trash2 } from "lucide-react"

// Fixed Favorites
const FIXED_FAVORITES: GeoLocation[] = [
  {
    id: 1856358,
    name: "西宮市",
    admin1: "兵庫県",
    country_code: "JP",
    latitude: 34.7376,
    longitude: 135.3415,
    postalCode: "6628567",
    address: "西宮市六湛寺町"
  },
  {
    id: 1853909, // Approximate ID
    name: "大阪市中央区",
    admin1: "大阪府",
    country_code: "JP",
    latitude: 34.6812,
    longitude: 135.5098,
    postalCode: "5418518",
    address: "大阪市中央区久太郎町"
  },
  {
    id: 1865271, // Approximate ID
    name: "尼崎市",
    admin1: "兵庫県",
    country_code: "JP",
    latitude: 34.7338,
    longitude: 135.4063,
    postalCode: "6608501",
    address: "尼崎市東七松町"
  }
]

// Default Location: Nishinomiya
const DEFAULT_LOCATION = FIXED_FAVORITES[0];

export default function Home() {
  const [location, setLocation] = React.useState<GeoLocation | null>(DEFAULT_LOCATION)
  const [customFavorites, setCustomFavorites] = React.useState<GeoLocation[]>([])

  // Load favorites from local storage
  React.useEffect(() => {
    const saved = localStorage.getItem("weather-favorites")
    if (saved) {
      try {
        setCustomFavorites(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse favorites", e)
      }
    }
  }, [])

  // Combine Fixed and Custom
  const allFavorites = [...FIXED_FAVORITES, ...customFavorites.filter(c => !FIXED_FAVORITES.some(f => f.name === c.name && f.admin1 === c.admin1))]

  // Save favorites (only customs)
  const toggleFavorite = () => {
    if (!location) return

    // If it's a fixed favorite, do nothing (or maybe allow "unfavoriting" implies hiding? 
    // Requirement says "Fix top 3". So likely they are permanent.)
    const isFixed = FIXED_FAVORITES.some(f => f.name === location.name && f.admin1 === location.admin1);
    if (isFixed) return;

    const exists = customFavorites.find(f => f.name === location.name && f.admin1 === location.admin1)
    let newFavorites
    if (exists) {
      newFavorites = customFavorites.filter(f => f !== exists)
    } else {
      newFavorites = [...customFavorites, location]
    }

    setCustomFavorites(newFavorites)
    localStorage.setItem("weather-favorites", JSON.stringify(newFavorites))
  }

  const deleteFavorite = (e: React.MouseEvent, target: GeoLocation) => {
    e.stopPropagation();
    const newFavorites = customFavorites.filter(f => f !== target);
    setCustomFavorites(newFavorites);
    localStorage.setItem("weather-favorites", JSON.stringify(newFavorites));
  }

  const isCurrentFavorite = location && allFavorites.some(f => f.name === location.name && f.admin1 === location.admin1)
  const isCurrentFixed = location && FIXED_FAVORITES.some(f => f.name === location.name && f.admin1 === location.admin1)

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-2">
          <Sun className="h-6 w-6 text-orange-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            天気予報まとめ
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Controls Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            地域・スポットを検索
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <RegionSelector
                onLocationSelect={setLocation}
                selectedLocation={location}
              />

              {/* Favorites List */}
              {allFavorites.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">お気に入りの地域:</p>
                  <div className="flex flex-wrap gap-2">
                    {allFavorites.map((fav, i) => {
                      const isFixed = FIXED_FAVORITES.some(f => f.name === fav.name && f.admin1 === fav.admin1);
                      return (
                        <div key={i} className="group flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(fav)}
                            className={location?.name === fav.name ? "border-orange-400 bg-orange-50" : ""}
                          >
                            <Heart className={`mr-1 h-3 w-3 ${location?.name === fav.name ? "fill-orange-500 text-orange-500" : "fill-current"}`} />
                            {fav.name}
                          </Button>
                          {/* Delete Button (visible on hover) - Only for Custom Favorites */}
                          {!isFixed && (
                            <button
                              onClick={(e) => deleteFavorite(e, fav)}
                              className="text-slate-400 hover:text-red-500 hidden group-hover:block"
                              title="削除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Results Section */}
        {location && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b-2 border-orange-400 pb-2">
              <h2 className="text-2xl font-bold text-slate-800">
                {location.name} の天気予報
              </h2>
              <Button
                variant={isCurrentFavorite ? "secondary" : "outline"}
                onClick={toggleFavorite}
                disabled={!!isCurrentFixed}
                className="gap-2"
              >
                <Heart className={`h-4 w-4 ${isCurrentFavorite ? "fill-red-500 text-red-500" : ""}`} />
                {isCurrentFixed ? "固定のお気に入り" : (isCurrentFavorite ? "お気に入り登録済み" : "お気に入りに登録")}
              </Button>
            </div>

            {/* Internal Summary */}
            <LocalWeatherSummary
              latitude={location.latitude}
              longitude={location.longitude}
              placeName={location.name}
            />



            {/* External Providers */}
            <h3 className="text-lg font-semibold text-slate-700 mt-8">
              各社の詳細予報を見る
            </h3>
            <WeatherAggregator location={location} />
          </div>
        )}
      </div>
    </main>
  )
}
