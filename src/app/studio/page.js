"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { Loader2, Send } from "lucide-react";

export default function StudioPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    if (!title || !content) {
      alert("Please provide both a title and some content for your story.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          cover_image: coverImage,
        }),
      });

      if (!response.ok) throw new Error("Failed to publish post");

      const post = await response.json();
      
      // Redirect to the newly created blog post
      router.push(`/blog/${post.slug}`);
      router.refresh(); 
    } catch (error) {
      console.error(error);
      alert("Something went wrong while publishing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-8">
        
        {/* Step 1: Cover Image Upload */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Step 1: Cover Image
          </p>
          <ImageUpload onUpload={setCoverImage} />
          {coverImage && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              ✓ Image uploaded successfully
            </p>
          )}
        </section>

        {/* Step 2: Content Editor */}
        <section className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-5xl md:text-6xl font-black outline-none placeholder:text-gray-200 tracking-tighter"
          />
          
          <textarea
            placeholder="Tell your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[400px] text-xl md:text-2xl font-serif outline-none resize-none placeholder:text-gray-200 leading-relaxed"
          />
        </section>

        {/* Floating Action Button */}
        <div className="fixed bottom-10 right-10 flex flex-col items-end gap-4">
           {loading && (
             <span className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium animate-pulse border">
               Saving to Supabase...
             </span>
           )}
           <button
            onClick={handlePublish}
            disabled={loading}
            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:bg-gray-400 disabled:scale-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Publish Story <Send size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}