import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";
import ServiceHero from "@/components/ServiceHero";
import ServiceVideoGrid from "@/components/ServiceVideoGrid";
import { supabase } from '@/lib/supabase';
import { getValidBackgroundVideo } from '@/utils/videoHelpers';

import AnimatedFeaturesGrid from "@/components/AnimatedFeaturesGrid";

export const dynamic = 'force-dynamic';

export default async function PostProductionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');
  const serviceData = dict.services.postProduction;

  const { data: latestVideo } = await supabase
    .from('videos')
    .select('video_url')
    .eq('category', 'Proxy Post Production')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <main className="layout animate-fade-in" style={{ minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-post-production" />
      <ServiceHero 
        title={`PROXY <span style="font-weight: 300">POST PRODUCTION</span>`}
        subtitle={serviceData.headline}
        videoUrl={getValidBackgroundVideo(latestVideo?.video_url)}
      />
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <p className="lead-text" style={{ maxWidth: '900px', margin: '0 auto 4rem auto', textAlign: 'center', lineHeight: '1.8' }}>
          {serviceData.intro}
        </p>
        <AnimatedFeaturesGrid 
          featuresTitle={serviceData.featuresTitle}
          features={serviceData.features}
        />
      </div>
      <ServiceVideoGrid serviceName="Proxy Post Production" />
    </main>
  );
}
