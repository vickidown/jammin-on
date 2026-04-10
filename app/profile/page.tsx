"use client";

import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Calendar, Award, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchEvents, Event } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RSVPWithEvent {
  id: string;
  event_id: string;
  created_at: string;
  events: {
    title: string;
    date: string;
    location: string;
  };
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<RSVPWithEvent[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("rsvps")
      .select("id, event_id, created_at, events(title, date, location)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setRsvps(data as RSVPWithEvent[]);
        }
        setRsvpsLoading(false);
      });
  }, [user]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const memberSince = new Date(user.createdAt!).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });

  const upcomingRsvps = rsvps.filter(
    (r) => new Date(r.events.date) >= new Date()
  );

  const pastRsvps = rsvps.filter(
    (r) => new Date(r.events.date) < new Date()
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your musician profile and activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="p-8 text-center">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full mx-auto mb-6 border-4 border-emerald-100"
              />
            ) : (
              <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-emerald-600">
                  {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-1">
              {user.fullName || user.emailAddresses[0]?.emailAddress}
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              {user.emailAddresses[0]?.emailAddress}
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since:</span>
                <span className="font-medium">{memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total RSVPs:</span>
                <span className="font-medium">{rsvps.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Upcoming jams:</span>
                <span className="font-medium text-emerald-600">{upcomingRsvps.length}</span>
              </div>
            </div>

            <button
              onClick={() => window.open("https://accounts.clerk.dev/user", "_blank")}
              className="mt-8 w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition text-sm"
            >
              Edit Profile
            </button>
          </Card>
        </div>

        {/* Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming RSVPs */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold">My Upcoming Jams</h3>
            </div>

            {rsvpsLoading ? (
              <p className="text-muted-foreground text-sm">Loading your jams...</p>
            ) : upcomingRsvps.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm mb-4">You haven't RSVP'd to any upcoming jams yet.</p>
                <a href="/events" className="text-emerald-600 text-sm font-medium hover:underline">
                  Browse events →
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingRsvps.map((rsvp) => (
                  <div key={rsvp.id} className="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="text-right w-20 text-sm text-muted-foreground shrink-0">
                      {new Date(rsvp.events.date).toLocaleDateString("en-CA", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div>
                      <p className="font-medium">{rsvp.events.title}</p>
                      <p className="text-sm text-muted-foreground">{rsvp.events.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Stats */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold">My Activity</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-muted/50 p-6 rounded-xl text-center">
                <p className="text-3xl font-bold text-emerald-600">{rsvps.length}</p>
                <p className="text-sm text-muted-foreground">Total RSVPs</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-xl text-center">
                <p className="text-3xl font-bold text-emerald-600">{upcomingRsvps.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming Jams</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-xl text-center">
                <p className="text-3xl font-bold text-emerald-600">{pastRsvps.length}</p>
                <p className="text-sm text-muted-foreground">Jams Attended</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Music className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold">Quick Actions</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/post-jam" className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-emerald-700 transition">
                + Post a Jam
              </a>
              <a href="/events" className="border px-5 py-2 rounded-lg text-sm hover:border-emerald-400 transition">
                Browse Events
              </a>
              <a href="/ai" className="border px-5 py-2 rounded-lg text-sm hover:border-emerald-400 transition">
                Ask AI Assistant
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
