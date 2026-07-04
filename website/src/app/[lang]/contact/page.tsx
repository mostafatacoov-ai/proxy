import { getDictionary } from "@/getDictionary";

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <div className="section-padding container animate-fade-in" style={{ marginTop: '100px' }}>
      <h1 className="section-title">{dict.contact.title}</h1>
      <p className="lead-text">{dict.contact.subtitle}</p>
      
      <div className="contact-grid mt-4">
        <div className="contact-details">
          <p><strong>{dict.contact.emailLabel}</strong> hello@proxy-post.com</p>
          <p><strong>{dict.contact.phoneLabel}</strong> +1 (555) 123-4567</p>
          <p><strong>{dict.contact.locationLabel}</strong><br/>{dict.contact.locationText}</p>
        </div>
        <div className="contact-form-wrapper">
          <form className="contact-form">
            <div className="form-group">
              <label>{dict.contact.form.name}</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>{dict.contact.form.email}</label>
              <input type="email" required />
            </div>
            <div className="form-group">
              <label>{dict.contact.form.scope}</label>
              <select>
                {dict.contact.form.scopeOptions.map((opt: string, i: number) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-submit">{dict.contact.form.submit}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
