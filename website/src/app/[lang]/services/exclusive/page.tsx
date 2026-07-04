import { getDictionary } from "@/getDictionary";
import ThemeSetter from "@/components/ThemeSetter";

export default async function ExclusivePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <main className="layout animate-fade-in" style={{ paddingTop: '150px', minHeight: '100vh' }}>
      <ThemeSetter themeClass="theme-exclusive" />
      <div className="container">
        <h1 className="section-title" style={{ textAlign: 'center', fontSize: '4.5rem', marginBottom: '1rem' }}>
          PROXY <span style={{ fontWeight: 300 }}>EXCLUSIVE</span>
        </h1>
        <p className="lead-text" style={{ textAlign: 'center', margin: '0 auto 4rem auto', maxWidth: '600px', color: 'rgba(255,255,255,0.9)' }}>
          {lang === 'en' ? 'Bespoke finishing for narrative features and premium documentaries.' : 'تشطيبات مخصصة للأفلام الروائية والأفلام الوثائقية المتميزة.'}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
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
    </main>
  );
}
