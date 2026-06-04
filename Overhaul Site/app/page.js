import Link from 'next/link';
import ProtectedImage from './components/ProtectedImage';
import HeroBackground from './components/HeroBackground';
import { concerts } from './work/concerts/page';
import { portraits } from './work/portraits/page';

export default function Home() {
  const recentConcerts = concerts.slice(0, 7);
  const images = [...recentConcerts, ...portraits].map(item => ({
    src: item.cover,
    objectPosition: item.imgStyle?.objectPosition || 'center'
  }));

  return (
    <div>
      <section className="hero">
        <div className="hero-bg">
          <HeroBackground images={images} />
        </div>
        <div className="hero-content">
          <p className="hero-subtitle">Los Angeles / San Diego</p>
          <h1 className="hero-title">Ben Power Photography</h1>
          <p className="hero-description">
            Capturing the energy of live music, the beauty of portraiture, and the spontaneity of street photography.
          </p>
          <Link href="/work" className="hero-cta">
            View Portfolio 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      <section className="container">
        <div className="category-grid">
          <Link href="/work/concerts" className="category-card">
            <div className="category-card-image" style={{ width: '100%', height: '100%', position: 'relative' }}>
               <ProtectedImage src="/images/concerts/cover.jpg" alt="Concerts" fill />
            </div>
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <h2 className="category-card-title">Concerts</h2>
              <div className="category-card-count">20+ Shows</div>
            </div>
          </Link>
          
          <Link href="/work/portraits" className="category-card">
            <div className="category-card-image" style={{ width: '100%', height: '100%', position: 'relative' }}>
               <ProtectedImage src="/images/portraits/cover.jpg" alt="Portraits" fill />
            </div>
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <h2 className="category-card-title">Portraits</h2>
              <div className="category-card-count">6 Sessions</div>
            </div>
          </Link>
        </div>

        <div className="seo-content" style={{ marginTop: '8rem', padding: '2rem', background: 'var(--bg-secondary, transparent)', borderTop: '1px solid var(--border-color, #eaeaea)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Los Angeles & San Diego Concert, Event, and Portrait Photographer</h2>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: 'var(--text-secondary, #666)' }}>
            Welcome to Ben Power Photography. Specializing in high-energy live music photography, creative portraiture, and event coverage, I work closely with musicians, publicists, management teams, and private clients across Southern California. While based in San Diego, my lens is heavily focused on the vibrant Los Angeles music and entertainment industry.
          </p>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: 'var(--text-secondary, #666)' }}>
            <strong style={{ color: 'var(--text-primary, #333)' }}>Live Music & Concert Photography:</strong> Whether it's an intimate underground show in an LA dive bar or a massive festival stage, my goal is to capture the true, unfiltered energy of the performance. I provide artists and their management with strong visual assets that build their brand and connect with fans.
          </p>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: 'var(--text-secondary, #666)' }}>
            <strong style={{ color: 'var(--text-primary, #333)' }}>Portraits & Events:</strong> Beyond the stage, I offer creative portrait sessions built for musicians, models, and individuals looking for a distinct visual identity. From editorial band shoots to energetic party and event photography, I ensure every frame tells a great story. 
          </p>
          <p style={{ lineHeight: '1.6', color: 'var(--text-secondary, #666)' }}>
            Feel free to look around the portfolio to see my latest work. While I spend most of my time shooting in LA and San Diego, I'm always looking for an excuse to travel. If you've got an exciting project somewhere else in the world, just get me there and we'll create something amazing together.
          </p>
        </div>
      </section>
    </div>
  );
}
