"use client";

import { useState, useRef, useEffect } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const finishLoading = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 800); // 800ms for fade out transition
  };

  useEffect(() => {
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent);
    
    if (isBot || sessionStorage.getItem('introPlayed')) {
      onComplete();
      return;
    }

    setIsMobile(window.innerWidth <= 768);
    setIsMounted(true);
  }, [onComplete]);

  useEffect(() => {
    if (!isMounted) return;

    if (videoRef.current) {
      // Start muted for guaranteed autoplay
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Browser blocked autoplay.", error);
          finishLoading(); // If autoplay fails, just skip the intro
        });
      }
    }

    // Fallback timer just in case video doesn't play or end event fails
    const timer = setTimeout(() => {
      finishLoading();
    }, 8000); // Reduced from 15s to 8s to prevent excessive waiting

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const handleVideoEnded = () => {
    sessionStorage.setItem('introPlayed', 'true');
    finishLoading();
  };

  // Don't render the video until we know if it's mobile or desktop to avoid loading the wrong video first
  if (!isMounted) {
    return <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}></div>;
  }

  return (
    <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}>
      <video 
        ref={videoRef}
        src={isMobile ? "/api/videos/stream/Proxy%20Logo.mp4" : "/api/videos/stream/intro.mp4"}
        playsInline 
        muted
        autoPlay
        onEnded={handleVideoEnded}
        className="intro-video"
      />
    </div>
  );
}
