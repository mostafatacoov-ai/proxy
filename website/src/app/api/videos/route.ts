import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'videos.json');
const uploadDirPath = path.join(process.cwd(), 'public', 'uploads', 'videos');

export async function GET() {
  try {
    let videos = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      videos = JSON.parse(fileContent);
    } catch (e) {
      // file might not exist, return empty array
    }
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Failed to read videos data', error);
    return NextResponse.json({ error: 'Failed to read videos data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!file || !title || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the upload directory exists
    try {
      await fs.access(uploadDirPath);
    } catch {
      await fs.mkdir(uploadDirPath, { recursive: true });
    }

    // Create a unique file name
    const ext = path.extname(file.name) || '.mp4';
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadDirPath, fileName);

    // Write the file
    await fs.writeFile(filePath, buffer);

    // Read existing data
    let videos = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      videos = JSON.parse(fileContent);
    } catch (e) {
      // file might not exist or be empty
    }

    const newVideo = {
      id: Date.now().toString(),
      title,
      description: description || '',
      category,
      fileName,
      filePath: `/uploads/videos/${fileName}`,
      createdAt: new Date().toISOString()
    };

    videos.push(newVideo);

    await fs.writeFile(dataFilePath, JSON.stringify(videos, null, 2));

    return NextResponse.json({ message: 'Video uploaded successfully', video: newVideo }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
