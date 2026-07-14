import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";
import ServiceHero from "@/components/ServiceHero";
import ServiceVideoGrid from "@/components/ServiceVideoGrid";

export default async function AdvertisingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <main className="layout animate-fade-in" style={{ minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-advertising" />
      <ServiceHero 
        title={`PROXY <span style="font-weight: 300">ADVERTISING</span>`}
        subtitle={lang === 'en' ? 'High-impact commercial finishing for global brands and agencies.' : 'تشطيب إعلاني عالي التأثير للعلامات التجارية والوكالات العالمية.'}
      />
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 300 }}>About the Service</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div className="service-card" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', padding: '3rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Commercial VFX</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>Seamlessly integrating digital elements to elevate brand storytelling.</p>
          </div>
          <div className="service-card" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', padding: '3rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Broadcast Deliverables</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>Strict quality control for network and digital platform distribution.</p>
          </div>
        </div>
      </div>
      <ServiceVideoGrid serviceName="Proxy Advertising" />
    </main>
  );
}
