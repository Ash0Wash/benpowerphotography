'use client';

import { useState, useEffect } from 'react';
import ProtectedImage from './ProtectedImage';

const backgroundImages = [
  { src: "/images/concerts/panchiko/cover.jpg", objectPosition: 'center' },
  { src: "/images/concerts/maggie-lindemann/cover.webp", objectPosition: 'center' },
  { src: "/images/concerts/ari/cover.jpg", objectPosition: 'center' },
  { src: "/images/concerts/bibi-sogang/cover.webp", objectPosition: 'top' },
  { src: "/images/portraits/brooke/cover.jpg", objectPosition: 'center' },
  { src: "/images/portraits/kawai/cover.webp", objectPosition: 'center' },
  { src: "/images/street-photography/cover.jpg", objectPosition: 'center' }
];

export default function HeroBackground() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    // Pick a random index between 0 and backgroundImages.length - 1
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBgIndex(randomIndex);
  }, []);

  const bg = backgroundImages[bgIndex];

  return (
    <ProtectedImage 
      src={bg.src}
      alt="Hero background"
      fill
      priority
      imgStyle={{ objectPosition: bg.objectPosition }}
    />
  );
}
