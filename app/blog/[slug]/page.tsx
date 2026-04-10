import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/blog"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Calendar className="h-3 w-3" />
        {new Date(post.published_at).toLocaleDateString("en-CA", {
          month: "long", day: "numeric", year: "numeric"
        })}
        <span>·</span>
        <span>{post.author}</span>
      </div>

      <h1 className="text-4xl font-bold mb-6 leading-tight">{post.title}</h1>

      <p className="text-xl text-muted-foreground mb-8 leading-relaxed border-l-4 border-emerald-500 pl-4">
        {post.excerpt}
      </p>

      <div className="prose prose-lg max-w-none">
        {post.content?.split("\n").map((para: string, i: number) => (
          para.trim() && <p key={i} className="mb-4 leading-relaxed text-gray-700">{para}</p>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t">
        <p className="text-muted-foreground text-sm mb-4">Ready to find your next jam?</p>
        <div className="flex gap-4">
          <Link href="/events" className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-emerald-700 transition">
            Browse Events
          </Link>
          <Link href="/ai" className="border px-5 py-2 rounded-lg text-sm hover:border-emerald-400 transition">
            Ask AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
