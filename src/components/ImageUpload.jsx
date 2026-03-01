"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function ImageUpload({ onUpload }) {
  const [loading, setLoading] = useState(false);

  const upload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const name = `${Date.now()}-${file.name}`;
    const { data } = await supabase.storage.from('blog-images').upload(name, file);
    
    if (data) {
      const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(name);
      onUpload(urlData.publicUrl);
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-64 border-2 border-dashed rounded-3xl flex items-center justify-center bg-gray-50">
      <input type="file" onChange={upload} className="hidden" id="cover" />
      <label htmlFor="cover" className="cursor-pointer font-medium text-gray-500">
        {loading ? "Uploading..." : "Click to upload cover image"}
      </label>
    </div>
  );
}