"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fetchEvents, Event } from "@/lib/data";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

type VenueType = "bar" | "community" | "private-home" | "studio" | "other";

const venueConfig: Record<VenueType, { color: string; label: string; emoji: string }> = {
  "bar": { color: "#ef4444", label: "Bar / Pub", emoji: "🍺" },
  "community": { color: "#3b82f6", label: "Community Hall", emoji: "🏛️" },
  "private-home": { color: "#8b5cf6", label: "Private Home", emoji: "🏠" },
  "studio": { color: "#f59e0b", label: "Studio / Venue", emoji: "🎤" },
  "other": { color: "#10b981", label: "Other", emoji: "🎸" },
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4);"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

export default function MapComponent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleTypes, setVisibleTypes] = useState<Record<VenueType, boolean>>({
    "bar": true,
    "community": true,
    "private-home": true,
    "studio": true,
    "other": true,
  });

  const [messageEvent, setMessageEvent] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    fetchEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const toggleType = (type: VenueType) => {
    setVisibleTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredEvents = events.filter(event =>
    visibleTypes[event.venueType as VenueType]
  );

  const sendMessage = () => {
    if (!messageEvent || !messageText.trim()) return;
    alert(`✅ Message sent to host of "${messageEvent.title}"!\n\nYour message:\n"${messageText}"\n\n(Real messaging coming soon)`);
    setMessageText("");
    setMessageEvent(null);
  };

  if (loading) {
    return <p className="text-center py-12 text-muted-foreground">Loading map...</p>;
  }

  return (
    <div className="relative">
      <MapContainer
        center={[42.777, -81.183]}
        zoom={9}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredEvents.map((event) => {
          const config = venueConfig[event.venueType as VenueType];
          const isPrivate = event.type === "private" || event.venueType === "private-home";

          return (
            <Marker
              key={event.id}
              position={[event.lat, event.lng]}
              icon={createCustomIcon(config.color)}
            >
              <Popup>
                <div className="font-semibold text-base mb-1">{event.title}</div>
                <div className="text-sm text-gray-600">
                  {event.date} • {event.location}
                </div>
                <div className="mt-2 text-xs uppercase tracking-widest flex items-center gap-1">
                  {config.emoji} {config.label}
                </div>
                <div className="text-sm mt-3 leading-snug">{event.description}</div>

                {isPrivate && (
                  <Button
                    onClick={() => setMessageEvent(event)}
                    className="w-full mt-4 bg-violet-600 hover:bg-violet-700"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Host for Details
                  </Button>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend / Filters */}
      <Card className="absolute top-4 right-4 p-5 w-72 z-[1000] shadow-xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          🎯 Show on Map
        </h3>

        <div className="space-y-3">
          {Object.entries(venueConfig).map(([key, config]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm">{config.emoji} {config.label}</span>
              </div>
              <Button
                variant={visibleTypes[key as VenueType] ? "default" : "outline"}
                size="sm"
                onClick={() => toggleType(key as VenueType)}
              >
                {visibleTypes[key as VenueType] ? "On" : "Off"}
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-6"
          onClick={() => setVisibleTypes({ bar: true, community: true, "private-home": true, studio: true, other: true })}
        >
          Show All
        </Button>
      </Card>

      {/* Message Modal */}
      {messageEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000]">
          <Card className="w-full max-w-md p-8">
            <h3 className="text-xl font-semibold mb-2">Message Host</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Asking about: <strong>{messageEvent.title}</strong>
            </p>

            <textarea
              className="w-full h-32 p-4 border rounded-xl resize-y min-h-[120px] mb-6"
              placeholder="Hi! I'm interested in your jam. What time should I arrive?"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setMessageEvent(null); setMessageText(""); }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="flex-1"
              >
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
