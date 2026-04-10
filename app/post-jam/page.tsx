"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, MapPin, Calendar, Users } from "lucide-react";

const venueTypes = [
  { value: "bar", label: "🍺 Bar / Pub" },
  { value: "community", label: "🏛️ Community Hall" },
  { value: "private-home", label: "🏠 Private Home" },
  { value: "studio", label: "🎤 Studio / Venue" },
  { value: "other", label: "🎸 Other" },
];

const instrumentOptions = [
  "Guitar", "Bass", "Drums", "Vocals", "Keys", "Harmonica",
  "Violin", "Banjo", "Mandolin", "Saxophone", "Trumpet", "Other"
];

export default function PostJamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    lat: "",
    lng: "",
    type: "public",
    venueType: "bar",
    instruments: [] as string[],
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleInstrument = (instrument: string) => {
    setForm((prev) => ({
      ...prev,
      instruments: prev.instruments.includes(instrument)
        ? prev.instruments.filter((i) => i !== instrument)
        : [...prev.instruments, instrument],
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.title || !form.date || !form.location || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    // Default coords for Ontario cities if not provided
    const lat = form.lat ? parseFloat(form.lat) : 42.777;
    const lng = form.lng ? parseFloat(form.lng) : -81.183;

    const { error: supabaseError } = await supabase.from("events").insert({
      title: form.title,
      date: form.date,
      location: form.location,
      lat,
      lng,
      type: form.type,
      venue_type: form.venueType,
      instruments: form.instruments,
      description: form.description,
    });

    setLoading(false);

    if (supabaseError) {
      setError("Something went wrong. Please try again.");
      console.error(supabaseError);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/events"), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🎸</div>
          <h2 className="text-3xl font-bold mb-4">Jam Posted!</h2>
          <p className="text-muted-foreground text-lg">
            Your event is live. Redirecting to the calendar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Post a Jam</h1>
        <p className="text-muted-foreground text-lg">
          Share your session with musicians across Ontario
        </p>
      </div>

      <Card className="p-8 space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Music className="inline h-4 w-4 mr-1 text-emerald-600" />
            Jam Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Friday Night Blues Jam"
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="inline h-4 w-4 mr-1 text-emerald-600" />
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <MapPin className="inline h-4 w-4 mr-1 text-emerald-600" />
            Location <span className="text-red-500">*</span>
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. St. Thomas, ON"
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Venue Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Venue Type</label>
          <select
            name="venueType"
            value={form.venueType}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {venueTypes.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Public / Private */}
        <div>
          <label className="block text-sm font-medium mb-2">Event Type</label>
          <div className="flex gap-4">
            {["public", "private"].map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${
                  form.type === t
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "hover:border-emerald-400"
                }`}
              >
                {t === "public" ? "🌍 Public" : "🔒 Private"}
              </button>
            ))}
          </div>
        </div>

        {/* Instruments */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Users className="inline h-4 w-4 mr-1 text-emerald-600" />
            Instruments Welcome
          </label>
          <div className="flex flex-wrap gap-2">
            {instrumentOptions.map((inst) => (
              <button
                key={inst}
                onClick={() => toggleInstrument(inst.toLowerCase())}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  form.instruments.includes(inst.toLowerCase())
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "hover:border-emerald-400"
                }`}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell musicians what to expect — skill level, style, what to bring..."
            rows={4}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-6 text-lg"
        >
          {loading ? "Posting..." : "🎸 Post My Jam!"}
        </Button>
      </Card>
    </div>
  );
}
