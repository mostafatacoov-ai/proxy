"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navigation({ lang, dict }: { lang: 'en' | 'ar', dict: any }) {
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
        <Link href={`/${lang}/services`} className="nav-link">{dict.navigation.services}</Link>
        <Link href={`/${lang}/about`} className="nav-link">{dict.navigation.about}</Link>
        <Link href={`/${lang}/contact`} className="nav-link">{dict.navigation.contact}</Link>
        
        <Link href={switchedPath} className="nav-link lang-toggle" style={{ marginLeft: 'auto', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1rem' }}>
          {dict.navigation.langToggle}
        </Link>
      </div>
    </nav>
  );
}
