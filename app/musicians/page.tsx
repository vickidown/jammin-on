"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Music, MapPin, Search } from "lucide-react";

interface MusicianProfile {
  id: string;
  user_id: string;
  instruments: string[];
  bio: string;
  city: string;
}

export default function MusiciansPage() {
  const [musicians, setMusicians] = useState<MusicianProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterInstrument, setFilterInstrument] = useState("");

  useEffect(() => {
    supabase
      .from("user_profiles")
      .select("*")
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setMusicians(data);
        setLoading(false);
      });
  }, []);

  const allInstruments = Array.from(
    new Set(musicians.flatMap((m) => m.instruments || []))
  ).sort();

  const filtered = musicians.filter((m) => {
    const matchesSearch =
      !search ||
      m.city?.toLowerCase().includes(search.toLowerCase()) ||
      m.bio?.toLowerCase().includes(search.toLowerCase()) ||
      m.instruments?.some((i) => i.toLowerCase().includes(search.toLowerCase()));

    const matchesInstrument =
      !filterInstrument || m.instruments?.includes(filterInstrument);

    return matchesSearch && matchesInstrument;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Musicians Directory</h1>
        <p className="text-muted-foreground text-lg">
          Find musicians to jam with across Southwestern Ontario
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city, instrument, or bio..."
            className="w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={filterInstrument}
          onChange={(e) => setFilterInstrument(e.target.value)}
          className="border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Instruments</option>
          {allInstruments.map((inst) => (
            <option key={inst} value={inst}>{inst}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {filtered.length} musician{filtered.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading musicians...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No musicians found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((musician) => (
            <Card key={musician.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Avatar placeholder */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <Music className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  {musician.city && (
                    <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                      <MapPin className="h-3 w-3" />
                      {musician.city}
                    </div>
                  )}
                  {musician.instruments?.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {musician.instruments.join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              {/* Instruments */}
              {musician.instruments?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {musician.instruments.map((inst) => (
                    <span
                      key={inst}
                      className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium"
                    >
                      🎸 {inst}
                    </span>
                  ))}
                </div>
              )}

              {/* Bio */}
              {musician.bio && (
                <p className="text-sm text-muted-foreground italic line-clamp-3">
                  "{musician.bio}"
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
