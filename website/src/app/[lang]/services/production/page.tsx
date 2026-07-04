import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";

export default async function ProductionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <main className="layout animate-fade-in" style={{ paddingTop: '150px', minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-production" />
      <div className="container">
        <h1 className="section-title" style={{ textAlign: 'center', fontSize: '4.5rem', marginBottom: '1rem' }}>
          PROXY <span style={{ fontWeight: 300 }}>PRODUCTION</span>
        </h1>
        <p className="lead-text" style={{ textAlign: 'center', margin: '0 auto 4rem auto', maxWidth: '600px' }}>
          {lang === 'en' ? 'Cinematic excellence delivered through comprehensive post-production services.' : 'التميز السينمائي من خلال خدمات ما بعد الإنتاج الشاملة.'}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
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
    </main>
  );
}
