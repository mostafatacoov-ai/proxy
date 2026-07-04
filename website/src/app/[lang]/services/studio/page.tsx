import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";

export default async function StudioPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <main className="layout animate-fade-in" style={{ paddingTop: '150px', minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-studio" />
      <div className="container">
        <h1 className="section-title" style={{ textAlign: 'center', fontSize: '4.5rem', marginBottom: '1rem' }}>
          PROXY <span style={{ fontWeight: 300 }}>STUDIO</span>
        </h1>
        <p className="lead-text" style={{ textAlign: 'center', margin: '0 auto 4rem auto', maxWidth: '600px', color: 'rgba(255,255,255,0.8)' }}>
          {lang === 'en' ? 'State-of-the-art facilities and suites for creative collaboration.' : 'أحدث المرافق والأجنحة للتعاون الإبداعي.'}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
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
    </main>
  );
}
