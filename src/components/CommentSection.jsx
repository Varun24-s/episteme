"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function CommentSection({ postId }) {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`).then(res => res.json()).then(setComments);
  }, [postId]);

  const postComment = async () => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content: text })
    });
    if (res.ok) {
      const newC = await res.json();
      setComments([newC, ...comments]);
      setText("");
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
        <button onClick={postComment} className="bg-black text-white px-4 py-1 rounded-full text-sm">Post</button>
      </div>
      {comments.map(c => (
        <div key={c.id} className="text-sm border-l-2 pl-4 py-1">
          <p>{c.content}</p>
        </div>
      ))}
    </div>
  );
}