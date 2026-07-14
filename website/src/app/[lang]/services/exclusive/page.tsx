import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";
import ServiceHero from "@/components/ServiceHero";
import ServiceVideoGrid from "@/components/ServiceVideoGrid";

export const dynamic = 'force-dynamic';

export default async function ExclusivePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <main className="layout animate-fade-in" style={{ minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-exclusive" />
      <ServiceHero 
        title={`PROXY <span style="font-weight: 300">EXCLUSIVE</span>`}
        subtitle={lang === 'en' ? 'Bespoke finishing for narrative features and premium documentaries.' : 'تشطيبات مخصصة للأفلام الروائية والأفلام الوثائقية المتميزة.'}
      />
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 300 }}>About the Service</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div className="service-card" style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '3rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Theatrical Color Grading</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>Mastering cinematic looks with pixel-perfect precision and emotional depth.</p>
          </div>
          <div className="service-card" style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '3rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dolby Atmos MIX</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>Immersive spatial audio mixing to place the audience inside the story.</p>
          </div>
        </div>
      </div>
      <ServiceVideoGrid serviceName="Proxy Exclusive" />
    </main>
  );
}
