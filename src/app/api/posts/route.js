import { supabase } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data } = await supabase.from('posts').select('*, profiles(*)').order('created_at', {ascending: false});
  return NextResponse.json(data);
}

export async function POST(req) {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { title, content, cover_image } = await req.json();
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  await supabase.from('profiles').upsert({ id: userId, username: user.username, avatar_url: user.imageUrl });
  const { data } = await supabase.from('posts').insert([{ title, content, cover_image, slug, author_id: userId }]).select();
  return NextResponse.json(data[0]);
}