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
      
      // If browser doesn't specify an end, send up to 2MB chunks at a time
      const CHUNK_SIZE = 2 * 1024 * 1024; 
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);
      const chunksize = (end - start) + 1;
      
      // Read the exact chunk into a buffer (avoids Transfer-Encoding: chunked)
      const buffer = Buffer.alloc(chunksize);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, chunksize, start);
      fs.closeSync(fd);

      return new NextResponse(buffer, {
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
      // For non-range requests, try to send the file.
      // Note: For large videos, range requests are required by browsers, so this rarely gets hit for videos.
      const buffer = fs.readFileSync(filePath);
      return new NextResponse(buffer, {
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
