import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json({ posts: [], profiles: [] });

  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(username)')
    .ilike('title', `%${query}%`);

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', `%${query}%`);

  return NextResponse.json({ posts: posts || [], profiles: profiles || [] });
}