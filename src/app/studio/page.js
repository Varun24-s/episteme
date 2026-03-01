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
            alert("Please provide both a title and some content.");
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

            const data = await response.json();

            if (!response.ok) {
                // THIS LINE IS KEY: It will tell us if it's a "Duplicate Slug" 
                // or "Missing Column" or "RLS Violation"
                throw new Error(data.error || "Failed to publish post");
            }

            router.push(`/blog/${data.slug}`);
            router.refresh();
        } catch (error) {
            console.error("PUBLISH_ERROR:", error);
            alert(`Error: ${error.message}`); // Show the specific error to the user
    } finally {
        setLoading(false);
    }
};

return (
    <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">

            {/* Step 1: Cover Image Upload */}
            {/* Step 1: Cover Image Upload & Preview */}
            <section>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Step 1: Cover Image
                </p>

                {coverImage ? (
                    <div className="relative group w-full max-w-3xl mx-auto">
                        {/* The Actual Preview */}
                        <div className="relative aspect-video rounded-[32px] overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <img
                                src={coverImage}
                                alt="Cover preview"
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                            />
                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">Image Uploaded ✓</p>
                            </div>
                        </div>

                        {/* Remove Image Button */}
                        <button
                            onClick={() => setCoverImage("")}
                            className="absolute -top-3 -right-3 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                            title="Remove Image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                ) : (
                    /* Show Uploader if no image is present */
                    <div className="max-w-3xl mx-auto">
                        <ImageUpload onUpload={(url) => setCoverImage(url)} />
                    </div>
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
                        Saving...
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