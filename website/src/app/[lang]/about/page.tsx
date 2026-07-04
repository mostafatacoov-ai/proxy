import { getDictionary } from "@/getDictionary";

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <div className="section-padding container animate-fade-in" style={{ marginTop: '100px' }}>
      <h1 className="section-title">{dict.about.title}</h1>
      <p className="lead-text">{dict.about.description}</p>
      
      <div className="mission-vision mt-4">
        <div className="mv-box">
          <h3>{dict.about.missionTitle}</h3>
          <p>{dict.about.mission}</p>
        </div>
        <div className="mv-box">
          <h3>{dict.about.visionTitle}</h3>
          <p>{dict.about.vision}</p>
        </div>
      </div>
    </div>
  );
}
