"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Music, MapPin, Search, MessageCircle, X, Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface MusicianProfile {
  id: string;
  user_id: string;
  instruments: string[];
  bio: string;
  city: string;
}

export default function MusiciansPage() {
  const { user, isSignedIn } = useUser();
  const [musicians, setMusicians] = useState<MusicianProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterInstrument, setFilterInstrument] = useState("");
  const [messageTarget, setMessageTarget] = useState<MusicianProfile | null>(null);
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

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
    if (user && m.user_id === user.id) return false; // hide yourself
    const matchesSearch =
      !search ||
      m.city?.toLowerCase().includes(search.toLowerCase()) ||
      m.bio?.toLowerCase().includes(search.toLowerCase()) ||
      m.instruments?.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    const matchesInstrument =
      !filterInstrument || m.instruments?.includes(filterInstrument);
    return matchesSearch && matchesInstrument;
  });

  const sendMessage = async () => {
    if (!messageTarget || !messageBody.trim() || !user) return;
    setSending(true);

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      sender_name: user.fullName || user.emailAddresses[0]?.emailAddress,
      sender_email: user.emailAddresses[0]?.emailAddress,
      recipient_id: messageTarget.user_id,
      subject: `Message from ${user.fullName || "a musician"} on JamFinder`,
      body: messageBody,
    });

    if (!error) {
      // Send email notification
      try {
        await fetch("/api/message-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderName: user.fullName || user.emailAddresses[0]?.emailAddress,
            recipientId: messageTarget.user_id,
            body: messageBody,
          }),
        });
      } catch (err) {
        console.error("Email notification failed:", err);
      }

      setSentTo(messageTarget.user_id);
      setMessageBody("");
      setMessageTarget(null);
    }

    setSending(false);
  };

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

              {musician.instruments?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {musician.instruments.map((inst) => (
                    <span key={inst} className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                      🎸 {inst}
                    </span>
                  ))}
                </div>
              )}

              {musician.bio && (
                <p className="text-sm text-muted-foreground italic line-clamp-3 mb-4">
                  "{musician.bio}"
                </p>
              )}

              {isSignedIn ? (
                sentTo === musician.user_id ? (
                  <p className="text-sm text-emerald-600 font-medium">✅ Message sent!</p>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setMessageTarget(musician)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                )
              ) : (
                <p className="text-xs text-muted-foreground text-center">Sign in to message musicians</p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Message Modal */}
      {messageTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Send Message</h3>
              <button onClick={() => { setMessageTarget(null); setMessageBody(""); }}
                className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              To: <strong className="text-foreground">{messageTarget.city || "Musician"}</strong>
              {messageTarget.instruments?.length > 0 && ` — ${messageTarget.instruments.join(", ")}`}
            </p>
            <textarea
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="Hi! I saw your profile and would love to jam sometime..."
              rows={5}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setMessageTarget(null); setMessageBody(""); }}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={sendMessage}
                disabled={sending || !messageBody.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
