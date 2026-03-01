"use client";
import { useClerk } from "@clerk/nextjs";
import { User } from "lucide-react";

export default function ProfileAvatar({ profile, isOwnProfile }) {
  const { openUserProfile } = useClerk();

  return (
    <div className="relative mb-6">
      <div 
        onClick={() => isOwnProfile && openUserProfile()}
        className={`w-32 h-32 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-gray-50 
          ${isOwnProfile ? "cursor-pointer hover:scale-105 transition-transform group" : ""}`}
      >
        {profile.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt={profile.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={48} className="text-gray-300" />
        )}

        {isOwnProfile && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
             <span className="text-[10px] font-bold text-white uppercase bg-black/50 px-2 py-1 rounded">Edit</span>
          </div>
        )}
      </div>

      {isOwnProfile && (
        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        </div>
      )}
    </div>
  );
}