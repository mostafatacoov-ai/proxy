import { getDictionary } from "@/getDictionary";
import { supabase } from '@/lib/supabase';
import AnimatedServiceCard from '@/components/AnimatedServiceCard';

export const revalidate = 0; // Ensure fresh data on every request

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  // Fetch the latest videos for each category to use as samples
  const { data: videos } = await supabase
    .from('videos')
    .select('category, video_url, thumbnail_url')
    .order('created_at', { ascending: false });

  const categorySamples: Record<string, { video_url: string, thumbnail_url: string | null }> = {};
  if (videos) {
    videos.forEach(v => {
      // Keep only the first (latest) video for each category
      if (!categorySamples[v.category]) {
        categorySamples[v.category] = { video_url: v.video_url, thumbnail_url: v.thumbnail_url };
      }
    });
  }

  const links = [
    { 
      href: `/${lang}/services/post-production`, 
      title: dict.navigation.postProduction, 
      desc: dict.services.postProduction.headline,
      category: 'Proxy Post Production'
    },
    { 
      href: `/${lang}/services/production`, 
      title: dict.navigation.production, 
      desc: dict.services.production.headline,
      category: 'Proxy Production'
    },
    { 
      href: `/${lang}/services/advertising`, 
      title: dict.navigation.advertising, 
      desc: dict.services.advertising.headline,
      category: 'Proxy Advertising'
    },
    { 
      href: `/${lang}/services/exclusive`, 
      title: dict.navigation.exclusive, 
      desc: dict.services.exclusive.headline,
      category: 'Proxy Exclusive'
    },
    { 
      href: `/${lang}/services/studio`, 
      title: dict.navigation.studio, 
      desc: dict.services.studio.headline,
      category: 'Proxy Studio'
    },
  ];

  const ctaText = lang === 'en' ? 'Explore Division' : 'اكتشف القسم';

  return (
    <div className="section-padding container animate-fade-in" style={{ marginTop: '100px', minHeight: '100vh' }}>
      <h1 className="section-title">{dict.navigation.services}</h1>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 300 }}>{dict.services.allServices.headline}</h2>
      <p className="lead-text" style={{ maxWidth: '900px', marginBottom: '4rem', lineHeight: '1.8' }}>{dict.services.allServices.intro}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {links.map((link, i) => {
          const sample = categorySamples[link.category];
          return (
            <AnimatedServiceCard 
              key={i}
              href={link.href}
              title={link.title}
              desc={link.desc}
              ctaText={ctaText}
              videoUrl={sample?.video_url}
              thumbnailUrl={sample?.thumbnail_url || undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
