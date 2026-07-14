import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";
import ServiceHero from "@/components/ServiceHero";
import ServiceVideoGrid from "@/components/ServiceVideoGrid";

export default async function StudioPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <main className="layout animate-fade-in" style={{ minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-studio" />
      <ServiceHero 
        title={`PROXY <span style="font-weight: 300">STUDIO</span>`}
        subtitle={lang === 'en' ? 'State-of-the-art facilities and suites for creative collaboration.' : 'أحدث المرافق والأجنحة للتعاون الإبداعي.'}
      />
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 300 }}>About the Service</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div className="service-card" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.15)', padding: '3rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Color Suites</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>Calibrated reference monitoring for absolute visual confidence.</p>
          </div>
          <div className="service-card" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.15)', padding: '3rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Audio Suites</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>Acoustically treated environments for pristine sound design and mixing.</p>
          </div>
        </div>
      </div>
      <ServiceVideoGrid serviceName="Proxy Studio" />
    </main>
  );
}
