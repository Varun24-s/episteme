"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function CommentSection({ postId }) {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
  fetch(`/api/posts/${postId}/comments`)
    .then(res => res.json())
    .then(data => {
      // If data is an array, use it. If not, use an empty array.
      setComments(Array.isArray(data) ? data : []);
    })
    .catch(err => {
      console.error(err);
      setComments([]); // Fallback on error
    });
}, [postId]);

  const postComment = async () => {
  if (!text.trim()) return;

  try {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text })
    });

    const data = await res.json();

    if (res.ok) {
      // Use the 'prev' state to ensure we always have the latest array
      setComments((prev) => {
        const currentComments = Array.isArray(prev) ? prev : [];
        return [data, ...currentComments];
      });
      setText("");
    } else {
      console.error("Comment failed:", data.error);
      alert(`Error: ${data.error}`);
    }
  } catch (err) {
    console.error("Network error:", err);
  }
};

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <input 
          className="flex-1 border-b outline-none py-2" 
          placeholder="Add a comment..." 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={postComment} className="bg-black cursor-pointer text-white px-4 py-1 rounded-full text-sm">Post</button>
      </div>
      {comments?.map(c => (
        <div key={c.id} className="text-sm border-l-2 pl-4 py-1">
          <p>{c.content}</p>
        </div>
      ))}
    </div>
  );
}