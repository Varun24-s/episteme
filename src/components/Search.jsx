"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search as SearchIcon, FileText, User, Loader2, XCircle } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ posts: [], profiles: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ posts: [], profiles: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const hasResults = results.posts.length > 0 || results.profiles.length > 0;

  return (
    <div className="relative w-full max-w-sm group">
      {/* Input Field */}
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
        <input 
          className="w-full bg-gray-100 border border-transparent rounded-full py-2.5 pl-10 pr-10 outline-none focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-black transition-all text-sm"
          placeholder="Search stories or people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading ? (
          <Loader2 className="absolute right-3.5 text-gray-400 animate-spin" size={16} />
        ) : query.length > 0 && (
          <button onClick={() => setQuery("")} className="absolute right-3.5 text-gray-400 hover:text-black">
            <XCircle size={16} fill="currentColor" className="text-gray-200 hover:text-gray-400 transition-colors" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {query.length > 1 && !loading && (
        <div className="absolute top-full mt-2 w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-2 border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Posts Section */}
          {results.posts.length > 0 && (
            <div className="mb-2">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Stories</p>
              {results.posts.map(p => (
                <Link 
                  key={p.id} 
                  href={`/blog/${p.slug}`} 
                  onClick={() => setQuery("")}
                  className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors group/item"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover/item:bg-white border border-transparent group-hover/item:border-gray-200">
                    <FileText size={14} className="text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">{p.title}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Profiles Section */}
          {results.profiles.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">People</p>
              {results.profiles.map(u => (
                <Link 
                  key={u.id} 
                  href={`/profile/${u.id}`} 
                  onClick={() => setQuery("")}
                  className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors group/item"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover/item:bg-white border border-transparent group-hover/item:border-gray-200">
                    <User size={14} className="text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">{u.username}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!hasResults && (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-400">No matches for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}