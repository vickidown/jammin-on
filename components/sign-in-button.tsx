"use client";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SignInCTA() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return null;

  return (
    <SignInButton mode="modal">
      <Button size="lg" className="text-lg px-10 py-7 bg-white text-emerald-900 hover:bg-emerald-50">
        Sign In / Sign Up
      </Button>
    </SignInButton>
  );
}