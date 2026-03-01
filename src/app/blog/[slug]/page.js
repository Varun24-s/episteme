import { supabase } from "@/lib/supabase";
import InteractionBar from "@/components/InteractionBar";
import CommentSection from "@/components/CommentSection";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }) {
  const { slug } = params;

  // Fetch the post and the author's profile details in one go
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        username,
        avatar_url,
        bio
      )
    `)
    .eq("slug", slug)
    .single();

  // If the post doesn't exist, show the Next.js 404 page
  if (error || !post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-20">
      {/* Header Section */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-center gap-3">
          <img 
            src={post.profiles?.avatar_url} 
            alt={post.profiles?.username}
            className="w-10 h-10 rounded-full border border-gray-100"
          />
          <div className="text-left">
            <p className="font-bold text-sm">{post.profiles?.username}</p>
            <p className="text-xs text-gray-500">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="mb-12">
          <img 
            src={post.cover_image} 
            alt={post.title} 
            className="w-full rounded-3xl object-cover shadow-2xl shadow-blue-100"
          />
        </div>
      )}

      {/* Blog Content */}
      <article className="prose prose-lg max-w-none prose-slate leading-relaxed">
        {/* We use whitespace-pre-wrap to preserve line breaks from the textarea */}
        <div className="whitespace-pre-wrap text-gray-800 text-xl font-serif">
          {post.content}
        </div>
      </article>

      {/* Interactive Section (Likes/Comments) */}
      <section className="mt-16 border-t pt-8">
        <InteractionBar postId={post.id} />
        <CommentSection postId={post.id} />
      </section>

      {/* Author Footer Card */}
      <footer className="mt-20 p-8 bg-gray-50 rounded-3xl flex flex-col items-center text-center">
        <img 
          src={post.profiles?.avatar_url} 
          className="w-20 h-20 rounded-full mb-4 grayscale"
          alt="author"
        />
        <h3 className="font-black text-xl mb-2">Written by {post.profiles?.username}</h3>
        <p className="text-gray-500 text-sm max-w-sm">
          {post.profiles?.bio || "A passionate storyteller on Minimal."}
        </p>
      </footer>
    </main>
  );
}