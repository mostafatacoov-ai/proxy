'use client';

import { useState } from 'react';

const SERVICES = [
  'Proxy Post Production',
  'Proxy Production',
  'Proxy Advertising',
  'Proxy Exclusive',
  'Proxy Studio',
  'General Inquiry',
];

interface ContactClientProps {
  dict: Record<string, any>;
  lang: string;
}

export default function ContactClient({ dict, lang }: ContactClientProps) {
  const [formData, setFormData] = useState({ name: '', email: '', scope: SERVICES[5], message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', scope: SERVICES[5], message: '' });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.9rem 1rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    borderRadius: '6px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.95rem',
    transition: 'border-color 0.2s, background 0.2s',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {dict.contact.form.name}
          </label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Your full name'}
            onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
          />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {dict.contact.form.email}
          </label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            placeholder="you@example.com"
            onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
          />
        </div>
      </div>

      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {dict.contact.form.scope}
        </label>
        <select
          name="scope"
          value={formData.scope}
          onChange={handleChange}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
        >
          {SERVICES.map(s => <option key={s} value={s} style={{ background: '#111', color: '#fff' }}>{s}</option>)}
        </select>
      </div>

      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {lang === 'ar' ? 'الرسالة' : 'Message'}
        </label>
        <textarea
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }}
          placeholder={lang === 'ar' ? 'أخبرنا عن مشروعك...' : 'Tell us about your project...'}
          onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
        />
      </div>

      {status === 'success' && (
        <div style={{ padding: '1rem', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '6px', color: '#4ade80', textAlign: 'center' }}>
          ✓ {lang === 'ar' ? 'تم إرسال رسالتك بنجاح! سنرد عليك قريباً.' : 'Message sent! We\'ll get back to you soon.'}
        </div>
      )}
      {status === 'error' && (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', textAlign: 'center' }}>
          ⚠ {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          padding: '1rem 2rem',
          background: status === 'sending' ? 'rgba(255,255,255,0.5)' : '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 700,
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          width: '100%',
        }}
        onMouseOver={e => { if (status !== 'sending') (e.currentTarget as HTMLButtonElement).style.background = '#e5e5e5'; }}
        onMouseOut={e => { if (status !== 'sending') (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
      >
        {status === 'sending'
          ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...')
          : dict.contact.form.submit}
      </button>
    </form>
  );
}
