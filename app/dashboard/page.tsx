import { Card } from "@/components/ui/card";
import { Calendar, Users, MapPin, Music } from "lucide-react";
import { fetchEvents } from "@/lib/data";

export default async function DashboardPage() {
  const events = await fetchEvents();
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Welcome to JamFinder</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Music className="h-10 w-10 text-emerald-600" />
            <div>
              <p className="text-3xl font-bold">{events.length}</p>
              <p className="text-sm text-muted-foreground">Active Jams</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-10 w-10 text-emerald-600" />
            <div>
              <p className="text-3xl font-bold">248</p>
              <p className="text-sm text-muted-foreground">Musicians</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <MapPin className="h-10 w-10 text-emerald-600" />
            <div>
              <p className="text-3xl font-bold">
                {new Set(events.map((e) => e.location)).size}
              </p>
              <p className="text-sm text-muted-foreground">Cities</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-10 w-10 text-emerald-600" />
            <div>
              <p className="text-3xl font-bold">
                {events.filter((e) => {
                  const eventDate = new Date(e.date);
                  const now = new Date();
                  const weekFromNow = new Date();
                  weekFromNow.setDate(now.getDate() + 7);
                  return eventDate >= now && eventDate <= weekFromNow;
                }).length}
              </p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
          </div>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Upcoming Jams</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="p-6">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {event.date} • {event.location}
            </p>
            <p className="text-sm line-clamp-3">{event.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
