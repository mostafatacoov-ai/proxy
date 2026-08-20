import type { Metadata } from "next";
import "../globals.css";
import { getDictionary } from "@/getDictionary";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Proxy Group",
  description: "Premium post-production for extraordinary stories.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const navLinks = [
    { href: `/${lang}`, label: dict.navigation.home },
    { href: `/${lang}/work`, label: dict.navigation.work },
    { href: `/${lang}/about`, label: dict.navigation.about },
    { href: `/${lang}/contact`, label: dict.navigation.contact },
  ];

  const serviceLinks = [
    { href: `/${lang}/services/post-production`, label: dict.navigation.postProduction },
    { href: `/${lang}/services/production`, label: dict.navigation.production },
    { href: `/${lang}/services/advertising`, label: dict.navigation.advertising },
    { href: `/${lang}/services/exclusive`, label: dict.navigation.exclusive },
    { href: `/${lang}/services/studio`, label: dict.navigation.studio },
  ];

  return (
    <html lang={lang} dir={dir}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;800&family=Inter:wght@300;400;500;600;800&family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="layout">
          <Navigation lang={lang as 'en' | 'ar'} dict={dict} />
          {children}

          {/* ── Professional Footer ── */}
          <footer className="footer">
            <div className="footer-inner">
              {/* Brand column */}
              <div className="footer-col footer-brand">
                <Link href={`/${lang}`}>
                  <Image
                    src="/images/logo-horizontal.jpeg"
                    alt="Proxy Group"
                    width={140}
                    height={40}
                    style={{ objectFit: 'contain' }}
                  />
                </Link>
                <p>{lang === 'ar' ? 'إنتاج احترافي لقصص استثنائية.' : 'Premium production for extraordinary stories.'}</p>
              </div>

              {/* Navigation column */}
              <div className="footer-col">
                <h4>{lang === 'ar' ? 'التنقل' : 'Navigation'}</h4>
                <ul>
                  {navLinks.map(link => (
                    <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Services column */}
              <div className="footer-col">
                <h4>{lang === 'ar' ? 'الخدمات' : 'Services'}</h4>
                <ul>
                  {serviceLinks.map(link => (
                    <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} {dict.footer.copy}</p>
              <div className="footer-socials" aria-label="Social media links">
                {/* Instagram */}
                <a href="#" className="footer-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="#" className="footer-social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="footer-social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
