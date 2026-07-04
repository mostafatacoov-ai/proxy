"use client";

import { useState, useRef, useEffect } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fallback timer just in case video doesn't play or end event fails
    const timer = setTimeout(() => {
      finishLoading();
    }, 6000); // Intro video is usually 4-5 seconds

    return () => clearTimeout(timer);
  }, []);

  const finishLoading = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 800); // 800ms for fade out transition
  };

  return (
    <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}>
      <video 
        ref={videoRef}
        src="/videos/intro.mp4" 
        autoPlay 
        muted 
        playsInline 
        onEnded={finishLoading}
        className="intro-video"
      />
    </div>
  );
}
