import { getDictionary } from "@/getDictionary";

export default async function Work({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <div className="section-padding container animate-fade-in" style={{ marginTop: '100px' }}>
      <h1 className="section-title">{dict.work.title}</h1>
      <p className="lead-text">{dict.work.subtitle}</p>
      
      <div style={{ padding: '4rem', border: '1px dashed #333', textAlign: 'center', color: '#666' }}>
        <h2>Video Portfolio Grid</h2>
        <p>This is where you will add your videos.</p>
      </div>
    </div>
  );
}
