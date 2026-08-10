'use client';

import { useEffect, useRef, useState } from 'react';

interface Feature {
  title: string;
  desc: string;
}

interface AnimatedFeaturesGridProps {
  featuresTitle: string;
  features: Feature[];
}

export default function AnimatedFeaturesGrid({ featuresTitle, features }: AnimatedFeaturesGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ marginBottom: '4rem' }}>
      <h2 
        style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontWeight: 300 }} 
        className={isVisible ? 'feature-stagger-enter delay-0' : 'feature-hidden'}
      >
        {featuresTitle}
      </h2>
      <div className="bento-grid">
        {features.map((feature, i) => {
          // Dynamic class generation for staggered delays
          const delayClass = `delay-${(i % 5 + 1) * 100}`;
          
          // Pattern: Make certain indices span 2 columns for a Bento look
          // e.g. 0, 3, 4, 7... depending on total count
          const isWide = (i % 4 === 0) || (i % 4 === 3); 
          const bentoClass = isWide ? 'bento-wide' : 'bento-standard';

          return (
            <div 
              key={i} 
              className={`bento-card ${bentoClass} ${isVisible ? `feature-stagger-enter ${delayClass}` : 'feature-hidden'}`}
            >
              <div className="bento-glass">
                <h3 className="bento-title">{feature.title}</h3>
                <p className="bento-desc">{feature.desc}</p>
                <div className="bento-sheen"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
