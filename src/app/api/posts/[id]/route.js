import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  const { userId } = await auth();
  
  // RLS in Supabase will also block this if author_id != userId
  const { error } = await supabase
    .from('posts')
    .delete()
    .match({ id: params.id, author_id: userId });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}