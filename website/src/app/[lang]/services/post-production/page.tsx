import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";
import ServiceHero from "@/components/ServiceHero";
import ServiceVideoGrid from "@/components/ServiceVideoGrid";

export const dynamic = 'force-dynamic';

export default async function PostProductionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <main className="layout animate-fade-in" style={{ minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-post-production" />
      <ServiceHero 
        title={`PROXY <span style="font-weight: 300">POST PRODUCTION</span>`}
        subtitle={lang === 'en' ? 'The ultimate final polish for world-class storytelling.' : 'اللمسة النهائية المثالية لقصص عالمية المستوى.'}
      />
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 300 }}>About the Service</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div className="service-card" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Full Pipeline</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>End-to-end post-production management from offline edit to final master delivery.</p>
          </div>
          <div className="service-card" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Technical QC</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>Rigorous quality control ensuring every frame meets premium network standards.</p>
          </div>
        </div>
      </div>
      <ServiceVideoGrid serviceName="Proxy Post Production" />
    </main>
  );
}
