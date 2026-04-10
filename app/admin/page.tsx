"use client";

import { useState, useEffect } from "react";
import { fetchEvents, Event } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Lock, Pencil, X, Check } from "lucide-react";

const ADMIN_PASSWORD = "wrigley"; // Change this to your own password!

const venueTypes = [
  { value: "bar", label: "Bar / Pub" },
  { value: "community", label: "Community Hall" },
  { value: "private-home", label: "Private Home" },
  { value: "studio", label: "Studio / Venue" },
  { value: "open-mic", label: "Open Mic" },
  { value: "karaoke", label: "Karaoke" },
  { value: "other", label: "Other" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Event>>({});
  const [saving, setSaving] = useState(false);

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
      return;
    }
    loadEvents();
  };

  const startEdit = (event: Event) => {
    setEditingId(event.id);
    setEditForm({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      venueType: event.venueType,
      type: event.type,
    });
    setConfirmId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const { error } = await supabase
      .from("events")
      .update({
        title: editForm.title,
        date: editForm.date,
        location: editForm.location,
        description: editForm.description,
        venue_type: editForm.venueType,
        type: editForm.type,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("Failed to save. Please try again.");
      console.error(error);
      return;
    }

    setEditingId(null);
    setEditForm({});
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
            <Card key={event.id} className="p-6">
              {editingId === event.id ? (
                /* Edit Form */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-muted-foreground">Title</label>
                      <input
                        value={editForm.title || ""}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-muted-foreground">Date</label>
                      <input
                        type="date"
                        value={editForm.date || ""}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-muted-foreground">Location</label>
                      <input
                        value={editForm.location || ""}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-muted-foreground">Venue Type</label>
                      <select
                        value={editForm.venueType || "other"}
                        onChange={(e) => setEditForm({ ...editForm, venueType: e.target.value as Event["venueType"] })}
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {venueTypes.map((v) => (
                          <option key={v.value} value={v.value}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">Description</label>
                    <textarea
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">Event Type</label>
                    <div className="flex gap-3">
                      {["public", "private"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setEditForm({ ...editForm, type: t as Event["type"] })}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                            editForm.type === t
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "hover:border-emerald-400"
                          }`}
                        >
                          {t === "public" ? "🌍 Public" : "🔒 Private"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEdit}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => saveEdit(event.id)}
                      disabled={saving}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Event Row */
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.date} • {event.location} • {event.venueType} • {event.type}
                    </p>
                    <p className="text-sm mt-2 line-clamp-2">{event.description}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(event)}
                      className="text-blue-500 border-blue-200 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>

                    {confirmId === event.id ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setConfirmId(null)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleDelete(event.id)}
                          disabled={deletingId === event.id}
                        >
                          {deletingId === event.id ? "..." : "Yes, Delete"}
                        </Button>
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
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
