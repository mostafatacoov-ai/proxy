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
  thumbnail_url?: string;
  created_at: string;
};

export default function AdminPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload State
  const [file, setFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailData, setThumbnailData] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string[]>([CATEGORIES[0]]);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Edit State
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<string[]>([]);
  const [editThumbnailData, setEditThumbnailData] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState('');

  // Reorder State
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Drag and Drop State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

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

  const captureThumbnail = (videoElementId: string, setThumbnailState: (data: string) => void) => {
    const video = document.getElementById(videoElementId) as HTMLVideoElement;
    if (!video) return;

    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 1280;
    let width = video.videoWidth;
    let height = video.videoHeight;
    
    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      setThumbnailState(dataUrl);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || category.length === 0) {
      alert("Please provide a file, title, and at least one category.");
      return;
    }
    
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
        formData.append('category', category.join(','));
        if (thumbnailData) {
          formData.append('thumbnail', thumbnailData);
        }

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
      setCategory([CATEGORIES[0]]);
      setFile(null);
      setVideoPreviewUrl(null);
      setThumbnailData(null);
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
    setEditCategory(v.category ? v.category.split(',') : []);
    setEditThumbnailData(null);
    setEditSuccessMessage('');
    setSavingEdit(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    
    setSavingEdit(true);
    setEditSuccessMessage('');
    
    try {
      const res = await fetch(`/api/videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          category: editCategory.join(','),
          thumbnail: editThumbnailData
        })
      });

      if (res.ok) {
        setEditSuccessMessage('Video updated successfully!');
        fetchVideos();
        // Close modal after showing success message briefly
        setTimeout(() => {
          setEditingVideo(null);
          setSavingEdit(false);
          setEditSuccessMessage('');
        }, 1500);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Update failed: ${errData.error || 'Unknown error'}`);
        setSavingEdit(false);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Update failed: ${e.message || 'Unknown error'}`);
      setSavingEdit(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDrop = (index: number) => {
    if (draggedItemIndex === null) return;
    if (draggedItemIndex !== index) {
      const newVideos = [...videos];
      const draggedItem = newVideos[draggedItemIndex];
      newVideos.splice(draggedItemIndex, 1);
      newVideos.splice(index, 0, draggedItem);
      setVideos(newVideos);
      setHasUnsavedOrder(true);
    }
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
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
              onChange={e => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                if (f) {
                  setVideoPreviewUrl(URL.createObjectURL(f));
                } else {
                  setVideoPreviewUrl(null);
                  setThumbnailData(null);
                }
              }} 
              required
              style={{ color: '#fff' }}
            />
          </div>

          {videoPreviewUrl && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Video Preview & Thumbnail Capture</label>
              <video 
                id="uploadVideoPreview"
                src={videoPreviewUrl} 
                controls 
                style={{ width: '100%', maxHeight: '300px', background: '#000', borderRadius: '4px', marginBottom: '0.5rem' }} 
              />
              <button
                type="button"
                onClick={() => captureThumbnail('uploadVideoPreview', setThumbnailData)}
                style={{ padding: '0.5rem 1rem', background: '#444', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                📸 Capture Frame as Thumbnail
              </button>
              {thumbnailData && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Captured Thumbnail</label>
                  <img src={thumbnailData} alt="Captured thumbnail" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', background: '#000', borderRadius: '4px', border: '1px solid #333' }} />
                </div>
              )}
            </div>
          )}

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
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Categories</label>
            <div className="category-grid">
              {CATEGORIES.map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={category.includes(c)}
                    onChange={e => {
                      if (e.target.checked) {
                        setCategory([...category, c]);
                      } else {
                        setCategory(category.filter(cat => cat !== c));
                      }
                    }}
                  />
                  <span style={{ fontSize: '0.9rem' }}>{c}</span>
                </label>
              ))}
            </div>
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
        <div className="video-grid">
          {videos.map((video, index) => (
            <div 
              key={video.id} 
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              style={{ 
                background: '#111', 
                border: dragOverItemIndex === index ? '2px dashed #28a745' : '1px solid #333', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                position: 'relative',
                opacity: draggedItemIndex === index ? 0.5 : 1,
                cursor: 'grab',
                transform: dragOverItemIndex === index ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              {video.thumbnail_url ? (
                <div style={{ position: 'relative', width: '100%', height: '200px', background: '#000' }}>
                  <img src={video.thumbnail_url} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                </div>
              ) : (
                <video src={video.video_url} preload="none" controls style={{ width: '100%', height: '200px', objectFit: 'cover', background: '#000' }} />
              )}
              
              {/* Drag Handle Icon */}
              <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.6)', padding: '0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Categories</label>
                <div className="category-grid">
                  {CATEGORIES.map(c => (
                    <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={editCategory.includes(c)}
                        onChange={e => {
                          if (e.target.checked) {
                            setEditCategory([...editCategory, c]);
                          } else {
                            setEditCategory(editCategory.filter(cat => cat !== c));
                          }
                        }}
                      />
                      <span style={{ fontSize: '0.9rem' }}>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Video Preview & Thumbnail Update</label>
                <video 
                  id="editVideoPreview"
                  src={editingVideo.video_url} 
                  poster={editingVideo.thumbnail_url || undefined}
                  controls 
                  style={{ width: '100%', maxHeight: '300px', background: '#000', borderRadius: '4px', marginBottom: '0.5rem' }} 
                />
                <button
                  type="button"
                  onClick={() => captureThumbnail('editVideoPreview', setEditThumbnailData)}
                  style={{ padding: '0.5rem 1rem', background: '#444', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  📸 Capture Frame as New Thumbnail
                </button>
                {(editThumbnailData || editingVideo.thumbnail_url) && (
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Current Thumbnail</label>
                    <img src={editThumbnailData || editingVideo.thumbnail_url} alt="Current thumbnail" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', background: '#000', borderRadius: '4px', border: '1px solid #333' }} />
                  </div>
                )}
              </div>

              {editSuccessMessage && (
                <div style={{ padding: '1rem', background: 'rgba(40, 167, 69, 0.2)', color: '#4ade80', border: '1px solid #28a745', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                  {editSuccessMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={savingEdit}
                  style={{ flex: 1, padding: '1rem', background: '#fff', color: '#000', border: 'none', cursor: savingEdit ? 'not-allowed' : 'pointer', fontWeight: 'bold', borderRadius: '4px', opacity: savingEdit ? 0.7 : 1 }}
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  disabled={savingEdit}
                  onClick={() => setEditingVideo(null)}
                  style={{ flex: 1, padding: '1rem', background: '#333', color: '#fff', border: 'none', cursor: savingEdit ? 'not-allowed' : 'pointer', fontWeight: 'bold', borderRadius: '4px', opacity: savingEdit ? 0.7 : 1 }}
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
