import { getDictionary } from "@/getDictionary";

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  const stats = [
    { value: '5', label: lang === 'ar' ? 'أقسام إبداعية' : 'Creative Divisions' },
    { value: '100+', label: lang === 'ar' ? 'مشروع منجز' : 'Projects Delivered' },
    { value: '10+', label: lang === 'ar' ? 'سنوات خبرة' : 'Years of Experience' },
    { value: '50+', label: lang === 'ar' ? 'عميل راضٍ' : 'Happy Clients' },
  ];

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh' }}>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '140px',
        paddingBottom: '5rem',
      }}>
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: '1rem' }}>{dict.about.title}</h1>
          <p className="lead-text" style={{ maxWidth: '700px', marginBottom: 0 }}>{dict.about.description}</p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        background: '#0d0d0d',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0',
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{
                  fontSize: '2.8rem',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1,
                  marginBottom: '0.4rem',
                }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container section-padding">
        <div className="mission-vision mt-4">
          <div className="mv-box" style={{ borderLeft: '3px solid rgba(255,255,255,0.15)', paddingLeft: '2.5rem' }}>
            <h3>{dict.about.missionTitle}</h3>
            <p>{dict.about.mission}</p>
          </div>
          <div className="mv-box" style={{ borderLeft: '3px solid rgba(255,255,255,0.15)', paddingLeft: '2.5rem' }}>
            <h3>{dict.about.visionTitle}</h3>
            <p>{dict.about.vision}</p>
          </div>
        </div>
      </div>

      {/* Contact Info strip */}
      <div style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 300, marginBottom: '2rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {lang === 'ar' ? 'تواصل معنا' : 'Get In Touch'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {/* Address */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{lang === 'ar' ? 'العنوان' : 'Address'}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {lang === 'ar'
                    ? '١٠ ميدان أبو اللثامين، المهندسين، القاهرة'
                    : '10 Medan Abu El-Lothameen, El-Mohandeseen, Cairo'}
                </div>
              </div>
            </div>
            {/* Phone 1 */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.11h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l1.27-.8a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{lang === 'ar' ? 'الهاتف' : 'Phone'}</div>
                <a href="tel:+201001246516" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', display: 'block' }} dir="ltr">+20 100 124 6516</a>
                <a href="tel:+201101114078" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', display: 'block', marginTop: '0.2rem' }} dir="ltr">+20 110 111 4078</a>
              </div>
            </div>
            {/* Email */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</div>
                <a href="mailto:tantawy.mac85@gmail.com" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>tantawy.mac85@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
