'use client';

import { useState } from 'react';

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

  return (
    <>
      <div className="video-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div 
          className="video-thumbnail-container" 
          onClick={() => setIsModalOpen(true)}
        >
          {video.thumbnail_url ? (
            <img 
              src={video.thumbnail_url} 
              alt={video.title} 
              className="video-thumbnail-element"
            />
          ) : (
            <video 
              src={video.video_url} 
              className="video-thumbnail-element"
              preload="metadata"
              muted
            />
          )}
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

      {isModalOpen && (
        <div className="video-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
            &times;
          </button>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <video 
              src={video.video_url} 
              className="video-modal-element"
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </>
  );
}
