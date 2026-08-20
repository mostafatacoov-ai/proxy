'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plyr, APITypes } from 'plyr-react';
import 'plyr-react/plyr.css';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    description: string;
    category: string;
    video_url: string;
    thumbnail_url?: string;
  };
  showDetails?: boolean;
}

// ─── Embed helpers ────────────────────────────────────────────────────────────

/** Returns true when the stored URL is an iframe embed (YouTube / Vimeo / etc.) */
function isEmbedVideo(url: string): boolean {
  return url.startsWith('embed:');
}

/** Strips the "embed:" prefix to get the raw iframe src. */
function getEmbedSrc(url: string): string {
  return url.slice(6); // remove "embed:"
}

/** Extracts a YouTube video ID from an embed URL like https://www.youtube.com/embed/VIDEO_ID */
function getYouTubeId(embedSrc: string): string | null {
  const match = embedSrc.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function VideoCard({ video, showDetails = true }: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const plyrRef = useRef<APITypes>(null);

  const isEmbed = isEmbedVideo(video.video_url);
  const embedSrc = isEmbed ? getEmbedSrc(video.video_url) : null;

  // Auto-derive YouTube thumbnail when none was set by the admin
  const autoThumbnailUrl = (() => {
    if (!isEmbed || video.thumbnail_url || !embedSrc) return null;
    const ytId = getYouTubeId(embedSrc);
    return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
  })();

  const effectiveThumbnailUrl = video.thumbnail_url || autoThumbnailUrl;

  // Add ?autoplay=1&mute=1 to embed src when opening the modal
  const embedSrcAutoplay = embedSrc
    ? embedSrc.includes('?')
      ? `${embedSrc}&autoplay=1`
      : `${embedSrc}?autoplay=1`
    : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    window.history.pushState({ videoModal: true }, '');
  };

  const closeModal = (fromPopState: boolean | any = false) => {
    const isPop = fromPopState === true;
    setIsModalOpen(false);
    document.body.style.overflow = '';
    // Pause Plyr only for file-based videos
    if (!isEmbed && plyrRef.current?.plyr) {
      plyrRef.current.plyr.pause();
    }
    if (!isPop && window.history.state?.videoModal) {
      window.history.back();
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const shareUrl = isEmbed && embedSrc ? embedSrc : video.video_url;
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description || `Check out this video: ${video.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isModalOpen) {
        closeModal(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  // Auto-play when modal opens (file-based videos only — embeds handle their own autoplay via URL param)
  useEffect(() => {
    if (isModalOpen && !isEmbed && plyrRef.current?.plyr) {
      setTimeout(() => {
        plyrRef.current?.plyr?.play();
      }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const modal = isModalOpen && mounted
    ? createPortal(
        <div
          className="video-modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
        >
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button 
              onClick={handleShare}
              aria-label="Share video"
              title="Share video"
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '40px',
                height: '40px',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
            <button className="close-modal-btn" onClick={closeModal} aria-label="Close video">
              &times;
            </button>
            <div className="video-modal-element" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isEmbed && embedSrc ? (
                /* ── YouTube / Vimeo iframe player ── */
                <div style={{ position: 'relative', width: '100%', maxWidth: '100%', aspectRatio: '16/9' }}>
                  <iframe
                    src={embedSrcAutoplay || embedSrc}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block', borderRadius: '4px' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    title={video.title}
                  />
                </div>
              ) : (
                /* ── File-based Plyr player ── */
                <Plyr
                  ref={plyrRef}
                  source={{
                    type: 'video',
                    sources: [
                      {
                        src: video.video_url,
                        provider: video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be') ? 'youtube' : video.video_url.includes('vimeo.com') ? 'vimeo' : 'html5',
                      },
                    ],
                  }}
                  options={{
                    autoplay: true,
                    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
                    settings: ['captions', 'quality', 'speed', 'loop'],
                  }}
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div className="video-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div
          className="video-thumbnail-container"
          onClick={openModal}
          role="button"
          tabIndex={0}
          aria-label={`Play ${video.title}`}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openModal(); }}
        >
          {/* Show static thumbnail image or a lightweight placeholder */}
          {effectiveThumbnailUrl ? (
            <img
              src={effectiveThumbnailUrl}
              alt={video.title}
              className="video-thumbnail-element"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="video-thumbnail-element" style={{ 
              background: 'linear-gradient(45deg, #1a1a1a, #0a0a0a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333'
            }}>
              {/* YouTube logo placeholder for embed videos without a thumbnail */}
              {isEmbed ? (
                <svg width="60" height="42" viewBox="0 0 60 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="42" rx="8" fill="#FF0000" fillOpacity="0.15"/>
                  <path d="M58.76 6.57C58.09 4.12 56.17 2.18 53.74 1.5C49.02 0.17 30 0.17 30 0.17C30 0.17 10.98 0.17 6.26 1.5C3.83 2.18 1.91 4.12 1.24 6.57C-0.08 11.33 -0.08 21.23 -0.08 21.23C-0.08 21.23 -0.08 31.13 1.24 35.89C1.91 38.34 3.83 40.28 6.26 40.96C10.98 42.29 30 42.29 30 42.29C30 42.29 49.02 42.29 53.74 40.96C56.17 40.28 58.09 38.34 58.76 35.89C60.08 31.13 60.08 21.23 60.08 21.23C60.08 21.23 60.08 11.33 58.76 6.57Z" fill="#FF0000" fillOpacity="0.4"/>
                  <path d="M24 30L39.45 21.23L24 12.46V30Z" fill="white" fillOpacity="0.5"/>
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <line x1="7" y1="2" x2="7" y2="22"></line>
                  <line x1="17" y1="2" x2="17" y2="22"></line>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <line x1="2" y1="7" x2="7" y2="7"></line>
                  <line x1="2" y1="17" x2="7" y2="17"></line>
                  <line x1="17" y1="17" x2="22" y2="17"></line>
                  <line x1="17" y1="7" x2="22" y2="7"></line>
                </svg>
              )}
            </div>
          )}

          {/* Play button overlay – always visible */}
          <div className="play-button-overlay">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>

        {showDetails && (
          <div style={{ marginTop: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                background: '#222',
                color: '#aaa',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderRadius: '4px',
              }}>
                {video.category}
              </span>
              <button 
                onClick={handleShare}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#aaa',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.2rem',
                  transition: 'color 0.2s',
                }}
                aria-label="Share video"
                title="Share video"
                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                onMouseOut={(e) => e.currentTarget.style.color = '#aaa'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#fff' }}>{video.title}</h3>
            {video.description && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {video.description}
              </p>
            )}
          </div>
        )}
      </div>

      {modal}
    </>
  );
}
