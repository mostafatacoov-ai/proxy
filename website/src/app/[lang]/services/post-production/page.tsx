import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";

export default async function PostProductionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <main className="layout animate-fade-in" style={{ paddingTop: '150px', minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-post-production" />
      <div className="container">
        <h1 className="section-title" style={{ textAlign: 'center', fontSize: '4.5rem', marginBottom: '1rem' }}>
          PROXY <span style={{ fontWeight: 300 }}>POST PRODUCTION</span>
        </h1>
        <p className="lead-text" style={{ textAlign: 'center', margin: '0 auto 4rem auto', maxWidth: '600px', color: 'rgba(255,255,255,0.9)' }}>
          {lang === 'en' ? 'The ultimate final polish for world-class storytelling.' : 'اللمسة النهائية المثالية لقصص عالمية المستوى.'}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
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
    </main>
  );
}
