import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: existing } = await supabase
    .from('likes')
    .select('*')
    .match({ post_id: params.id, user_id: userId })
    .single();

  if (existing) {
    await supabase.from('likes').delete().match({ post_id: params.id, user_id: userId });
    return NextResponse.json({ liked: false });
  } else {
    await supabase.from('likes').insert({ post_id: params.id, user_id: userId });
    return NextResponse.json({ liked: true });
  }
}