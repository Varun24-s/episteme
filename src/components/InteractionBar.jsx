"use client";
import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function InteractionBar({ postId }) {
  const { isSignedIn } = useAuth();
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    if (!isSignedIn) return alert("Please sign in to like!");
    setLiked(!liked);
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
  };

  return (
    <div className="flex gap-6 py-4 ">
      <button onClick={handleLike} className={`flex items-center gap-2 ${liked ? 'text-red-500' : ''}`}>
        <Heart fill={liked ? "currentColor" : "none"} size={20} /> Like
      </button>
    </div>
  );
}