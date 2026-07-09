"use client";

import { useState, useRef, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import Link from "next/link";

export default function HeroClient({ dict, lang }: { dict: Record<string, any>, lang: string }) {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <>
      {!loadingComplete && <LoadingScreen onComplete={() => setLoadingComplete(true)} />}
      
      <div className={`hero-wrapper ${loadingComplete ? 'show-hero' : 'hide-hero'}`}>
        <section className="hero-section">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              className="background-video"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              src="/api/videos/stream/final_V5_G.mp4"
            />
            <div className="video-overlay"></div>
          </div>

          <div className="hero-content">
            <h1 className="hero-headline" dangerouslySetInnerHTML={{ __html: dict.hero.headline }}></h1>
            <p className="hero-subheadline">
              {dict.hero.subheadline}
            </p>
            <div className="cta-container">
              <Link href={`/${lang}/work`} className="btn-primary">{dict.hero.explore}</Link>
              <Link href={`/${lang}/contact`} className="btn-secondary">{dict.hero.partner}</Link>
            </div>
          </div>

          <button 
            className="volume-toggle" 
            onClick={() => setIsMuted(!isMuted)}
            aria-label="Toggle Volume"
          >
            {isMuted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            )}
          </button>

          <div className="scroll-indicator">
            <div className="mouse"></div>
          </div>
        </section>
      </div>
    </>
  );
}
