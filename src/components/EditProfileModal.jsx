"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine } from "lucide-react";

export default function EditProfileModal({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bio, setBio] = useState(profile.bio || "");
  const router = useRouter();

  const save = async () => {
    await fetch('/api/profile/update', {
      method: 'POST',
      body: JSON.stringify({ bio, username: profile.username })
    });
    setIsOpen(false);
    router.refresh();
  };

  if (!isOpen) return <button onClick={() => setIsOpen(true)} className="text-sm font-bold underline"><PenLine className="cursor-pointer"/></button>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <textarea 
          className="w-full border rounded-xl p-3 h-32 outline-none" 
          value={bio} 
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="flex gap-2 mt-4">
          <button onClick={save} className="flex-1 bg-black cursor-pointer text-white py-2 rounded-xl">Save</button>
          <button onClick={() => setIsOpen(false)} className="flex-1 cursor-pointer bg-gray-100 py-2 rounded-xl">Cancel</button>
        </div>
      </div>
    </div>
  );
}