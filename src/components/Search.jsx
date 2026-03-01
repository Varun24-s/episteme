"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ posts: [], profiles: [] });

  useEffect(() => {
    if (query.length < 2) return setResults({ posts: [], profiles: [] });
    const delay = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <input 
        className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-black"
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.length > 1 && (
        <div className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-2xl p-2 border z-50">
          {results.posts.map(p => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="block p-2 hover:bg-gray-50 rounded-lg text-sm">📄 {p.title}</Link>
          ))}
          {results.profiles.map(u => (
            <Link key={u.id} href={`/profile/${u.id}`} className="block p-2 hover:bg-gray-50 rounded-lg text-sm">👤 {u.username}</Link>
          ))}
        </div>
      )}
    </div>
  );
}