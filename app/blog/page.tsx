import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-emerald-600" />
          <h1 className="text-4xl font-bold">JamFinder Blog</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Tips, stories and news for musicians in Ontario
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet — check back soon!</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="h-3 w-3" />
                {new Date(post.published_at).toLocaleDateString("en-CA", {
                  month: "long", day: "numeric", year: "numeric"
                })}
                <span>·</span>
                <span>{post.author}</span>
              </div>
              <h2 className="text-2xl font-semibold mb-3 hover:text-emerald-600 transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-emerald-600 text-sm font-medium hover:underline"
              >
                Read more →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
