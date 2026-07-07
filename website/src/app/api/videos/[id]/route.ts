import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'videos.json');

// NOTE: Since this is Next.js 13+ App router, dynamic route params must be awaited in recent versions (Next.js 15), but we'll await it to be safe.
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const { title, description, category } = body;

    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    let videos = JSON.parse(fileContent);
    const videoIndex = videos.findIndex((v: any) => v.id === id);

    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Update metadata
    videos[videoIndex] = {
      ...videos[videoIndex],
      title: title ?? videos[videoIndex].title,
      description: description ?? videos[videoIndex].description,
      category: category ?? videos[videoIndex].category,
    };

    await fs.writeFile(dataFilePath, JSON.stringify(videos, null, 2));

    return NextResponse.json({ message: 'Video updated successfully', video: videos[videoIndex] });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    let videos = JSON.parse(fileContent);
    const videoIndex = videos.findIndex((v: any) => v.id === id);

    if (videoIndex === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const video = videos[videoIndex];
    const uploadDirPath = path.join(process.cwd(), 'public', 'uploads', 'videos');
    const filePath = path.join(uploadDirPath, video.fileName);
    
    // Delete the file
    try {
      await fs.unlink(filePath);
    } catch (e) {
      console.warn('Failed to delete file, it might not exist:', e);
    }

    // Remove from array
    videos.splice(videoIndex, 1);
    await fs.writeFile(dataFilePath, JSON.stringify(videos, null, 2));

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
