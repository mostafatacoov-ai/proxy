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
    setIsMobile(window.innerWidth <= 768);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (videoRef.current) {
      // Start muted for guaranteed autoplay
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Browser blocked autoplay.", error);
        });
      }
    }

    // Fallback timer just in case video doesn't play or end event fails
    const timer = setTimeout(() => {
      finishLoading();
    }, 15000); // Increased to 15s so it relies on onEnded for normal playback

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // Don't render the video until we know if it's mobile or desktop to avoid loading the wrong video first
  if (!isMounted) {
    return <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}></div>;
  }

  return (
    <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}>
      <video 
        ref={videoRef}
        src={isMobile ? "/videos/Proxy%20Logo.mp4" : "/videos/intro.mp4"}
        playsInline 
        muted
        autoPlay
        onEnded={finishLoading}
        className="intro-video"
      />
    </div>
  );
}
