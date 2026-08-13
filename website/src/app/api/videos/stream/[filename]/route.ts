import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Readable } from 'stream';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);
    
    // Potential locations for .proxy_videos on various hosting environments (like Hostinger)
    const potentialPaths = [
      path.join(os.homedir(), '.proxy_videos', decodedFilename),
      path.join(process.cwd(), '.proxy_videos', decodedFilename),
      path.join(process.cwd(), '..', '.proxy_videos', decodedFilename),
      path.join(process.cwd(), '..', '..', '.proxy_videos', decodedFilename),
      path.join(process.cwd(), 'public', 'videos', decodedFilename)
    ];

    let filePath = '';
    let fileExists = false;

    for (const p of potentialPaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        fileExists = true;
        break;
      }
    }

    if (!fileExists) {
      return new NextResponse('File not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    const getContentType = (ext: string) => {
      switch (ext.toLowerCase()) {
        case '.webm': return 'video/webm';
        case '.ogg': return 'video/ogg';
        case '.mov': return 'video/quicktime';
        default: return 'video/mp4';
      }
    };
    
    const contentType = getContentType(path.extname(filename));

    if (range) {
      // Parse Range
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      const file = fs.createReadStream(filePath, { start, end });
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

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, no-transform',
          'Content-Encoding': 'identity',
        },
      });
    } else {
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

      return new NextResponse(stream as any, {
        status: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, no-transform',
          'Content-Encoding': 'identity',
        },
      });
    }
  } catch (error) {
    console.error('Streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
