import { supabase } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data } = await supabase.from('posts').select('*, profiles(*)').order('created_at', {ascending: false});
  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, cover_image } = body;

    // 1. Create a unique slug to avoid database conflicts
    const uniqueId = Math.random().toString(36).substring(2, 7);
    const slug = `${title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}-${uniqueId}`;

    // 2. Upsert Profile (with fallbacks for missing Clerk data)
    const { error: profileError } = await supabase.from('profiles').upsert({ 
      id: userId, 
      username: user?.username || user?.firstName || "Anonymous Writer", 
      avatar_url: user?.imageUrl || "" 
    });

    if (profileError) {
      console.error("Profile Upsert Error:", profileError);
      return NextResponse.json({ error: `Profile Error: ${profileError.message}` }, { status: 400 });
    }

    // 3. Insert Post
    const { data, error: postError } = await supabase
      .from('posts')
      .insert([{ 
        title, 
        content, 
        cover_image: cover_image || "", 
        slug, 
        author_id: userId 
      }])
      .select();

    // 4. CHECK IF INSERT FAILED
    if (postError) {
      console.error("Supabase Post Error:", postError);
      return NextResponse.json({ error: `Database Error: ${postError.message}` }, { status: 400 });
    }

    // 5. CHECK IF DATA IS EMPTY
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Post created but no data returned." }, { status: 500 });
    }

    // Success!
    return NextResponse.json(data[0]);

  } catch (err) {
    console.error("CRITICAL API ERROR:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}