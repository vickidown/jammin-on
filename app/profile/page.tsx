"use client";

import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Calendar, Award, Music, Pencil, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchEvents, Event } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RSVPWithEvent {
  id: string;
  event_id: string;
  created_at: string;
  events: { title: string; date: string; location: string };
}

const INSTRUMENT_OPTIONS = [
  "Guitar", "Bass", "Drums", "Vocals", "Keys", "Harmonica",
  "Violin", "Banjo", "Mandolin", "Saxophone", "Trumpet", "Other"
];

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<RSVPWithEvent[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(true);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [isLoaded, user, router]);

  useEffect(() => { fetchEvents().then(setEvents); }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("rsvps")
      .select("id, event_id, created_at, events(title, date, location)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRsvps(data as unknown as RSVPWithEvent[]);
        setRsvpsLoading(false);
      });
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) { setInstruments(data.instruments || []); setBio(data.bio || ""); setCity(data.city || ""); }
      });
  }, [user]);

  const toggleInstrument = (inst: string) =>
    setInstruments(prev => prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("user_profiles").upsert({
      user_id: user.id, instruments, bio, city,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setSaving(false);
    if (!error) { setSaveSuccess(true); setEditing(false); setTimeout(() => setSaveSuccess(false), 3000); }
  };

  if (!isLoaded || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Loading profile...</p>
    </div>
  );

  const memberSince = new Date(user.createdAt!).toLocaleDateString("en-CA", { month: "long", year: "numeric" });
  const displayName = user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0];
  const upcomingRsvps = rsvps.filter(r => new Date(r.events.date) >= new Date());
  const pastRsvps = rsvps.filter(r => new Date(r.events.date) < new Date());

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-1">My Profile</h1>
        <p className="text-muted-foreground">Your musician profile and activity</p>
      </div>

      {saveSuccess && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl text-sm font-medium">
          ✅ Profile saved!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-5">
          {/* Profile card */}
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                {user.imageUrl ? (
                  <Image src={user.imageUrl} alt="Profile" width={80} height={80}
                    className="rounded-full border-4 border-emerald-100" />
                ) : (
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-emerald-600">
                      {displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-1">{displayName}</h2>
              {city && <p className="text-emerald-600 text-sm font-medium mb-1">📍 {city}</p>}
              <p className="text-muted-foreground text-xs mb-4">{user.emailAddresses[0]?.emailAddress}</p>

              {/* Instrument tags */}
              {instruments.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {instruments.map(inst => (
                    <span key={inst} className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                      🎸 {inst}
                    </span>
                  ))}
                </div>
              )}

              {bio && <p className="text-sm text-muted-foreground italic mb-4">"{bio}"</p>}

              <div className="w-full space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">{memberSince}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total RSVPs</span>
                  <span className="font-medium">{rsvps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upcoming jams</span>
                  <span className="font-medium text-emerald-600">{upcomingRsvps.length}</span>
                </div>
              </div>

              <div className="w-full space-y-2 mt-4">
                <Button onClick={() => setEditing(!editing)} variant="outline" className="w-full" size="sm">
                  <Pencil className="h-3 w-3 mr-2" />
                  {editing ? "Cancel editing" : "Edit musician profile"}
                </Button>
                <a
                  href="https://accounts.clerk.dev/user"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-emerald-600 transition"
                >
                  <ExternalLink className="h-3 w-3" />
                  Change profile photo
                </a>
              </div>
            </div>
          </Card>

          {/* Edit panel — only shows when editing */}
          {editing && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-sm">Edit Musician Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">📍 Your City</label>
                  <input value={city} onChange={e => setCity(e.target.value)}
                    placeholder="e.g. St. Thomas, ON"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">🎵 Short Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="e.g. Blues guitarist looking for weekly jams..."
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 text-muted-foreground">🎸 Instruments</label>
                  <div className="flex flex-wrap gap-2">
                    {INSTRUMENT_OPTIONS.map(inst => (
                      <button key={inst} onClick={() => toggleInstrument(inst)}
                        className={`px-3 py-1 rounded-full border text-xs transition ${
                          instruments.includes(inst)
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "hover:border-emerald-400 text-muted-foreground"
                        }`}>
                        {inst}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={saveProfile} disabled={saving} className="w-full" size="sm">
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming RSVPs */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold">My Upcoming Jams</h3>
            </div>
            {rsvpsLoading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : upcomingRsvps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-3">No upcoming jams yet.</p>
                <a href="/events" className="text-emerald-600 text-sm font-medium hover:underline">Browse events →</a>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingRsvps.map(rsvp => (
                  <div key={rsvp.id} className="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="text-right w-16 text-sm text-muted-foreground shrink-0 font-medium">
                      {new Date(rsvp.events.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{rsvp.events.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rsvp.events.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Stats */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <Award className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold">My Activity</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: rsvps.length, label: "Total RSVPs" },
                { value: upcomingRsvps.length, label: "Upcoming Jams" },
                { value: pastRsvps.length, label: "Jams Attended" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-muted/50 p-5 rounded-xl text-center">
                  <p className="text-3xl font-bold text-emerald-600">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <Music className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/post-jam" className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-emerald-700 transition font-medium">
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
