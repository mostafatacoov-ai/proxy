import { getDictionary } from "@/getDictionary";

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <div className="section-padding container animate-fade-in" style={{ marginTop: '100px' }}>
      <h1 className="section-title">{dict.services.title}</h1>
      <p className="lead-text">{dict.services.subtitle}</p>
      
      <div className="service-details mt-4">
        {dict.services.items.map((item: any, i: number) => (
          <div key={i} className="service-item">
            <div className="service-number">{item.num}</div>
            <div className="service-content-block">
              <h3>{item.title}</h3>
              <h4>{item.subtitle}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
