import { getDictionary } from "@/getDictionary";
import Link from "next/link";

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  const links = [
    { href: `/${lang}/services/post-production`, title: dict.navigation.postProduction, desc: dict.services.postProduction.headline },
    { href: `/${lang}/services/production`, title: dict.navigation.production, desc: dict.services.production.headline },
    { href: `/${lang}/services/advertising`, title: dict.navigation.advertising, desc: dict.services.advertising.headline },
    { href: `/${lang}/services/exclusive`, title: dict.navigation.exclusive, desc: dict.services.exclusive.headline },
    { href: `/${lang}/services/studio`, title: dict.navigation.studio, desc: dict.services.studio.headline },
  ];

  return (
    <div className="section-padding container animate-fade-in" style={{ marginTop: '100px', minHeight: '100vh' }}>
      <h1 className="section-title">{dict.navigation.services}</h1>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 300 }}>{dict.services.allServices.headline}</h2>
      <p className="lead-text" style={{ maxWidth: '900px', marginBottom: '4rem', lineHeight: '1.8' }}>{dict.services.allServices.intro}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {links.map((link, i) => (
          <Link href={link.href} key={i} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="service-card" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem', height: '100%', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{link.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', flexGrow: 1 }}>{link.desc}</p>
              <div style={{ marginTop: '2rem', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {lang === 'en' ? 'Explore Division' : 'اكتشف القسم'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
