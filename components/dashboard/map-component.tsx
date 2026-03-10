"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapComponentProps {
  selectedCategory: string | null
  mapStyle: "default" | "satellite" | "terrain"
}

// Sample booth data for Delhi constituency
const boothData = [
  { id: 1, name: "Booth 001 - Chandni Chowk", lat: 28.6562, lng: 77.2299, sentiment: 0.82, issues: 3, category: "Water Supply" },
  { id: 2, name: "Booth 002 - Red Fort Area", lat: 28.6562, lng: 77.2410, sentiment: 0.65, issues: 7, category: "Drainage" },
  { id: 3, name: "Booth 003 - Jama Masjid", lat: 28.6507, lng: 77.2334, sentiment: 0.45, issues: 12, category: "Roads" },
  { id: 4, name: "Booth 004 - Darya Ganj", lat: 28.6448, lng: 77.2418, sentiment: 0.78, issues: 4, category: "Electricity" },
  { id: 5, name: "Booth 005 - Kashmere Gate", lat: 28.6678, lng: 77.2287, sentiment: 0.35, issues: 15, category: "Sanitation" },
  { id: 6, name: "Booth 006 - Civil Lines", lat: 28.6804, lng: 77.2244, sentiment: 0.88, issues: 2, category: "Water Supply" },
  { id: 7, name: "Booth 007 - Sadar Bazaar", lat: 28.6596, lng: 77.2050, sentiment: 0.52, issues: 9, category: "Drainage" },
  { id: 8, name: "Booth 008 - Paharganj", lat: 28.6433, lng: 77.2144, sentiment: 0.41, issues: 11, category: "Roads" },
  { id: 9, name: "Booth 009 - Karol Bagh", lat: 28.6519, lng: 77.1905, sentiment: 0.72, issues: 5, category: "Electricity" },
  { id: 10, name: "Booth 010 - Connaught Place", lat: 28.6315, lng: 77.2167, sentiment: 0.91, issues: 1, category: "Sanitation" },
  { id: 11, name: "Booth 011 - Rajiv Chowk", lat: 28.6328, lng: 77.2197, sentiment: 0.68, issues: 6, category: "Water Supply" },
  { id: 12, name: "Booth 012 - India Gate", lat: 28.6129, lng: 77.2295, sentiment: 0.85, issues: 2, category: "Drainage" },
  { id: 13, name: "Booth 013 - Khan Market", lat: 28.6003, lng: 77.2272, sentiment: 0.93, issues: 1, category: "Roads" },
  { id: 14, name: "Booth 014 - Lodhi Colony", lat: 28.5916, lng: 77.2190, sentiment: 0.77, issues: 4, category: "Electricity" },
  { id: 15, name: "Booth 015 - Nizamuddin", lat: 28.5930, lng: 77.2467, sentiment: 0.58, issues: 8, category: "Sanitation" },
]

const mapTiles = {
  default: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
}

function getSentimentColor(sentiment: number): string {
  if (sentiment >= 0.7) return "#22c55e" // green
  if (sentiment >= 0.5) return "#eab308" // yellow  
  return "#ef4444" // red
}

function getRadius(issues: number): number {
  return Math.max(15, Math.min(30, issues * 2 + 10))
}

export default function MapComponent({ selectedCategory, mapStyle }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.CircleMarker[]>([])
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Initialize map centered on Delhi
    mapRef.current = L.map(containerRef.current, {
      center: [28.6448, 77.2167],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    })

    // Initial tile layer
    const tileConfig = mapTiles[mapStyle]
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution,
    }).addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update tile layer when map style changes
  useEffect(() => {
    if (!mapRef.current) return

    // Remove old tile layer
    if (tileLayerRef.current) {
      tileLayerRef.current.remove()
    }

    // Add new tile layer
    const tileConfig = mapTiles[mapStyle]
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      attribution: tileConfig.attribution,
    }).addTo(mapRef.current)
  }, [mapStyle])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Filter booths by category
    const filteredBooths = selectedCategory
      ? boothData.filter(booth => booth.category === selectedCategory)
      : boothData

    // Add booth markers
    filteredBooths.forEach(booth => {
      const marker = L.circleMarker([booth.lat, booth.lng], {
        radius: getRadius(booth.issues),
        fillColor: getSentimentColor(booth.sentiment),
        fillOpacity: 0.7,
        color: getSentimentColor(booth.sentiment),
        weight: 2,
        opacity: 1,
      })

      const popupTextColor = mapStyle === "default" ? "#1a1f35" : "#1a1f35"
      
      marker.bindPopup(`
        <div style="min-width: 220px; color: ${popupTextColor}; padding: 4px;">
          <h3 style="font-weight: bold; margin-bottom: 10px; color: ${popupTextColor}; font-size: 14px;">${booth.name}</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
            <span style="color: #666;">Sentiment Score:</span>
            <span style="font-weight: 600; color: ${getSentimentColor(booth.sentiment)};">${Math.round(booth.sentiment * 100)}%</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
            <span style="color: #666;">Active Issues:</span>
            <span style="font-weight: 600; color: ${popupTextColor};">${booth.issues}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
            <span style="color: #666;">Top Category:</span>
            <span style="font-weight: 600; color: ${popupTextColor};">${booth.category}</span>
          </div>
          <button style="width: 100%; padding: 10px; background: linear-gradient(135deg, #d4a73a 0%, #f4c842 100%); color: #1a1f35; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            View Full Details
          </button>
        </div>
      `, {
        className: "custom-popup"
      })

      marker.addTo(mapRef.current!)
      markersRef.current.push(marker)
    })
  }, [selectedCategory, mapStyle])

  return (
    <div 
      ref={containerRef} 
      className="h-full w-full"
      style={{ minHeight: "300px", isolation: "isolate" }}
    />
  )
}
