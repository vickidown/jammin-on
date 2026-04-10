"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Map, Calendar, BookOpen, Bot, LayoutDashboard, User, PlusCircle, Users, Menu, X, Inbox } from "lucide-react";
import { SignInButton, SignUpButton, SignOutButton, UserButton, useAuth } from "@clerk/nextjs";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/map", label: "Map", icon: Map },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/musicians", label: "Musicians", icon: Users },
  { href: "/ai", label: "AI Assistant", icon: Bot },
];

const authLinks = [
  { href: "/post-jam", label: "Post a Jam", icon: PlusCircle },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/profile", label: "Profile", icon: User },
];

export function Navbar() {
  const { isSignedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl">
          <Music className="h-7 w-7 text-emerald-600" /> JamFinder
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex gap-5 text-sm font-medium">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-1 hover:text-emerald-600 transition">
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
          {isSignedIn && authLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-1 hover:text-emerald-600 transition">
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-3">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <UserButton />
              <SignOutButton>
                <Button variant="outline" size="sm">Sign Out</Button>
              </SignOutButton>
            </div>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex lg:hidden items-center gap-3">
          {isSignedIn && <UserButton />}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted hover:text-emerald-600 transition text-sm font-medium"
              >
                <Icon className="h-4 w-4 text-emerald-600" /> {label}
              </Link>
            ))}

            {isSignedIn && authLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted hover:text-emerald-600 transition text-sm font-medium"
              >
                <Icon className="h-4 w-4 text-emerald-600" /> {label}
              </Link>
            ))}

            <div className="border-t mt-2 pt-4 flex flex-col gap-2">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full" onClick={() => setMenuOpen(false)}>
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full" onClick={() => setMenuOpen(false)}>
                      Sign Up
                    </Button>
                  </SignUpButton>
                </>
              ) : (
                <SignOutButton>
                  <Button variant="outline" className="w-full">Sign Out</Button>
                </SignOutButton>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
