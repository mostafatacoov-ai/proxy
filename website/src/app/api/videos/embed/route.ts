import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Accepts:
 *  - A raw <iframe ...> embed snippet (extracts src attribute)
 *  - A youtube.com/watch?v= URL          → converts to embed URL
 *  - A youtu.be/ID shortlink             → converts to embed URL
 *  - An already-normalized embed URL     → used as-is
 *  - A Vimeo player URL                  → used as-is
 *
 * Returns the canonical embed src, or null when the input is unrecognised.
 */
function extractEmbedSrc(input: string): string | null {
  const trimmed = input.trim();

  // 1. Raw <iframe ...> — extract src="..."
  const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch) return iframeSrcMatch[1];

  // 2. youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/youtube\.com\/watch\?(?:[^#]*&)?v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // 3. youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // 4. Already a YouTube embed URL
  if (/youtube\.com\/embed\//.test(trimmed)) return trimmed;

  // 5. Vimeo player URL
  if (/player\.vimeo\.com\/video\//.test(trimmed)) return trimmed;

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, embedCode, thumbnailUrl } = body as {
      title: string;
      description?: string;
      category: string;
      embedCode: string;
      thumbnailUrl?: string | null;
    };

    if (!title || !category || !embedCode) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, embedCode' },
        { status: 400 }
      );
    }

    const embedSrc = extractEmbedSrc(embedCode);
    if (!embedSrc) {
      return NextResponse.json(
        { error: 'Could not extract a valid embed URL. Paste a YouTube link, youtu.be short link, or a full <iframe> embed code.' },
        { status: 422 }
      );
    }

    // Prefix with "embed:" so VideoCard knows to render an iframe, not Plyr
    const videoUrl = `embed:${embedSrc}`;

    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          title,
          description: description || '',
          category,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Embed video added successfully', video: data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Embed API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
