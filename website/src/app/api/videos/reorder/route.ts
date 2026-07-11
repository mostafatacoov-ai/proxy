import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { videoIds } = body;

    if (!Array.isArray(videoIds)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Since we sort by created_at descending in GET, 
    // the first video should have the newest timestamp.
    const now = Date.now();
    
    // Process sequentially to avoid connection limit issues if there are many videos
    for (let i = 0; i < videoIds.length; i++) {
      const id = videoIds[i];
      // Subtract seconds so they stay in order (first is newest)
      const newDate = new Date(now - i * 1000).toISOString();
      
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
