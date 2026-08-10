import { getDictionary } from "@/getDictionary";
import { supabase } from '@/lib/supabase';
import VideoCard from '@/components/VideoCard';
import { getBentoShape } from '@/utils/bento';

export const revalidate = 0; // Ensure fresh data on every request

export default async function Work({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  // Fetch videos from Supabase
  let videos: any[] = [];
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    if (data) videos = data;
  } catch (e) {
    console.error('Failed to load videos from Supabase:', e);
  }

  // Group videos by category or just list them all. The request says "dropdown to check where this video will apper like under proxy production or proxcy advertisng, ...ext".
  // This implies we might want to group them or show the category. Let's list them all but display the category badge.

  return (
    <div className="section-padding container animate-fade-in" style={{ marginTop: '100px', paddingBottom: '100px' }}>
      <h1 className="section-title">{dict.work.title}</h1>
      <p className="lead-text">{dict.work.subtitle}</p>
      
      {videos.length === 0 ? (
        <div style={{ padding: '4rem', border: '1px dashed #333', textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          <h2>No videos uploaded yet</h2>
          <p>Go to the /admin page to upload your portfolio.</p>
        </div>
      ) : (
        <div className="video-bento-grid" style={{ marginTop: '4rem' }}>
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} showDetails={true} shapeClass={getBentoShape(index)} />
          ))}
        </div>
      )}
    </div>
  );
}
