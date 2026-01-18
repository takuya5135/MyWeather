"use client"

import * as React from "react"
import { Search, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export interface GeoLocation {
    id: number
    name: string
    admin1?: string
    country_code: string
    latitude: number
    longitude: number
    postalCode?: string // Added postal code
    address?: string // Added address (City + Town)
}

interface RegionSelectorProps {
    onLocationSelect: (location: GeoLocation) => void
    selectedLocation: GeoLocation | null
}

export function RegionSelector({ onLocationSelect, selectedLocation }: RegionSelectorProps) {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<GeoLocation[]>([])
    const [loading, setLoading] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)

    const handleSearch = async (value: string) => {
        setQuery(value)
        if (value.length < 2) {
            setResults([])
            setIsOpen(false)
            return
        }

        setLoading(true)
        try {
            // Use our local proxy to GSI API for better Japanese address search
            const res = await fetch(
                `/api/search-location?q=${encodeURIComponent(value)}`
            )
            const data = await res.json()
            if (data.results) {
                setResults(data.results)
                setIsOpen(true)
            } else {
                setResults([])
                setIsOpen(false)
            }
        } catch (error) {
            console.error("Search error:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = async (loc: GeoLocation) => {
        // Optimistic update first to show selection
        setQuery(loc.name)
        setIsOpen(false)

        // Fetch Postal Code and Address using our server-side proxy
        let postalCode = "";
        let address = "";

        try {
            const res = await fetch(`/api/postal-code?lat=${loc.latitude}&lon=${loc.longitude}`);
            const data = await res.json();
            if (data.postalCode) {
                postalCode = data.postalCode;
            }
            if (data.city && data.town) {
                address = data.city + data.town;
            }
        } catch (e) {
            console.error("Failed to fetch postal code", e);
        }

        // Pass location with postal code and address
        onLocationSelect({ ...loc, postalCode, address });
    }

    return (
        <div className="relative w-full max-w-sm">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="地名・スポット名を入力 (例: 西宮市, 甲子園球場)"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                />
                {loading && (
                    <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {isOpen && results.length > 0 && (
                <Card className="mt-1 w-full max-h-[300px] overflow-auto p-1">
                    <ul className="space-y-1">
                        {results.map((loc) => (
                            <li key={loc.id}>
                                <Button
                                    className="w-full justify-start text-left font-normal"
                                    onClick={() => handleSelect(loc)}
                                >
                                    <MapPin className="mr-2 h-4 w-4 opacity-50" />
                                    <span>
                                        {loc.name}
                                        {loc.admin1 && <span className="ml-2 text-xs text-muted-foreground">{loc.admin1}</span>}
                                    </span>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {selectedLocation && !isOpen && (
                <div className="mt-2 text-sm text-green-600 font-medium flex items-center flex-wrap gap-2">
                    <span className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        選択中: {selectedLocation.name} {selectedLocation.admin1 && `(${selectedLocation.admin1})`}
                    </span>
                    {selectedLocation.postalCode && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            〒{selectedLocation.postalCode}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

/* 
 * Note: Since I am manually creating "variant" support for Button in this step, 
 * I will rely on standard classes for now if variant prop is not fully implemented in my simplified Button component.
 * I should update Button component to support 'ghost' variant-like styling or just use classNames inline.
 * My current Button component is simple. I will use className override.
 */
