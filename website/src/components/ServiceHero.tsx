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
      // Explicitly trigger play to handle browser autoplay policies
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [isMuted]);

  return (
    <section className="hero-section service-hero-section">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          src={videoUrl}
        />
        <div className="video-overlay" style={{ background: 'rgba(0,0,0,0.5)' }}></div>
      </div>

      {/* hero-loaded ensures content is always visible — no hover needed on mobile */}
      <div className="hero-content hero-loaded">
        <h1 className="hero-headline" style={{ fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: title }}></h1>
        <p className="hero-subheadline">
          {subtitle}
        </p>
      </div>

      <button 
        className="volume-toggle" 
        onClick={() => setIsMuted(!isMuted)}
        aria-label="Toggle Volume"
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
