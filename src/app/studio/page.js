"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { Loader2, Send, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function StudioPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const titleRef = useRef(null);

    // Auto-resize title height as you type
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handlePublish = async () => {
        if (!title || !content) return;
        setLoading(true);
        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, cover_image: coverImage }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to publish");
            router.push(`/blog/${data.slug}`);
            router.refresh();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white pb-32">
            {/* Top Back Button (Minimalist) */}
            <div className="max-w-4xl mx-auto px-6 pt-8">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest">
                    <ChevronLeft size={16} /> Back to Feed
                </Link>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
                {/* 16:9 Cover Image Section */}
                <div className="relative group">
                    {coverImage ? (
                        <div className="relative aspect-video rounded-[32px] overflow-hidden group border border-gray-100">
                            <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <button 
                                    onClick={() => setCoverImage("")}
                                    className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold shadow-2xl hover:scale-105 transition-transform"
                                >
                                    Remove Cover Image
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-video">
                            <ImageUpload onUpload={(url) => setCoverImage(url)} />
                        </div>
                    )}
                </div>

                {/* Content Editor */}
                <div className="space-y-6">
                    <textarea
                        ref={titleRef}
                        rows={1}
                        placeholder="Title of your story"
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full text-5xl md:text-7xl font-black outline-none placeholder:text-gray-100 tracking-tighter resize-none leading-[0.9] overflow-hidden"
                    />

                    <textarea
                        placeholder="Write your narrative here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full min-h-[60vh] text-xl md:text-2xl font-serif outline-none resize-none placeholder:text-gray-100 leading-relaxed text-gray-800"
                    />
                </div>
            </div>

            {/* --- BOTTOM LEFT ACTION BAR --- */}
            <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4">
                <button
                    onClick={handlePublish}
                    disabled={loading || !title || !content}
                    className="group flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-blue-600 active:scale-95 transition-all disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            <span>Publish Story</span>
                        </>
                    )}
                </button>

                {/* Subtle Status Indicator */}
                
            </div>
        </main>
    );
}