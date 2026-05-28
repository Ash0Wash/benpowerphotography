import Link from 'next/link';
import ProtectedImage from './components/ProtectedImage';
import HeroBackground from './components/HeroBackground';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-bg">
          <HeroBackground />
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
      </section>
    </div>
  );
}
