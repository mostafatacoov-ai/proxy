import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";
import ServiceHero from "@/components/ServiceHero";
import ServiceVideoGrid from "@/components/ServiceVideoGrid";

export const dynamic = 'force-dynamic';

export default async function ProductionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');
  const serviceData = dict.services.production;

  return (
    <main className="layout animate-fade-in" style={{ minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-production" />
      <ServiceHero 
        title={`PROXY <span style="font-weight: 300">PRODUCTION</span>`}
        subtitle={serviceData.headline}
      />
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <p className="lead-text" style={{ maxWidth: '900px', margin: '0 auto 4rem auto', textAlign: 'center', lineHeight: '1.8' }}>
          {serviceData.intro}
        </p>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 300 }}>{serviceData.featuresTitle}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {serviceData.features.map((feature: any, i: number) => (
            <div key={i} className="service-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ fontSize: '1.1rem', color: '#a1a1a1', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <ServiceVideoGrid serviceName="Proxy Production" />
    </main>
  );
}
