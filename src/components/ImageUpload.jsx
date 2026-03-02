"use client";
import { supabase } from "@/lib/supabase";
import { useState, useRef } from "react";
import { Upload, ImageIcon, Loader2, X } from "lucide-react";

export default function ImageUpload({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // Added for instant feedback
  const fileInputRef = useRef(null);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant Preview for better UX
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      onUpload(publicUrl);
    } catch (error) {
      alert(`Upload Error: ${error.message}`);
      setPreview(null); // Reset preview on error
    } finally {
      setLoading(false);
    }
  };

  const clearImage = (e) => {
    e.preventDefault();
    setPreview(null);
    onUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="group relative w-full aspect-video rounded-[32px] border-2  border-gray-200 bg-gray-50/50 transition-all hover:bg-white hover:border-gray-300 overflow-hidden">
      
      {/* 1. THE ACTUAL INPUT (Hidden) */}
      <input 
        ref={fileInputRef}
        type="file" 
        onChange={upload} 
        className="hidden" 
        id="cover-upload-input" 
        accept="image/*"
        disabled={loading}
      />

      {/* 2. THE PREVIEW STATE */}
      {preview ? (
        <div className="relative w-full h-full animate-in fade-in duration-500">
          <img src={preview} className="w-full h-full object-cover" alt="Preview" />
          
          {/* Overlay when loading */}
          {loading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
              <Loader2 className="animate-spin mb-2" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Optimizing...</span>
            </div>
          )}

          {/* Remove Button */}
          {!loading && (
            <button 
              onClick={clearImage}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-xl transition-transform hover:scale-110"
            >
              <X size={16} className="text-black" />
            </button>
          )}
        </div>
      ) : (
        /* 3. THE EMPTY STATE */
        <label 
          htmlFor="cover-upload-input" 
          className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-8 text-center"
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 group-hover:scale-110 transition-transform duration-300">
            <ImageIcon size={24} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-900 tracking-tight">
              Add a cover image
            </p>
            <p className="text-xs text-gray-400 font-medium">
              16:9 ratio recommended (Max 5MB)
            </p>
          </div>

          {/* Subtle "Drop" Indicator */}
          
        </label>
      )}
    </div>
  );
}