"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Mail, MailOpen, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  body: string;
  read: boolean;
  created_at: string;
}

export default function InboxPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("messages")
      .select("*")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setMessages(data);
        setLoading(false);
      });
  }, [user]);

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      await supabase.from("messages").update({ read: true }).eq("id", msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (!isLoaded || !user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="h-8 w-8 text-emerald-600" />
        <div>
          <h1 className="text-4xl font-bold">Inbox</h1>
          {unreadCount > 0 && (
            <p className="text-emerald-600 text-sm font-medium">{unreadCount} unread message{unreadCount !== 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading messages...</p>
      ) : messages.length === 0 ? (
        <div className="text-center py-20">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No messages yet.</p>
          <p className="text-sm text-muted-foreground mt-2">When musicians message you, they'll appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message list */}
          <div className="space-y-3">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`p-5 cursor-pointer transition-shadow hover:shadow-md ${
                  selected?.id === msg.id ? "border-emerald-500 border-2" : ""
                } ${!msg.read ? "bg-emerald-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {msg.read
                      ? <MailOpen className="h-4 w-4 text-muted-foreground" />
                      : <Mail className="h-4 w-4 text-emerald-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${!msg.read ? "text-emerald-700" : ""}`}>
                      {msg.sender_name || msg.sender_email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.created_at).toLocaleDateString("en-CA", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Message detail */}
          {selected ? (
            <Card className="p-6 sticky top-6 h-fit">
              <p className="text-xs text-muted-foreground mb-1">From</p>
              <p className="font-semibold mb-1">{selected.sender_name}</p>
              <p className="text-xs text-muted-foreground mb-4">{selected.sender_email}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {new Date(selected.created_at).toLocaleDateString("en-CA", {
                  month: "long", day: "numeric", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </p>
              <div className="border-t pt-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.body}</p>
              </div>
              <div className="mt-6">
                <a
                  href={`mailto:${selected.sender_email}`}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-emerald-700 transition inline-block"
                >
                  Reply via Email
                </a>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              Click a message to read it
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
