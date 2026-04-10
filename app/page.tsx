import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music, MapPin, Calendar, Users, Bot, Megaphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-950 via-black to-black text-white">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-600/10 p-4 rounded-2xl">
              <Music className="h-16 w-16 text-emerald-500" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Find Your Next<br />
            <span className="text-emerald-500">Jam Session</span>
          </h1>

          <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            Discover open mics, blues jams, folk circles and private sessions across Southwestern Ontario.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-10 py-7">
              <Link href="/events">Browse Events</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-7 border-white/30 hover:bg-white/10">
              <Link href="/ai">Ask AI Assistant</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* New: Looking for Musicians / Jam Calls Section */}
      <div className="bg-amber-50 border-b border-amber-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Megaphone className="h-8 w-8 text-amber-600" />
            <h2 className="text-4xl font-semibold">Looking for Musicians</h2>
          </div>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            Hosts are actively looking for players. These "Jam Calls" are updated in real-time.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Jam Call 1 */}
            <div className="bg-white border border-amber-200 rounded-3xl p-8 hover:shadow-lg transition-all">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
                URGENT • This Weekend
              </div>
              <h3 className="text-2xl font-semibold mb-3">Need a Drummer</h3>
              <p className="text-muted-foreground mb-6">
                Blues band in St. Thomas looking for a solid drummer for our Saturday jam at The Forge. 
                Must know basic blues shuffle.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium">St. Thomas • Apr 12</span>
                <Button variant="outline" size="sm">I'm Interested</Button>
              </div>
            </div>

            {/* Jam Call 2 */}
            <div className="bg-white border border-amber-200 rounded-3xl p-8 hover:shadow-lg transition-all">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
                This Week
              </div>
              <h3 className="text-2xl font-semibold mb-3">Guitar Player Wanted</h3>
              <p className="text-muted-foreground mb-6">
                Acoustic duo in London needs a lead guitarist for open mic night. Folk / Indie style preferred.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium">London • Apr 11</span>
                <Button variant="outline" size="sm">I'm Interested</Button>
              </div>
            </div>

            {/* Jam Call 3 */}
            <div className="bg-white border border-amber-200 rounded-3xl p-8 hover:shadow-lg transition-all">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
                Ongoing
              </div>
              <h3 className="text-2xl font-semibold mb-3">Bass Player Needed</h3>
              <p className="text-muted-foreground mb-6">
                Rock band in Toronto looking for a bassist who can do both rock and funk grooves.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium">Toronto • Ongoing</span>
                <Button variant="outline" size="sm">I'm Interested</Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/events">Post Your Own Jam Call →</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4">Everything you need to jam</h2>
          <p className="text-xl text-muted-foreground">Built for musicians, by musicians</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-10 rounded-3xl border">
            <Calendar className="h-12 w-12 text-emerald-600 mb-6" />
            <h3 className="text-2xl font-semibold mb-3">Live Calendar</h3>
            <p className="text-muted-foreground leading-relaxed">
              Never miss a jam again. Beautiful FullCalendar with easy RSVP.
            </p>
          </div>

          <div className="bg-card p-10 rounded-3xl border">
            <MapPin className="h-12 w-12 text-emerald-600 mb-6" />
            <h3 className="text-2xl font-semibold mb-3">Interactive Map</h3>
            <p className="text-muted-foreground leading-relaxed">
              See exactly where the jams are happening across Ontario.
            </p>
          </div>

          <div className="bg-card p-10 rounded-3xl border">
            <Bot className="h-12 w-12 text-emerald-600 mb-6" />
            <h3 className="text-2xl font-semibold mb-3">AI Assistant</h3>
            <p className="text-muted-foreground leading-relaxed">
              Powered by Claude — get personalized jam recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-emerald-950 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-6">
            Ready to find your next jam?
          </h2>
          <p className="text-2xl text-emerald-100 mb-10">
            Join hundreds of musicians discovering great sessions every week.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-12 py-7">
              <Link href="/events">Browse All Events</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-12 py-7 border-white/30 text-white hover:bg-white/10">
              <Link href="/ai">Talk to AI Assistant</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}