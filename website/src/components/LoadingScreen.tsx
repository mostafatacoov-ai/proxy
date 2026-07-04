"use client";

import { useState, useRef, useEffect } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const finishLoading = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 800); // 800ms for fade out transition
  };

  useEffect(() => {
    // Attempt to play with sound
    if (videoRef.current) {
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Browser blocked autoplay with sound. Falling back to muted autoplay.", error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(e => console.error("Autoplay completely failed.", e));
          }
        });
      }
    }

    // Fallback timer just in case video doesn't play or end event fails
    const timer = setTimeout(() => {
      finishLoading();
    }, 6000); // Intro video is usually 4-5 seconds

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}>
      <video 
        ref={videoRef}
        src="/videos/intro.mp4" 
        playsInline 
        onEnded={finishLoading}
        className="intro-video"
      />
    </div>
  );
}
