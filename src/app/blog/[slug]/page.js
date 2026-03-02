import { supabase } from "@/lib/supabase";
import InteractionBar from "@/components/InteractionBar";
import CommentSection from "@/components/CommentSection";
import Share from "@/components/Share"; // Import our new component
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

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

  if (error || !post) {
    notFound();
  }

  // Construct the absolute URL for sharing
  // Replace 'https://yourapp.com' with your actual production domain later
  const postUrl = `${'https://epistemeblogg.netlify.app'}/blog/${post.slug}`;

  return (
    <main className="max-w-3xl mx-auto px-4 py-20">
      {/* Header Section */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
          {post.title}
        </h1>
      </header>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="mb-12">
          <img 
            src={post.cover_image} 
            alt={post.title} 
            className="w-full rounded-[40px] object-cover shadow-2xl shadow-gray-100"
          />
        </div>
      )}

      {/* Blog Content */}
      <article className="prose prose-lg max-w-none prose-slate leading-relaxed">
        <div className="whitespace-pre-wrap text-gray-800 text-xl font-serif">
          {post.content}
        </div>
      </article>

      {/* --- PRODUCTION GRADE INTERACTION LAYER --- */}
      <section className="">
        {/* 1. Engagement (Likes/Claps) */}
        <div className="border-t border-gray-100 pt-8">
            <InteractionBar postId={post.id} />
        </div>

        {/* 2. Professional Share Experience (Placed here for high conversion) */}
        <Share
         title={post.title} url={postUrl} />

        {/* 3. Community (Comments) */}
        <div className="mt-12">
            <CommentSection postId={post.id} />
        </div>
      </section>

      {/* Author Footer Card */}
      <footer className="mt-20 p-10 bg-gray-50 rounded-[40px] flex flex-col items-center text-center">
        <img 
          src={post.profiles?.avatar_url} 
          className="w-24 h-24 rounded-full mb-6 grayscale border-4 border-white shadow-sm"
          alt="author"
        />
        <h3 className="font-black text-2xl mb-2 tracking-tight">Written by {post.profiles?.username}</h3>
        <p className="text-gray-500 text-base max-w-sm leading-relaxed italic font-serif">
          "{post.profiles?.bio || "A silent observer of the digital age."}"
        </p>
      </footer>
    </main>
  );
}