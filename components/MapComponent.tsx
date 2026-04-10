"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fetchEvents, Event } from "@/lib/data";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

type VenueType = "bar" | "community" | "private-home" | "studio" | "other";

const venueConfig: Record<VenueType, { color: string; label: string; emoji: string }> = {
  "bar":          { color: "#ef4444", label: "Bar / Pub",       emoji: "🍺" },
  "community":    { color: "#3b82f6", label: "Community Hall",  emoji: "🏛️" },
  "private-home": { color: "#8b5cf6", label: "Private Home",    emoji: "🏠" },
  "studio":       { color: "#f59e0b", label: "Studio / Venue",  emoji: "🎤" },
  "other":        { color: "#10b981", label: "Other",           emoji: "🎸" },
};

const createCustomIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width: 14px; height: 14px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

export default function MapComponent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleTypes, setVisibleTypes] = useState<Record<VenueType, boolean>>({
    "bar": true, "community": true, "private-home": true, "studio": true, "other": true,
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
    fetchEvents().then((data) => { setEvents(data); setLoading(false); });
  }, []);

  const toggleType = (type: VenueType) =>
    setVisibleTypes(prev => ({ ...prev, [type]: !prev[type] }));

  const filteredEvents = events.filter(e => visibleTypes[e.venueType as VenueType]);

  const sendMessage = () => {
    if (!messageEvent || !messageText.trim()) return;
    alert(`Message sent to host of "${messageEvent.title}"!\n\n"${messageText}"\n\n(Real messaging coming soon)`);
    setMessageText("");
    setMessageEvent(null);
  };

  if (loading) return (
    <div style={{ height: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", borderRadius: 12 }}>
      <p style={{ color: "#94a3b8", fontFamily: "system-ui", fontSize: 14 }}>Loading map...</p>
    </div>
  );

  return (
    <div style={{ position: "relative", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <MapContainer
        center={[42.777, -81.183]}
        zoom={9}
        style={{ height: 600, width: "100%", borderRadius: 12 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredEvents.map((event) => {
          const config = venueConfig[event.venueType as VenueType] || venueConfig.other;
          const isPrivate = event.type === "private" || event.venueType === "private-home";
          return (
            <Marker key={event.id} position={[event.lat, event.lng]} icon={createCustomIcon(config.color)}>
              <Popup>
                <div style={{ fontFamily: "system-ui, sans-serif", minWidth: 200, maxWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: config.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {config.label}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>
                    {event.title}
                  </p>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#64748b" }}>
                    {event.date} · {event.location}
                  </p>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                    {event.description}
                  </p>
                  {isPrivate && (
                    <button
                      onClick={() => setMessageEvent(event)}
                      style={{
                        width: "100%", padding: "7px 12px", background: "#7c3aed",
                        color: "white", border: "none", borderRadius: 8,
                        fontSize: 12, fontWeight: 500, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      Message Host
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend panel */}
      <div style={{
        position: "absolute", top: 12, right: 12, zIndex: 1000,
        background: "white", borderRadius: 12, padding: "14px 16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)", minWidth: 180,
        border: "1px solid #e2e8f0",
      }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Venue type
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(venueConfig).map(([key, config]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: visibleTypes[key as VenueType] ? config.color : "#cbd5e1",
                  border: "1.5px solid white",
                  boxShadow: "0 0 0 1px #e2e8f0",
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 12, color: visibleTypes[key as VenueType] ? "#1e293b" : "#94a3b8" }}>
                  {config.label}
                </span>
              </div>
              <button
                onClick={() => toggleType(key as VenueType)}
                style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 20,
                  border: `1px solid ${visibleTypes[key as VenueType] ? config.color : "#e2e8f0"}`,
                  background: visibleTypes[key as VenueType] ? `${config.color}15` : "transparent",
                  color: visibleTypes[key as VenueType] ? config.color : "#94a3b8",
                  cursor: "pointer", fontWeight: 500,
                }}
              >
                {visibleTypes[key as VenueType] ? "on" : "off"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          <button
            onClick={() => setVisibleTypes({ bar: true, community: true, "private-home": true, studio: true, other: true })}
            style={{
              flex: 1, fontSize: 11, padding: "5px 0",
              border: "1px solid #e2e8f0", borderRadius: 8, background: "transparent",
              color: "#64748b", cursor: "pointer",
            }}
          >
            Show all
          </button>
          <button
            onClick={() => setVisibleTypes({ bar: false, community: false, "private-home": false, studio: false, other: false })}
            style={{
              flex: 1, fontSize: 11, padding: "5px 0",
              border: "1px solid #e2e8f0", borderRadius: 8, background: "transparent",
              color: "#64748b", cursor: "pointer",
            }}
          >
            Hide all
          </button>
        </div>
      </div>

      {/* Message modal */}
      {messageEvent && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000,
        }}>
          <div style={{
            background: "white", borderRadius: 16, padding: 28, width: "100%",
            maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#0f172a" }}>Message Host</h3>
              <button onClick={() => { setMessageEvent(null); setMessageText(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>
              About: <strong style={{ color: "#0f172a" }}>{messageEvent.title}</strong>
            </p>
            <textarea
              style={{
                width: "100%", height: 120, padding: "10px 12px",
                border: "1px solid #e2e8f0", borderRadius: 10, resize: "none",
                fontSize: 14, fontFamily: "system-ui", color: "#0f172a",
                outline: "none", boxSizing: "border-box",
              }}
              placeholder="Hi! I'm interested in joining your jam..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                onClick={() => { setMessageEvent(null); setMessageText(""); }}
                style={{
                  flex: 1, padding: "9px 0", border: "1px solid #e2e8f0",
                  borderRadius: 10, background: "transparent", fontSize: 14,
                  color: "#64748b", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                style={{
                  flex: 1, padding: "9px 0", border: "none",
                  borderRadius: 10, background: messageText.trim() ? "#7c3aed" : "#e2e8f0",
                  fontSize: 14, color: messageText.trim() ? "white" : "#94a3b8",
                  cursor: messageText.trim() ? "pointer" : "not-allowed", fontWeight: 500,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
