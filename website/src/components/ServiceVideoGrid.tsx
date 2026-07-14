import { supabase } from '@/lib/supabase';

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
          <div key={video.id} className="service-card" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <div className="video-card-container">
              <video 
                src={video.video_url} 
                poster={video.thumbnail_url || undefined}
                controls 
                preload="none"
                className="video-card-element"
              />
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{video.title}</h3>
              {video.description && (
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {video.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
