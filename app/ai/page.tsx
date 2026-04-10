"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.response);
      } else {
        setResult("Sorry, something went wrong with the AI. Please try again.");
      }
    } catch (error) {
      setResult("Error connecting to AI. Make sure your ANTHROPIC_API_KEY is set.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">AI Jam Assistant</h1>
      <p className="text-muted-foreground mb-8">
        Ask Claude anything about Ontario music scenes, jam recommendations, or event ideas.
      </p>

      <Card className="p-6">
        <Textarea
          placeholder="Example: Recommend blues jams for guitar players near St. Thomas next weekend"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] mb-6"
        />

        <Button 
          onClick={handleAskAI} 
          disabled={loading || !prompt.trim()}
          className="w-full"
        >
          {loading ? "Claude is thinking..." : "Ask Claude"}
        </Button>
      </Card>

      {result && (
        <Card className="mt-8 p-6 whitespace-pre-wrap leading-relaxed">
          {result}
        </Card>
      )}

      <div className="mt-8 text-sm text-muted-foreground">
        💡 Tip: Be specific — mention your instrument, preferred genre, or location for better results.
      </div>
    </div>
  );
}