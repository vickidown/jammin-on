import { Card } from "@/components/ui/card";
import { User, Music, Calendar, MapPin, Award } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your musician profile and activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="p-8 text-center">
            <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <User className="h-12 w-12 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-1">Alex Rivera</h2>
            <p className="text-muted-foreground mb-6">Guitarist & Vocalist • St. Thomas, ON</p>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instruments:</span>
                <span className="font-medium">Guitar, Vocals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since:</span>
                <span className="font-medium">March 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RSVP'd to:</span>
                <span className="font-medium">7 events</span>
              </div>
            </div>

            <button className="mt-8 w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition">
              Edit Profile
            </button>
          </Card>
        </div>

        {/* Activity & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming RSVPs */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold">My Upcoming Jams</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-right w-20 text-sm text-muted-foreground">Apr 12</div>
                <div>
                  <p className="font-medium">Open Mic Night @ London Music Club</p>
                  <p className="text-sm text-muted-foreground">7:00 PM • London, ON</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-right w-20 text-sm text-muted-foreground">Apr 15</div>
                <div>
                  <p className="font-medium">Blues Jam at the Forge</p>
                  <p className="text-sm text-muted-foreground">8:00 PM • St. Thomas, ON</p>
                </div>
              </div>
            </div>
          </Card>

          {/* My Contributions */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold">My Activity</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-muted/50 p-6 rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">4</p>
                <p className="text-sm text-muted-foreground">Events Hosted</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-xl">
                <p className="text-3xl font-bold text-emerald-600">12</p>
                <p className="text-sm text-muted-foreground">Events Attended</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        Full profile features (real auth, photo upload, private events) coming soon with Clerk integration.
      </div>
    </div>
  );
}