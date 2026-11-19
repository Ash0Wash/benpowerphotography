import ProtectedImage from './ProtectedImage';

export default function HeroBackground({ hero }) {
  if (!hero) {
    return <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--bg-primary)' }} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', animation: 'fadeIn 0.6s ease-in' }}>
      <ProtectedImage 
        src={hero.src}
        alt="Hero background"
        fill
        priority
        quality={90}
        sizes="100vw"
        imgStyle={{ objectPosition: hero.objectPosition }}
      />
    </div>
  );
}
