export function getValidBackgroundVideo(url?: string | null): string {
  const defaultVideo = "/videos/final_V5_G.mp4";
  if (!url) return defaultVideo;
  
  // HTML5 <video> cannot play YouTube or Vimeo links directly.
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
    return defaultVideo;
  }
  
  return url;
}
