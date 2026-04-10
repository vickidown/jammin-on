"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, MapPin, Calendar, Users, CheckCircle } from "lucide-react";

const venueTypes = [
  { value: "bar", label: "🍺 Bar / Pub" },
  { value: "community", label: "🏛️ Community Hall" },
  { value: "private-home", label: "🏠 Private Home" },
  { value: "studio", label: "🎤 Studio / Venue" },
  { value: "karaoke", label: "🎤 Karaoke" },
  { value: "open-mic", label: "🎙️ Open Mic" },
  { value: "other", label: "🎸 Other" },
];

const instrumentOptions = [
  "Guitar", "Bass", "Drums", "Vocals", "Keys", "Harmonica",
  "Violin", "Banjo", "Mandolin", "Saxophone", "Trumpet", "Other"
];

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function PostJamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Address lookup
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [addressLookingUp, setAddressLookingUp] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    lat: 42.777,
    lng: -81.183,
    type: "public",
    venueType: "bar",
    instruments: [] as string[],
    description: "",
  });

  // Debounced address search
  useEffect(() => {
    if (!addressQuery || addressQuery.length < 4) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setAddressLookingUp(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&limit=5&countrycodes=ca`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setAddressLookingUp(false);
      }
    }, 500);
  }, [addressQuery]);

  const selectAddress = (result: NominatimResult) => {
    const shortName = result.display_name.split(",").slice(0, 3).join(",").trim();
    setForm(prev => ({
      ...prev,
      location: shortName,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    }));
    setAddressQuery(result.display_name);
    setSuggestions([]);
    setAddressConfirmed(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value as any });
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
    if (!form.title || !form.date || !form.location || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: supabaseError } = await supabase.from("events").insert({
      title: form.title,
      date: form.date,
      location: form.location,
      lat: form.lat,
      lng: form.lng,
      type: form.type,
      venue_type: form.venueType,
      instruments: form.instruments,
      description: form.description,
    });

    if (supabaseError) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      console.error(supabaseError);
      return;
    }

    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          date: form.date,
          location: form.location,
          description: form.description,
          venueType: form.venueType,
          type: form.type,
        }),
      });
    } catch (err) {
      console.error("Failed to send notification email:", err);
    }

    setLoading(false);
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

        {/* Address lookup */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <MapPin className="inline h-4 w-4 mr-1 text-emerald-600" />
            Venue Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              value={addressQuery}
              onChange={(e) => {
                setAddressQuery(e.target.value);
                setAddressConfirmed(false);
              }}
              placeholder="Start typing your venue address..."
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {addressLookingUp && (
              <p className="text-xs text-muted-foreground mt-1">Looking up address...</p>
            )}
            {addressConfirmed && (
              <div className="flex items-center gap-2 mt-2 text-emerald-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Location confirmed — will show correctly on map!</span>
              </div>
            )}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg overflow-hidden">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => selectAddress(s)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 border-b last:border-0 transition"
                  >
                    <span className="font-medium">{s.display_name.split(",")[0]}</span>
                    <span className="text-muted-foreground text-xs block">
                      {s.display_name.split(",").slice(1, 4).join(",")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleSubmit} disabled={loading} className="w-full py-6 text-lg">
          {loading ? "Posting..." : "🎸 Post My Jam!"}
        </Button>
      </Card>
    </div>
  );
}
