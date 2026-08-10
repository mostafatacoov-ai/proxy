import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eyyugpuagynqjdseltif.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eXVncHVhZ3lucWpkc2VsdGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzAwMzIsImV4cCI6MjA5OTAwNjAzMn0.7otkKh226W1R1MpoMWFdBN98u8vqROq3AP35swCA2q0'
);

async function run() {
  const { data, error } = await supabase
    .from('videos')
    .select('category, title, video_url, thumbnail_url, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }
  
  const categories = {};
  data.forEach(v => {
    if (!categories[v.category]) {
      categories[v.category] = v;
    }
  });

  console.log(JSON.stringify(categories, null, 2));
}

run();
