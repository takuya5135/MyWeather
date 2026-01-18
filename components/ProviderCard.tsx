import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface ProviderCardProps {
    name: string
    url: string
    description?: string
    colorClass?: string
}

export function ProviderCard({ name, url, description, colorClass = "bg-blue-500" }: ProviderCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader className={`${colorClass} text-white rounded-t-xl`}>
                <CardTitle className="text-lg">{name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                    {description || `${name}で天気を確認します。`}
                </p>
                <div className="rounded-md border p-2 bg-muted/50 text-xs break-all hidden sm:block">
                    {url}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        サイトを開く
                    </a>
                </Button>
            </CardFooter>
        </Card>
    )
}
