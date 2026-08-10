import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: videos, error } = await supabase
    .from('videos')
    .select('category, title, video_url, thumbnail_url')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error });

  const categories = {};
  videos.forEach(v => {
    if (!categories[v.category]) {
      categories[v.category] = v;
    }
  });

  return NextResponse.json(categories);
}
