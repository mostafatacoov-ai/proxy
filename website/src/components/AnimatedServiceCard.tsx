'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface AnimatedServiceCardProps {
  href: string;
  title: string;
  desc: string;
  ctaText: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export default function AnimatedServiceCard({ href, title, desc, ctaText, videoUrl, thumbnailUrl }: AnimatedServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Autoplay prevented:", e));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <div 
        className={`animated-service-card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Media */}
        <div className="card-bg-media">
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              className={`card-bg-video ${isHovered ? 'visible' : ''}`}
            />
          )}
          {/* Fallback/Thumbnail layer */}
          <div 
            className={`card-bg-image ${!isHovered && thumbnailUrl ? 'visible' : ''}`}
            style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : {}}
          />
          {/* Gradient Overlay for text readability */}
          <div className="card-gradient-overlay" />
        </div>

        {/* Content */}
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-desc">{desc}</p>
          <div className="card-cta-wrapper">
            <div className={`card-cta ${isHovered ? 'cta-active' : ''}`}>
              <span className="card-cta-text">{ctaText}</span>
              <div className="cta-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
