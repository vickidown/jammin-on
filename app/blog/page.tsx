import { Card } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Top 5 Open Mics in Southwestern Ontario Right Now",
    date: "April 5, 2026",
    author: "Sarah Chen",
    excerpt: "Discover the best open mic nights in London, St. Thomas, and surrounding areas. Perfect for beginners and seasoned performers alike.",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "How to Start Your Own Private Jam Session",
    date: "March 28, 2026",
    author: "Mike Thompson",
    excerpt: "Tips, best practices, and lessons learned from hosting successful private jams in home studios and community spaces.",
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "The Return of Live Music: Post-Pandemic Scene in Ontario",
    date: "March 15, 2026",
    author: "Elena Rodriguez",
    excerpt: "How musicians and venues are rebuilding the live music community across Southwestern Ontario.",
    readTime: "10 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">JamFinder Blog</h1>
        <p className="text-xl text-muted-foreground">
          Stories, tips, and insights from the Ontario music scene
        </p>
      </div>

      <div className="space-y-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div>{post.readTime}</div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 leading-tight">
              {post.title}
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {post.excerpt}
            </p>

            <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2">
              Read full article →
            </button>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center text-sm text-muted-foreground">
        More articles coming soon. Want to contribute? Contact us!
      </div>
    </div>
  );
}