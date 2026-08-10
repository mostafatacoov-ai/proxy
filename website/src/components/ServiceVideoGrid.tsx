import { supabase } from '@/lib/supabase';
import VideoCard from '@/components/VideoCard';
interface ServiceVideoGridProps {
  serviceName: string;
}

export default async function ServiceVideoGrid({ serviceName }: ServiceVideoGridProps) {
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .ilike('category', `%${serviceName}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos for service:', serviceName, error);
    return null;
  }

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 300 }}>Featured Work</h2>
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} showDetails={true} />
        ))}
      </div>
    </div>
  );
}
