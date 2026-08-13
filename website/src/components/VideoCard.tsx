'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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

export default function VideoCard({ video, showDetails = true }: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  // Auto-play when modal opens
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      modalVideoRef.current.play().catch(e => console.error('Modal play prevented:', e));
    }
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
            <button className="close-modal-btn" onClick={closeModal} aria-label="Close video">
              &times;
            </button>
            <video
              ref={modalVideoRef}
              src={video.video_url}
              className="video-modal-element"
              controls
              playsInline
              preload="auto"
            />
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
          {/* Show static thumbnail image or a muted metadata frame – no inline audio */}
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="video-thumbnail-element"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <video
              src={`${video.video_url}#t=0.5`}
              className="video-thumbnail-element"
              preload="metadata"
              muted
              playsInline
              style={{ objectFit: 'cover', pointerEvents: 'none' }}
            />
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
            <span style={{
              display: 'inline-block',
              padding: '0.2rem 0.6rem',
              background: '#222',
              color: '#aaa',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              alignSelf: 'flex-start'
            }}>
              {video.category}
            </span>
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
