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
      const stream = Readable.toWeb(file);

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
        },
      });
    } else {
      const file = fs.createReadStream(filePath);
      const stream = Readable.toWeb(file);

      return new NextResponse(stream as any, {
        status: 200,
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': contentType,
        },
      });
    }
  } catch (error) {
    console.error('Streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
