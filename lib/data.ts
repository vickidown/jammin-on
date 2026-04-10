export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  lat: number;
  lng: number;
  type: "public" | "private";
  venueType: "bar" | "community" | "private-home" | "studio" | "other"; // ← Updated
  instruments: string[];
  description: string;
};

export const publicEvents: Event[] = [
  {
    id: "1",
    title: "Open Mic Night @ London Music Club",
    date: "2026-04-12",
    location: "London, ON",
    lat: 42.9849,
    lng: -81.2451,
    type: "public",
    venueType: "bar",
    instruments: ["guitar", "vocals"],
    description: "Weekly open mic — all levels welcome!",
  },
  {
    id: "2",
    title: "Blues Jam at the Forge",
    date: "2026-04-15",
    location: "St. Thomas, ON",
    lat: 42.777,
    lng: -81.183,
    type: "public",
    venueType: "bar",
    instruments: ["guitar", "harmonica"],
    description: "Casual blues session by the lake.",
  },
  {
    id: "3",
    title: "Community Jam at St. Thomas Hall",
    date: "2026-04-20",
    location: "St. Thomas, ON",
    lat: 42.777,
    lng: -81.183,
    type: "public",
    venueType: "community",
    instruments: ["guitar", "drums", "vocals"],
    description: "All-ages community music jam.",
  },
  {
    id: "4",
    title: "Private House Jam - Acoustic Night",
    date: "2026-04-22",
    location: "St. Thomas, ON",
    lat: 42.78,
    lng: -81.19,
    type: "private",
    venueType: "private-home",
    instruments: ["guitar", "vocals"],
    description: "Small private jam at my place. Message for address.",
  },
];