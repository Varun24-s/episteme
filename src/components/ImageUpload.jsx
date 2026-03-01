"use client";
import { supabase } from "@/lib/supabase";
import { useState, useRef } from "react";

export default function ImageUpload({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // Added a ref to control the input directly

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name); // Step 1 Debug
    setLoading(true);

    try {
      // Create a clean file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `public/${fileName}`; // Organized folder

      console.log("Starting Supabase upload..."); // Step 2 Debug

      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      console.log("Upload successful, fetching URL..."); // Step 3 Debug

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        onUpload(urlData.publicUrl);
      }

    } catch (error) {
      console.error("FULL ERROR OBJECT:", error);
      alert(`Upload Error: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
      // Reset the input so the user can select a file again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full h-64 border-2 border-dashed rounded-3xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
      <input 
        ref={fileInputRef}
        type="file" 
        onChange={upload} 
        className="hidden" 
        id="cover-upload-input" 
        accept="image/*"
        disabled={loading}
      />
      <label 
        htmlFor="cover-upload-input" 
        className={`w-full h-full flex flex-col items-center justify-center cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <span className="font-bold text-black uppercase text-xs tracking-widest">Uploading to Episteme...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">🖼️</span>
            <span className="font-bold text-gray-400 uppercase text-xs tracking-widest">Click to upload cover</span>
          </div>
        )}
      </label>
    </div>
  );
}