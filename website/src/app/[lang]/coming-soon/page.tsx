import React from 'react';
import { getDictionary } from '@/getDictionary';

export default async function ComingSoon({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ar');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--background)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'var(--foreground)'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden'
      }}>
        {/* We can use the same video as hero if it exists, but a nice gradient or noise is safe */}
        <div style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(30,30,30,1) 0%, rgba(0,0,0,1) 100%)',
          opacity: 0.8
        }}></div>
      </div>
      
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        animation: 'fadeIn 1.5s ease-out forwards',
        opacity: 0,
        transform: 'translateY(20px)'
      }}>
        <h1 className="hero-headline" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          PROXY GROUP
        </h1>
        <h2 className="hero-subheadline" style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.2em' }}>
          COMING SOON
        </h2>
        <div style={{
          width: '50px',
          height: '2px',
          background: 'var(--foreground)',
          margin: '2rem auto'
        }}></div>
        <p style={{ color: 'var(--secondary)', maxWidth: '400px', margin: '0 auto' }}>
          {lang === 'ar' 
            ? 'نحن نعمل على شيء استثنائي. ترقبوا الإطلاق قريباً.' 
            : 'We are working on something extraordinary. Stay tuned for our launch.'}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}
