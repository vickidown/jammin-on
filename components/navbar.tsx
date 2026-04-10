"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Music, Map, Calendar, BookOpen, Bot, LayoutDashboard, User } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          <Music className="h-8 w-8 text-emerald-600" /> JamFinder
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-emerald-600">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/events" className="flex items-center gap-1 hover:text-emerald-600">
            <Calendar className="h-4 w-4" /> Events
          </Link>
          <Link href="/map" className="flex items-center gap-1 hover:text-emerald-600">
            <Map className="h-4 w-4" /> Map
          </Link>
          <Link href="/blog" className="flex items-center gap-1 hover:text-emerald-600">
            <BookOpen className="h-4 w-4" /> Blog
          </Link>
          <Link href="/ai" className="flex items-center gap-1 hover:text-emerald-600">
            <Bot className="h-4 w-4" /> AI Assistant
          </Link>
          <Link href="/profile" className="flex items-center gap-1 hover:text-emerald-600">
            <User className="h-4 w-4" /> Profile
          </Link>
          <Link href="/post-jam" className="flex items-center gap-1 hover:text-emerald-600">
            <PlusCircle className="h-4 w-4" /> Post a Jam
          </Link>
        </div>

        {/* Placeholder for now - we'll add real Clerk login later */}
        <div className="flex items-center gap-4">
          <Button variant="outline">Sign In (Demo)</Button>
        </div>
      </div>
    </nav>
  );
}