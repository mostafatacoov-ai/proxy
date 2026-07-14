import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";
import ServiceHero from "@/components/ServiceHero";
import ServiceVideoGrid from "@/components/ServiceVideoGrid";

export const dynamic = 'force-dynamic';

export default async function ProductionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <main className="layout animate-fade-in" style={{ minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-production" />
      <ServiceHero 
        title={`PROXY <span style="font-weight: 300">PRODUCTION</span>`}
        subtitle={lang === 'en' ? 'Cinematic excellence delivered through comprehensive post-production services.' : 'التميز السينمائي من خلال خدمات ما بعد الإنتاج الشاملة.'}
      />
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 300 }}>About the Service</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div className="service-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Offline Editing</h3>
            <p style={{ fontSize: '1.1rem', color: '#a1a1a1', lineHeight: '1.6' }}>Crafting the core narrative with precision and emotional resonance.</p>
          </div>
          <div className="service-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Online & Finishing</h3>
            <p style={{ fontSize: '1.1rem', color: '#a1a1a1', lineHeight: '1.6' }}>High-resolution conform and final technical delivery for all formats.</p>
          </div>
        </div>
      </div>
      <ServiceVideoGrid serviceName="Proxy Production" />
    </main>
  );
}
