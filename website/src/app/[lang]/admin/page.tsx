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
  const [successMessage, setSuccessMessage] = useState('');
  
  // Edit State
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Reorder State
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
        setHasUnsavedOrder(false);
      }
    } catch (e) {
      console.error('Failed to fetch videos', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category) return;
    
    setUploading(true);
    setUploadProgress(0);

    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uniqueFileId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    
    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('file', chunk, file.name);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('uniqueFileId', uniqueFileId);
        
        // Always pass metadata so it's available on the final chunk
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);

        const response = await fetch('/api/videos', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to upload chunk ${chunkIndex}`);
        }

        // Update progress
        const percentComplete = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        setUploadProgress(percentComplete);
      }

      // Success
      setTitle('');
      setDescription('');
      setFile(null);
      const fileInput = document.getElementById('videoFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      fetchVideos();
      setSuccessMessage('Upload completed successfully!');
      alert('Upload completed successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      console.error('Upload failed details:', error);
      alert(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
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

  const moveVideoUp = (index: number) => {
    if (index === 0) return;
    const newVideos = [...videos];
    const temp = newVideos[index];
    newVideos[index] = newVideos[index - 1];
    newVideos[index - 1] = temp;
    setVideos(newVideos);
    setHasUnsavedOrder(true);
  };

  const moveVideoDown = (index: number) => {
    if (index === videos.length - 1) return;
    const newVideos = [...videos];
    const temp = newVideos[index];
    newVideos[index] = newVideos[index + 1];
    newVideos[index + 1] = temp;
    setVideos(newVideos);
    setHasUnsavedOrder(true);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const videoIds = videos.map(v => v.id);
      const res = await fetch('/api/videos/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoIds })
      });

      if (res.ok) {
        alert('Order saved successfully!');
        setHasUnsavedOrder(false);
      } else {
        alert('Failed to save order');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save order');
    } finally {
      setSavingOrder(false);
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

          {uploading && (
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

          {successMessage && (
            <div style={{ padding: '1rem', background: 'rgba(40, 167, 69, 0.2)', color: '#4ade80', border: '1px solid #28a745', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
              {successMessage}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#fff' }}>Manage Videos</h2>
        {hasUnsavedOrder && (
          <button 
            onClick={handleSaveOrder} 
            disabled={savingOrder}
            style={{ 
              padding: '0.8rem 1.5rem', 
              background: '#28a745', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: savingOrder ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold',
              opacity: savingOrder ? 0.7 : 1
            }}
          >
            {savingOrder ? 'Saving...' : 'Save New Order'}
          </button>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <p style={{ color: '#666' }}>No videos uploaded yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {videos.map((video, index) => (
            <div key={video.id} style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
              <video src={video.video_url} controls style={{ width: '100%', height: '200px', objectFit: 'cover', background: '#000' }} />
              
              {/* Order Controls */}
              <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10 }}>
                <button 
                  onClick={() => moveVideoUp(index)} 
                  disabled={index === 0}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid #555', cursor: index === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: index === 0 ? 0.3 : 1 }}
                  title="Move Up"
                >
                  ↑
                </button>
                <button 
                  onClick={() => moveVideoDown(index)} 
                  disabled={index === videos.length - 1}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid #555', cursor: index === videos.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: index === videos.length - 1 ? 0.3 : 1 }}
                  title="Move Down"
                >
                  ↓
                </button>
              </div>
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
