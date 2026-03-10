"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Maximize2, 
  Layers, 
  RefreshCw, 
  Map, 
  Satellite, 
  Mountain,
  ChevronDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-secondary/50">
      <div className="text-center">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading booth map...</p>
      </div>
    </div>
  ),
})

interface BoothHeatmapProps {
  fullscreen?: boolean
}

const issueCategories = [
  { label: "Water Supply", color: "bg-blue-500", count: 42 },
  { label: "Drainage", color: "bg-amber-500", count: 38 },
  { label: "Roads", color: "bg-red-500", count: 27 },
  { label: "Electricity", color: "bg-yellow-500", count: 19 },
  { label: "Sanitation", color: "bg-green-500", count: 15 },
]

const mapStyles = [
  { id: "default", label: "Default", icon: Map, description: "Dark theme" },
  { id: "satellite", label: "Satellite", icon: Satellite, description: "Aerial imagery" },
  { id: "terrain", label: "3D Terrain", icon: Mountain, description: "Topographic view" },
] as const

type MapStyle = "default" | "satellite" | "terrain"

export function BoothHeatmap({ fullscreen = false }: BoothHeatmapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mapStyle, setMapStyle] = useState<MapStyle>("default")

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const currentMapStyle = mapStyles.find(s => s.id === mapStyle)
  const CurrentIcon = currentMapStyle?.icon || Map

  return (
    <Card className={cn("bg-card border-border", fullscreen && "h-full")}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg text-card-foreground">Booth-Level Heatmap</CardTitle>
          <p className="text-sm text-muted-foreground">Real-time citizen feedback by ECI booth boundaries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="border-border text-foreground"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          
          {/* Map Style Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-border text-foreground">
                <CurrentIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{currentMapStyle?.label}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {mapStyles.map((style) => {
                const Icon = style.icon
                return (
                  <DropdownMenuItem 
                    key={style.id}
                    onClick={() => setMapStyle(style.id)}
                    className={cn(
                      "flex items-center gap-3 cursor-pointer",
                      mapStyle === style.id && "bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{style.label}</p>
                      <p className="text-xs text-muted-foreground">{style.description}</p>
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" className="border-border text-foreground">
            <Layers className="h-4 w-4" />
          </Button>
          {!fullscreen && (
            <Button variant="outline" size="icon" className="border-border text-foreground">
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Issue Category Filter */}
        <div className="flex flex-wrap gap-2 border-b border-border px-6 py-3">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            All Issues
          </Button>
          {issueCategories.map((category) => (
            <Button
              key={category.label}
              variant={selectedCategory === category.label ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.label)}
              className="gap-2 text-xs border-border"
            >
              <span className={cn("h-2 w-2 rounded-full", category.color)} />
              {category.label}
              <Badge variant="secondary" className="ml-1 bg-secondary text-secondary-foreground">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Map Container */}
        <div className={cn("relative", fullscreen ? "h-[calc(100%-120px)]" : "h-80")}>
          <MapComponent selectedCategory={selectedCategory} mapStyle={mapStyle} />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-card/95 p-3 shadow-lg backdrop-blur border border-border">
            <p className="mb-2 text-xs font-semibold text-card-foreground">Sentiment Score</p>
            <div className="flex items-center gap-1">
              <div className="h-3 w-16 rounded-sm bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Negative</span>
              <span>Positive</span>
            </div>
          </div>

          {/* Map Style Indicator */}
          <div className="absolute top-4 left-4 z-[1000]">
            <Badge 
              variant="secondary" 
              className="bg-card/95 backdrop-blur border border-border text-card-foreground shadow-lg"
            >
              <CurrentIcon className="mr-1.5 h-3 w-3 text-primary" />
              {currentMapStyle?.label} View
            </Badge>
          </div>

          {/* Quick Stats Overlay */}
          <div className="absolute right-4 top-4 z-[1000] space-y-2">
            <div className="rounded-lg bg-card/95 px-3 py-2 shadow-lg backdrop-blur border border-border">
              <p className="text-xs text-muted-foreground">Active Booths</p>
              <p className="text-lg font-bold text-card-foreground">247</p>
            </div>
            <div className="rounded-lg bg-card/95 px-3 py-2 shadow-lg backdrop-blur border border-border">
              <p className="text-xs text-muted-foreground">Hotspots</p>
              <p className="text-lg font-bold text-destructive">12</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
