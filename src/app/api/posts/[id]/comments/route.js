import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Get all comments for a post
export async function GET(req, { params }) {
  const { data } = await supabase
    .from('comments')
    .select('*, profiles(username, avatar_url)')
    .eq('post_id', params.id)
    .order('created_at', { ascending: false });
  return NextResponse.json(data);
}

// Post a new comment
export async function POST(req, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id: params.id, user_id: userId, content }])
    .select();

  return NextResponse.json(data[0]);
}