"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchEvents, Event } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const venueConfig = {
  "bar": { color: "#ef4444", label: "Bar / Pub" },
  "community": { color: "#3b82f6", label: "Community Hall" },
  "private-home": { color: "#8b5cf6", label: "Private Home" },
  "studio": { color: "#f59e0b", label: "Studio / Venue" },
  "other": { color: "#10b981", label: "Other" },
};

export default function EventsPage() {
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then((events) => {
      const formatted = events.map((ev: Event) => {
        const config = venueConfig[ev.venueType as keyof typeof venueConfig] || venueConfig.other;
        return {
          id: ev.id,
          title: ev.title,
          start: ev.date,
          backgroundColor: config.color,
          borderColor: config.color,
          textColor: "#ffffff",
          extendedProps: ev,
        };
      });
      setCalendarEvents(formatted);
      setLoading(false);
    });
  }, []);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps);
  };

  const handleRSVP = (eventId: string) => {
    alert(`✅ RSVP confirmed for event ${eventId}!\n\n(Real RSVP system coming soon)`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Ontario Jam Calendar</h1>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                eventClick={handleEventClick}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek",
                }}
                height="auto"
                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  meridiem: "short",
                }}
              />
            </Card>
          </div>

          {/* Event Details + RSVP */}
          <div className="lg:col-span-1">
            {selectedEvent ? (
              <Card className="p-6 sticky top-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow"
                    style={{
                      backgroundColor:
                        venueConfig[selectedEvent.venueType as keyof typeof venueConfig]?.color || "#10b981",
                    }}
                  />
                  <span className="text-sm font-medium">
                    {venueConfig[selectedEvent.venueType as keyof typeof venueConfig]?.label || "Event"}
                  </span>
                </div>

                <h2 className="text-2xl font-semibold mb-2">{selectedEvent.title}</h2>
                <p className="text-muted-foreground mb-4">
                  {selectedEvent.date} • {selectedEvent.location}
                </p>
                <p className="leading-relaxed mb-6">{selectedEvent.description}</p>

                <Button onClick={() => handleRSVP(selectedEvent.id)} className="w-full">
                  RSVP — I'm Going!
                </Button>
              </Card>
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                Click any event on the calendar to see details and RSVP.
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}