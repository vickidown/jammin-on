"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";

// Dynamically import the map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <p className="text-center py-12">Loading map...</p>,
});

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Jam Locations in Ontario</h1>
      <p className="text-muted-foreground mb-8">
        Click on the markers to see event details. Centered around St. Thomas, London, and Toronto.
      </p>

      <Card className="overflow-hidden">
        <MapComponent />
      </Card>

      <div className="mt-8 text-sm text-muted-foreground">
        💡 Tip: Zoom in/out and click markers for more info. More events will be added soon.
      </div>
    </div>
  );
}