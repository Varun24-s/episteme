import Link from "next/link";
import { BookOpen, Newspaper, Quote, Feather } from "lucide-react";
import React from "react";

export default function PostCard({ post }) {
  // Select an icon based on title length just to add variety across the grid
  const icons = [<BookOpen />, <Newspaper />, <Quote />, <Feather />];
  const Icon = icons[post.title.length % icons.length];

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      {post.cover_image ? (
        <div className="overflow-hidden rounded-2xl mb-4 bg-gray-100">
          <img 
            src={post.cover_image} 
            className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105" 
            alt={post.title}
          />
        </div>
      ) : (
        /* The Subtle Placeholder */
        <div className="w-full aspect-video rounded-2xl mb-4 bg-gray-50 border border-gray-50 relative overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-gray-300 group-hover:bg-gray-100">
          
          {/* Subtle Dot Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity"
            style={{ 
              backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', 
              backgroundSize: '12px 12px' 
            }}
          />

          {/* Minimal Iconography */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="text-gray-300 group-hover:text-blue-600 transition-colors duration-300">
              {/* Clone the icon to apply sizing via props */}
              {React.cloneElement(Icon, { size: 28, strokeWidth: 1.2 })}
            </div>
            
            {/* Minimalist Ordinal or Initials */}
            <div className="h-[1px] w-6 bg-gray-200 group-hover:w-10 group-hover:bg-blue-200 transition-all duration-300" />
          </div>

          {/* Subtle Corner Label */}
          <div className="absolute bottom-3 right-4">
             <span className="text-[10px] font-medium tracking-[0.2em] text-gray-300 uppercase">
               Draft
             </span>
          </div>
        </div>
      )}
      
      <div className="space-y-1.5 px-1">
        <h2 className="text-lg font-semibold tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            {post.profiles?.username || "Writer"}
          </p>
          <span className="w-1 h-1 bg-gray-200 rounded-full" />
          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}