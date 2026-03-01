import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default async function HomePage() {
  // Fetch all published posts including author details from the profiles table
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="mb-20 mt-10 text-center md:text-left">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
          STAY <br /> CURIOUS.
        </h1>
        <p className="text-xl text-gray-500 max-w-lg">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </section>

      {/* Blog Feed Grid */}
      <section>
        <div className="flex items-center gap-2 mb-10 text-sm font-bold uppercase tracking-widest text-gray-400">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          Latest Stories
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed rounded-[40px] bg-gray-50">
            <p className="text-gray-400 italic mb-4">The feed is empty... for now.</p>
            <SignedIn>
    <Link href="/studio" className="text-blue-600 font-bold underline">
      Be the first to write a story
    </Link>
  </SignedIn>

  {/* If Signed Out: Trigger the Login Modal */}
  <SignedOut>
    <SignInButton mode="modal">
      <button className="text-blue-600 font-bold underline">
        Be the first to write a story
      </button>
    </SignInButton>
  </SignedOut>
          </div>
        )}
      </section>
    </main>
  );
}