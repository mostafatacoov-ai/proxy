"use client";

import { useState, useRef, useEffect } from "react";

interface ServiceHeroProps {
  title: string;
  subtitle: string;
  videoUrl?: string;
}

export default function ServiceHero({ title, subtitle, videoUrl = "/api/videos/stream/final_V5_G.mp4" }: ServiceHeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <section className="hero-section" style={{ minHeight: '60vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="video-wrapper" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <video
          ref={videoRef}
          className="background-video"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          src={videoUrl}
        />
        <div className="video-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)' }}></div>
      </div>

      <div className="hero-content" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', maxWidth: '800px' }}>
        <h1 className="hero-headline" style={{ fontSize: '4.5rem', marginBottom: '1rem', fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: title }}></h1>
        <p className="hero-subheadline" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
          {subtitle}
        </p>
      </div>

      <button 
        className="volume-toggle" 
        onClick={() => setIsMuted(!isMuted)}
        aria-label="Toggle Volume"
        style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 2, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
      >
        {isMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        )}
      </button>
    </section>
  );
}
