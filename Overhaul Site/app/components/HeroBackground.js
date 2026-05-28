'use client';

import { useState, useEffect } from 'react';
import ProtectedImage from './ProtectedImage';

export default function HeroBackground({ images }) {
  const [bg, setBg] = useState(null);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const randomIndex = Math.floor(Math.random() * images.length);
    setBg(images[randomIndex]);
  }, [images]);

  if (!bg) {
    return <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--bg-primary)' }} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', animation: 'fadeIn 0.6s ease-in' }}>
      <ProtectedImage 
        src={bg.src}
        alt="Hero background"
        fill
        priority
        imgStyle={{ objectPosition: bg.objectPosition }}
      />
    </div>
  );
}
