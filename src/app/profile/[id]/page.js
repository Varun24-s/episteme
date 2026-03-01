import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import EditProfileModal from "@/components/EditProfileModal";
import ProfileAvatar from "@/components/ProfileAvatar"; // Import your new component
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

// Force fresh data on every visit
export const revalidate = 0;

export default async function ProfilePage({ params }) {
    // 1. Await the dynamic parameters from the URL
    const { id } = await params;
    
    // 2. Get the currently logged-in user from the server
    const { userId: currentUserId } = await auth();

    // 3. Fetch Profile Details from Supabase
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (profileError || !profile) {
        console.error("Profile not found for ID:", id);
        notFound();
    }

    // 4. Fetch all posts written by this user
    const { data: posts } = await supabase
        .from("posts")
        .select("*, profiles(username, avatar_url)")
        .eq("author_id", id)
        .order("created_at", { ascending: false });

    const isOwnProfile = currentUserId === id;

    return (
        <main className="max-w-5xl mx-auto px-4 py-16">
            <section className="flex flex-col items-center text-center border-b border-gray-100 pb-16 mb-16">
                
                {/* 5. Use the Client Component for the interactive Avatar */}
                <ProfileAvatar profile={profile} isOwnProfile={isOwnProfile} />

                <h1 className="text-4xl font-black tracking-tight mb-3">
                    {profile.username}
                </h1>

                <p className="text-gray-500 max-w-lg text-lg leading-relaxed mb-6">
                    {profile.bio || "This storyteller hasn't added a bio yet."}
                </p>

                <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-widest text-gray-400">
                    <span>{posts?.length || 0} Stories</span>
                    <span>•</span>
                    <span>Joined {new Date(profile.updated_at).getFullYear()}</span>
                </div>

                {isOwnProfile && (
                    <div className="mt-8">
                        <EditProfileModal profile={profile} />
                    </div>
                )}
            </section>

            <section>
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black italic">Latest Stories</h2>
                </div>

                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium italic">
                            {isOwnProfile
                                ? "You haven't published any stories yet."
                                : "This user hasn't published anything yet."}
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}