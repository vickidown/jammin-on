"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, MapPin, Music } from "lucide-react";

const instrumentOptions = [
  "Guitar", "Bass", "Drums", "Vocals", "Keys", "Harmonica",
  "Violin", "Banjo", "Mandolin", "Saxophone", "Trumpet", "Other"
];

const urgencyOptions = [
  { value: "urgent", label: "🔴 Urgent — This Weekend" },
  { value: "this-week", label: "🟡 This Week" },
  { value: "ongoing", label: "🟢 Ongoing" },
];

export default function PostJamCallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    instrument_needed: "",
    genre: "",
    description: "",
    location: "",
    urgency: "ongoing",
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.instrument_needed || !form.description || !form.location) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: supabaseError } = await supabase.from("jam_calls").insert({
      instrument_needed: form.instrument_needed,
      genre: form.genre,
      description: form.description,
      location: form.location,
      urgency: form.urgency,
      date: form.date || "Ongoing",
    });

    setLoading(false);

    if (supabaseError) {
      setError("Something went wrong. Please try again.");
      console.error(supabaseError);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/"), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">📣</div>
          <h2 className="text-3xl font-bold mb-4">Jam Call Posted!</h2>
          <p className="text-muted-foreground text-lg">
            Musicians will see your call on the home page. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Post a Jam Call</h1>
        <p className="text-muted-foreground text-lg">
          Looking for a specific musician? Let the community know!
        </p>
      </div>

      <Card className="p-8 space-y-8">
        {/* Instrument needed */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Music className="inline h-4 w-4 mr-1 text-emerald-600" />
            Instrument Needed <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {instrumentOptions.map((inst) => (
              <button
                key={inst}
                onClick={() => setForm({ ...form, instrument_needed: inst })}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  form.instrument_needed === inst
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "hover:border-emerald-400"
                }`}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium mb-2">Genre / Style</label>
          <input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            placeholder="e.g. Blues, Folk, Rock, Jazz..."
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
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
            placeholder="Describe what you're looking for — skill level, style, when and where you jam..."
            rows={4}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
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

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Date or Timeframe</label>
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="e.g. Apr 20, Every Saturday, Ongoing..."
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium mb-2">Urgency</label>
          <div className="flex flex-col gap-2">
            {urgencyOptions.map((u) => (
              <button
                key={u.value}
                onClick={() => setForm({ ...form, urgency: u.value })}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition text-left ${
                  form.urgency === u.value
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "hover:border-emerald-400"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleSubmit} disabled={loading} className="w-full py-6 text-lg">
          {loading ? "Posting..." : "📣 Post My Jam Call!"}
        </Button>
      </Card>
    </div>
  );
}
