import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// GET: Fetch all comments
export async function GET(req, { params }) {
  const { id } = await params; // Must await params in modern Next.js
  
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(username, avatar_url)')
    .eq('post_id', id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data || []);
}

// POST: Save a new comment
export async function POST(req, { params }) {
  const { userId } = await auth();
  const { id } = await params;
  
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  
  const { data, error } = await supabase
    .from('comments')
    .insert([{ 
      post_id: id, 
      author_id: userId, // Changed from user_id to author_id to match your DB
      content 
    }])
    .select()
    .single(); // Get the single object back instead of an array

  if (error) {
    console.error("Supabase Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
