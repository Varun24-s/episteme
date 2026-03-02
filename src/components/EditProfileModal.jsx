"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { X, Instagram, Loader2 } from "lucide-react";

export default function EditProfileModal({ profile, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    bio: profile.bio || "",
    instagram: profile.instagram || "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Clean the handle: remove '@' if the user included it
    const cleanHandle = formData.instagram.replace("@", "").trim();

    const { error } = await supabase
      .from("profiles")
      .update({ ...formData, instagram: cleanHandle })
      .eq("id", profile.id);

    if (!error) {
      setIsOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">{children}</div>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                <X size={20}/>
            </button>
            
            <h2 className="text-2xl font-black tracking-tighter mb-8 ">Edit Profile</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bio</label>
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-1 focus:ring-black min-h-[20vh] text-sm"
                  placeholder="Your story..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instagram Handle</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input 
                        type="text" 
                        value={formData.instagram} 
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})} 
                        placeholder="username" 
                        className="w-full pl-8 pr-4 py-4 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-black border-none" 
                    />
                </div>
              </div>

              <button disabled={loading} className="w-full bg-white text-black py-4 rounded-full border-2 border-black font-bold hover:bg-black hover:text-white transition-all flex items-center duration-300 justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={20}/> : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}