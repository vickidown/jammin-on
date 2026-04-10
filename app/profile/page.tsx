"use client";

import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Calendar, Award, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchEvents, Event } from "@/lib/data";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

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

  const upcomingEvents = events.slice(0, 3);

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
            {/* Avatar */}
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
                <span className="text-muted-foreground">Events available:</span>
                <span className="font-medium">{events.length}</span>
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
          {/* Upcoming Jams */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold">Upcoming Jams Near You</h3>
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming events yet.</p>
            ) : (
              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="text-right w-20 text-sm text-muted-foreground shrink-0">
                      {new Date(event.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
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
                <p className="text-3xl font-bold text-emerald-600">{events.length}</p>
                <p className="text-sm text-muted-foreground">Active Jams</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-xl text-center">
                <p className="text-3xl font-bold text-emerald-600">0</p>
                <p className="text-sm text-muted-foreground">RSVPs (coming soon)</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-xl text-center">
                <p className="text-3xl font-bold text-emerald-600">0</p>
                <p className="text-sm text-muted-foreground">Jams Posted</p>
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
