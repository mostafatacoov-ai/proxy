"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navigation({ lang, dict }: { lang: 'en' | 'ar', dict: Record<string, any> }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  const switchLang = lang === 'en' ? 'ar' : 'en';
  // Regex to replace the lang part of the URL (e.g. /en/about -> /ar/about)
  const switchedPath = pathname.replace(`/${lang}`, `/${switchLang}`);

  return (
    <nav className={`nav animate-fade-in ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="logo-container">
        <Link href={`/${lang}`}>
          <Image
            src="/images/logo-horizontal.jpeg"
            alt="Proxy Group"
            width={180}
            height={50}
            className="logo"
            priority
          />
        </Link>
      </div>

      <button 
        className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link href={`/${lang}`} className="nav-link" onClick={() => setMobileMenuOpen(false)}>{dict.navigation.home}</Link>
        <Link href={`/${lang}/work`} className="nav-link" onClick={() => setMobileMenuOpen(false)}>{dict.navigation.work}</Link>
        <div className={`dropdown ${mobileServicesOpen ? 'mobile-services-open' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link href={`/${lang}/services`} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              {dict.navigation.services}
            </Link>
            <button 
              className="mobile-dropdown-toggle"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              aria-label="Toggle services menu"
            >
              ▼
            </button>
          </div>
          <div className="dropdown-content">
            <Link href={`/${lang}/services/post-production`} onClick={() => setMobileMenuOpen(false)}>{dict.navigation.postProduction}</Link>
            <Link href={`/${lang}/services/production`} onClick={() => setMobileMenuOpen(false)}>{dict.navigation.production}</Link>
            <Link href={`/${lang}/services/advertising`} onClick={() => setMobileMenuOpen(false)}>{dict.navigation.advertising}</Link>
            <Link href={`/${lang}/services/exclusive`} onClick={() => setMobileMenuOpen(false)}>{dict.navigation.exclusive}</Link>
            <Link href={`/${lang}/services/studio`} onClick={() => setMobileMenuOpen(false)}>{dict.navigation.studio}</Link>
          </div>
        </div>
        <Link href={`/${lang}/about`} className="nav-link" onClick={() => setMobileMenuOpen(false)}>{dict.navigation.about}</Link>
        <Link href={`/${lang}/contact`} className="nav-link" onClick={() => setMobileMenuOpen(false)}>{dict.navigation.contact}</Link>
        
        <Link href={switchedPath} className="nav-link lang-toggle" style={{ marginLeft: 'auto', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1rem' }} onClick={() => setMobileMenuOpen(false)}>
          {dict.navigation.langToggle}
        </Link>
      </div>
    </nav>
  );
}
