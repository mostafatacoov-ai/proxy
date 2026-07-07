'use client';

import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Proxy Post Production',
  'Proxy Production',
  'Proxy Advertising',
  'Proxy Exclusive',
  'Proxy Studio'
];

type Video = {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url: string;
  created_at: string;
};

export default function AdminPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload State
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [uploading, setUploading] = useState(false);
  
  // Edit State
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (e) {
      console.error('Failed to fetch videos', e);
    } finally {
      setLoading(false);
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category) return;
    
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/videos', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setUploadProgress(0);
      
      if (xhr.status >= 200 && xhr.status < 300) {
        setTitle('');
        setDescription('');
        setFile(null);
        (document.getElementById('videoFile') as HTMLInputElement).value = '';
        fetchVideos();
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          console.error('Upload failed details:', errData);
          alert(`Upload failed: ${errData.error || 'Unknown error'}`);
        } catch {
          alert('Upload failed');
        }
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setUploadProgress(0);
      alert('Upload failed due to a network error');
    };

    xhr.send(formData);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchVideos();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete');
    }
  };

  const startEditing = (v: Video) => {
    setEditingVideo(v);
    setEditTitle(v.title);
    setEditDescription(v.description);
    setEditCategory(v.category);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    
    try {
      const res = await fetch(`/api/videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          category: editCategory
        })
      });

      if (res.ok) {
        setEditingVideo(null);
        fetchVideos();
      } else {
        alert('Update failed');
      }
    } catch (e) {
      console.error(e);
      alert('Update failed');
    }
  };

  return (
    <div className="container" style={{ marginTop: '120px', paddingBottom: '100px' }}>
      <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Admin Dashboard</h1>

      {/* Upload Section */}
      <div style={{ background: '#111', padding: '2rem', borderRadius: '8px', marginBottom: '3rem', border: '1px solid #333' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Upload New Video</h2>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Video File</label>
            <input 
              id="videoFile"
              type="file" 
              accept="video/*" 
              onChange={e => setFile(e.target.files?.[0] || null)} 
              required
              style={{ color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={4}
              style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Category</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {uploading && uploadProgress > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${uploadProgress}%`, 
                    height: '100%', 
                    background: '#fff', 
                    transition: 'width 0.2s ease' 
                  }} 
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={uploading}
            style={{ 
              marginTop: '1rem', 
              padding: '1rem 2rem', 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              borderRadius: '4px',
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>

      {/* Videos List Section */}
      <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Manage Videos</h2>
      {loading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <p style={{ color: '#666' }}>No videos uploaded yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {videos.map(video => (
            <div key={video.id} style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
              <video src={video.video_url} controls style={{ width: '100%', height: '200px', objectFit: 'cover', background: '#000' }} />
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{video.category}</div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{video.title}</h3>
                <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {video.description}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => startEditing(video)}
                    style={{ flex: 1, padding: '0.5rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(video.id)}
                    style={{ flex: 1, padding: '0.5rem', background: '#800000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingVideo && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 
        }}>
          <div style={{ background: '#111', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px', border: '1px solid #333' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Edit Video</h2>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Title</label>
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={e => setEditTitle(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Description</label>
                <textarea 
                  value={editDescription} 
                  onChange={e => setEditDescription(e.target.value)} 
                  rows={4}
                  style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Category</label>
                <select 
                  value={editCategory} 
                  onChange={e => setEditCategory(e.target.value)} 
                  style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '1rem', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingVideo(null)}
                  style={{ flex: 1, padding: '1rem', background: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
