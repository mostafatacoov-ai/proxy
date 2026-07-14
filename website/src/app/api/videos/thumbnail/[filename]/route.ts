import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    let filePath = path.join(os.homedir(), '.proxy_videos', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Thumbnail not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    
    const getContentType = (ext: string) => {
      switch (ext.toLowerCase()) {
        case '.png': return 'image/png';
        case '.webp': return 'image/webp';
        default: return 'image/jpeg';
      }
    };
    
    const contentType = getContentType(path.extname(filename));

    const file = fs.createReadStream(filePath);
    const stream = new ReadableStream({
      start(controller) {
        file.on('data', (chunk) => controller.enqueue(new Uint8Array(Buffer.from(chunk))));
        file.on('end', () => controller.close());
        file.on('error', (err) => controller.error(err));
      },
      cancel() {
        file.destroy();
      }
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Thumbnail streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
