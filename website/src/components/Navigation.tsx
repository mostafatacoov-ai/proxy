"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navigation({ lang, dict }: { lang: 'en' | 'ar', dict: Record<string, any> }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="nav-links">
        <Link href={`/${lang}`} className="nav-link">{dict.navigation.home}</Link>
        <Link href={`/${lang}/work`} className="nav-link">{dict.navigation.work}</Link>
        <div className="dropdown">
          <Link href={`/${lang}/services`} className="nav-link">
            {dict.navigation.services}
          </Link>
          <div className="dropdown-content">
            <Link href={`/${lang}/services/post-production`}>{dict.navigation.postProduction}</Link>
            <Link href={`/${lang}/services/production`}>{dict.navigation.production}</Link>
            <Link href={`/${lang}/services/advertising`}>{dict.navigation.advertising}</Link>
            <Link href={`/${lang}/services/exclusive`}>{dict.navigation.exclusive}</Link>
            <Link href={`/${lang}/services/studio`}>{dict.navigation.studio}</Link>
          </div>
        </div>
        <Link href={`/${lang}/about`} className="nav-link">{dict.navigation.about}</Link>
        <Link href={`/${lang}/contact`} className="nav-link">{dict.navigation.contact}</Link>
        
        <Link href={switchedPath} className="nav-link lang-toggle" style={{ marginLeft: 'auto', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1rem' }}>
          {dict.navigation.langToggle}
        </Link>
      </div>
    </nav>
  );
}
