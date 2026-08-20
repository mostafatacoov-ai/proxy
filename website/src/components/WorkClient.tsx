'use client';

import { useState, useMemo, useEffect } from 'react';
import VideoCard from '@/components/VideoCard';

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url: string;
  thumbnail_url?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'All': 'All',
  'Proxy Post Production': 'Post Production',
  'Proxy Production': 'Production',
  'Proxy Advertising': 'Advertising',
  'Proxy Exclusive': 'Exclusive',
  'Proxy Studio': 'Studio',
};

interface WorkClientProps {
  videos: Video[];
  emptyTitle: string;
  emptySubtitle: string;
}

export default function WorkClient({ videos, emptyTitle, emptySubtitle }: WorkClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [revealKey, setRevealKey] = useState(0);

  // Determine which category pills to show (only ones that have at least 1 video)
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    videos.forEach(v => {
      if (v.category) {
        v.category.split(',').forEach(c => {
          const trimmed = c.trim();
          if (CATEGORY_LABELS[trimmed]) cats.add(trimmed);
        });
      }
    });
    return Array.from(cats).sort((a, b) => {
      const order = Object.keys(CATEGORY_LABELS);
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [videos]);

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: videos.length };
    availableCategories.forEach(cat => {
      counts[cat] = videos.filter(v =>
        v.category && v.category.split(',').map(c => c.trim()).includes(cat)
      ).length;
    });
    return counts;
  }, [videos, availableCategories]);

  // Filtered + searched videos
  const filtered = useMemo(() => {
    let result = videos;
    if (activeCategory !== 'All') {
      result = result.filter(v =>
        v.category && v.category.split(',').map(c => c.trim()).includes(activeCategory)
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(v =>
        v.title?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [videos, activeCategory, search]);

  // Re-trigger card reveal animation on filter change
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setRevealKey(k => k + 1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setRevealKey(k => k + 1);
  };

  if (videos.length === 0) {
    return (
      <div style={{ padding: '4rem', border: '1px dashed #333', textAlign: 'center', color: '#666', marginTop: '2rem', borderRadius: '8px' }}>
        <h2 style={{ color: '#444', marginBottom: '0.5rem' }}>{emptyTitle}</h2>
        <p>{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Filter Bar ── */}
      <div className="work-filter-bar">
        <div className="container">
          <div className="work-filter-inner">
            {/* Search */}
            <div className="work-search-wrapper">
              <svg className="work-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="search"
                className="work-search"
                placeholder="Search videos..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                aria-label="Search videos"
              />
            </div>

            {/* Category pills */}
            <div className="work-filter-pills" role="group" aria-label="Filter by category">
              <button
                className={`filter-pill ${activeCategory === 'All' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('All')}
                aria-pressed={activeCategory === 'All'}
              >
                All
                <span className="filter-pill-count">{categoryCounts['All']}</span>
              </button>
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                  aria-pressed={activeCategory === cat}
                >
                  {CATEGORY_LABELS[cat] || cat}
                  <span className="filter-pill-count">{categoryCounts[cat]}</span>
                </button>
              ))}
            </div>

            {/* Results count */}
            <span className="work-results-count">
              {filtered.length} {filtered.length === 1 ? 'video' : 'videos'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#555', border: '1px dashed #2a2a2a', borderRadius: '8px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: '1rem' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p style={{ marginTop: '0.5rem' }}>No videos match your search.</p>
        </div>
      ) : (
        <div className="video-grid" key={revealKey}>
          {filtered.map((video, i) => (
            <div
              key={video.id}
              className="video-card-reveal"
              style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
            >
              <VideoCard video={video} showDetails={true} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
