"use client";

import { useState, useEffect } from "react";
import { fetchEvents, Event } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Lock } from "lucide-react";

const ADMIN_PASSWORD = "wrigley";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const loadEvents = () => {
    setLoading(true);
    fetchEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (authed) loadEvents();
  }, [authed]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setWrongPassword(false);
    } else {
      setWrongPassword(true);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("events").delete().eq("id", id);
    setDeletingId(null);
    setConfirmId(null);
    if (error) {
      alert("Failed to delete. Please try again.");
      console.error(error);
      return;
    }
    loadEvents();
  };

  // Password gate
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-10 w-full max-w-sm text-center">
          <Lock className="h-12 w-12 text-emerald-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
          <p className="text-muted-foreground text-sm mb-8">
            This page is for JamFinder admins only.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
          />
          {wrongPassword && (
            <p className="text-red-500 text-sm mb-4">Incorrect password.</p>
          )}
          <Button onClick={handleLogin} className="w-full">
            Enter
          </Button>
        </Card>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage all JamFinder events</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full">
          {events.length} events total
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading events...</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="p-6 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.date} • {event.location} • {event.venueType}
                </p>
                <p className="text-sm mt-2 line-clamp-2">{event.description}</p>
              </div>

              <div className="shrink-0">
                {confirmId === event.id ? (
                  <div className="flex flex-col gap-2 items-end">
                    <p className="text-sm text-red-500 font-medium">Are you sure?</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                      >
                        {deletingId === event.id ? "Deleting..." : "Yes, Delete"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => setConfirmId(event.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
