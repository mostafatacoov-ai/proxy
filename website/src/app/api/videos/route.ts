import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import os from 'os';

export async function GET() {
  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(videos || []);
  } catch (error) {
    console.error('Failed to read videos data', error);
    return NextResponse.json({ error: 'Failed to read videos data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const chunkIndexStr = formData.get('chunkIndex') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const uploadDir = path.join(os.homedir(), '.proxy_videos');
    await fsPromises.mkdir(uploadDir, { recursive: true });

    // --- CHUNKED UPLOAD PATH ---
    if (chunkIndexStr !== null) {
      const chunkIndex = parseInt(chunkIndexStr);
      const totalChunks = parseInt(formData.get('totalChunks') as string);
      const uniqueFileId = formData.get('uniqueFileId') as string;
      
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;

      const ext = path.extname(file.name) || '.mp4';
      const finalFileName = `${uniqueFileId}${ext}`;
      const filePath = path.join(uploadDir, finalFileName);

      const buffer = Buffer.from(await file.arrayBuffer());
      
      if (chunkIndex === 0) {
        await fsPromises.writeFile(filePath, buffer);
      } else {
        await fsPromises.appendFile(filePath, buffer);
      }

      if (chunkIndex === totalChunks - 1) {
        if (!title || !category) {
          return NextResponse.json({ error: 'Missing title or category on final chunk' }, { status: 400 });
        }

        const videoUrl = `/api/videos/stream/${finalFileName}`;
        const { data: dbData, error: dbError } = await supabase
          .from('videos')
          .insert([{ title, description: description || '', category, video_url: videoUrl }])
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          await fsPromises.unlink(filePath).catch(() => {});
          return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 });
        }

        return NextResponse.json({ message: 'Video uploaded successfully', video: dbData }, { status: 201 });
      }

      return NextResponse.json({ message: `Chunk ${chunkIndex} uploaded` }, { status: 200 });
    }

    // --- LEGACY SINGLE FILE PATH ---
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!title || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.mp4';
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const writeStream = fs.createWriteStream(filePath);
    const fileStream = file.stream();
    const reader = fileStream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        writeStream.write(Buffer.from(value));
      }
      writeStream.end();
    } catch (err) {
      writeStream.end();
      throw err;
    }

    const videoUrl = `/api/videos/stream/${fileName}`;
    const { data: dbData, error: dbError } = await supabase
      .from('videos')
      .insert([{ title, description: description || '', category, video_url: videoUrl }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      await fsPromises.unlink(filePath).catch(() => {});
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Video uploaded successfully', video: dbData }, { status: 201 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error', stack: error.stack }, { status: 500 });
  }
}
