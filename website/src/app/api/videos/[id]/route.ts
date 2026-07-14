import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const { title, description, category, thumbnail } = body;

    let updateData: any = { title, description, category };

    if (thumbnail) {
      const fsPromises = require('fs/promises');
      const path = require('path');
      const os = require('os');
      const uploadDir = path.join(os.homedir(), '.proxy_videos');
      await fsPromises.mkdir(uploadDir, { recursive: true });

      const matches = thumbnail.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');
        const thumbFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-thumb.${ext}`;
        const thumbFilePath = path.join(uploadDir, thumbFileName);
        await fsPromises.writeFile(thumbFilePath, buffer);
        updateData.thumbnail_url = `/api/videos/thumbnail/${thumbFileName}`;
      }
    }

    const { data: video, error } = await supabase
      .from('videos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
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
      .select('video_url, thumbnail_url')
      .eq('id', id)
      .single();

    if (fetchError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const urlParts = video.video_url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const fs = require('fs/promises');
    const path = require('path');
    const os = require('os');
    const uploadDir = path.join(os.homedir(), '.proxy_videos');

    // Delete video from local file system
    if (fileName) {
      const filePath = path.join(uploadDir, fileName);
      await fs.unlink(filePath).catch((err: any) => console.error('Failed to delete video file:', err));
    }

    // Delete thumbnail from local file system
    if (video.thumbnail_url) {
      const thumbParts = video.thumbnail_url.split('/');
      const thumbFileName = thumbParts[thumbParts.length - 1];
      if (thumbFileName) {
        const thumbFilePath = path.join(uploadDir, thumbFileName);
        await fs.unlink(thumbFilePath).catch((err: any) => console.error('Failed to delete thumbnail file:', err));
      }
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
