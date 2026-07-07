import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const { title, description, category } = body;

    const { data: video, error } = await supabase
      .from('videos')
      .update({ title, description, category })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json({ error: 'Video not found or failed to update' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Video updated successfully', video });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    
    // First, get the video to find the storage path
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('video_url')
      .eq('id', id)
      .single();

    if (fetchError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Extract filename from the public URL
    // Public URL format: .../storage/v1/object/public/videos/{filename}
    const urlParts = video.video_url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Delete from Supabase Storage
    if (fileName) {
      await supabase.storage.from('videos').remove([fileName]);
    }

    // Delete from Supabase Database
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
