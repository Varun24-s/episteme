import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import EditProfileModal from "@/components/EditProfileModal";
import ProfileAvatar from "@/components/ProfileAvatar";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Calendar, BookOpen, PenLine, Instagram } from "lucide-react";

export const revalidate = 0;

export default async function ProfilePage({ params }) {
    const { id } = await params;
    const { userId: currentUserId } = await auth();

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (profileError || !profile) notFound();

    const { data: posts } = await supabase
        .from("posts")
        .select("*, profiles(username, avatar_url)")
        .eq("author_id", id)
        .order("created_at", { ascending: false });

    const isOwnProfile = currentUserId === id;

    return (
        <main className="max-w-6xl mx-auto px-6 py-12 md:py-24">
            <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 md:gap-16 items-start border-b border-gray-50 pb-10 mb-10">

                <div className="flex flex-col items-center md:items-start">
                    <ProfileAvatar profile={profile} isOwnProfile={isOwnProfile} />
                </div>

                <div className="flex flex-col text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                            {profile.username}
                        </h1>
                    </div>

                    {/* BIO SECTION WITH INLINE PEN */}
                    <div className="relative group max-w-2xl mb-8">
                        <p className="text-xl md:text-2xl font-serif text-gray-600 leading-relaxed inline">
                            {profile.bio || "A quiet observer of the digital age, yet to pen a manifesto."}
                        </p>

                        {isOwnProfile && (
                            <div className="inline-block ml-3 align-middle">
                                <EditProfileModal profile={profile}>
                                    <button className="p-2  rounded-full text-gray-700 hover:text-black cursor-pointer transition-all duration-300">
                                        <PenLine size={18} strokeWidth={1.2} />
                                    </button>
                                </EditProfileModal>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                        {/* METADATA */}
                        <div className="flex items-center justify-center md:justify-start gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            <div className="flex items-center gap-2">
                                <BookOpen size={14} strokeWidth={2.5} />
                                <span>{posts?.length || 0} Stories</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} strokeWidth={2.5} />
                                <span>Joined {new Date(profile.updated_at).getFullYear()}</span>
                            </div>
                        </div>

                        {/* INSTAGRAM LINK - Only shows if handle exists */}
                        {/* INSTAGRAM SECTION */}
                        <div className="flex items-center justify-center md:justify-start">
                            {profile.instagram ? (
                                // 1. Display State: Show the handle as a link
                                <a
                                    href={`https://instagram.com/${profile.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all group"
                                >
                                    <Instagram size={14} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                    <span>@{profile.instagram}</span>
                                </a>
                            ) : (
                                // 2. Empty State: Only show "Add" button to the Owner
                                isOwnProfile && (
                                    <EditProfileModal profile={profile}>
                                        <button className="flex items-center gap-2 text-[11px] font-black uppercase cursor-pointer tracking-widest text-gray-400 hover:border-black hover:text-black transition-all">
                                            <Instagram size={12} strokeWidth={3} />
                                            Add Instagram
                                        </button>
                                    </EditProfileModal>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-baseline justify-between mb-12 border-b border-black pb-4">
                    <h2 className="text-3xl font-black tracking-tighter uppercase">Your Stories</h2>
                </div>

                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {posts.map((post, index) => (
                            <PostCard key={post.id} post={post} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-gray-50/50 rounded-[40px] border border-gray-100 italic font-serif text-gray-300 text-xl">
                        Library is empty.
                    </div>
                )}
            </section>
        </main>
    );
}