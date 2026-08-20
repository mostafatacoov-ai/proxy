import { getDictionary } from "@/getDictionary";
import { supabase } from '@/lib/supabase';
import WorkClient from '@/components/WorkClient';

export const revalidate = 0;

export default async function Work({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

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

  return (
    <div style={{ marginTop: '70px', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Page header */}
      <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '1rem' }}>
        <h1 className="section-title">{dict.work.title}</h1>
        <p className="lead-text">{dict.work.subtitle}</p>
      </div>

      {/* Filter + grid — client component */}
      <WorkClient
        videos={videos}
        emptyTitle="No videos uploaded yet"
        emptySubtitle="Go to the /admin page to upload your portfolio."
      />

      {/* Bottom padding after grid */}
      <div style={{ height: '3rem' }} />
    </div>
  );
}
