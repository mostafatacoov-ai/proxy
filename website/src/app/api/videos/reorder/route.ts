import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { videoIds } = body;

    if (!Array.isArray(videoIds)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Fetch current created_at timestamps for these specific videos
    const { data: currentVideos, error: fetchError } = await supabase
      .from('videos')
      .select('id, created_at')
      .in('id', videoIds);

    if (fetchError || !currentVideos) {
      console.error('Failed to fetch current timestamps:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch current timestamps' }, { status: 500 });
    }

    // Sort timestamps descending (newest first)
    const sortedTimestamps = currentVideos
      .map(v => v.created_at)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Process sequentially to avoid connection limit issues if there are many videos
    for (let i = 0; i < videoIds.length; i++) {
      const id = videoIds[i];
      // Assign the largest timestamp to the first item, etc.
      const newDate = sortedTimestamps[i];
      
      const { error } = await supabase
        .from('videos')
        .update({ created_at: newDate })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating video order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
