import Link from 'next/link';
import ProtectedImage from './components/ProtectedImage';
import HeroBackground from './components/HeroBackground';

const clientRoster = [
  'Cage the Elephant',
  'Wet Leg',
  'Ken Carson',
  'Isabel LaRosa',
  'Bladee',
  'Thee Sacred Souls',
  'Rainbow Kitten Surprise',
  'X Ambassadors',
  'Maggie Lindemann',
  'Hinds',
  'Panchiko',
  'Turnover',
  'Underscores',
  'Snow Strippers',
  'glaive',
  'Tiffany Day',
  'Malcolm Todd',
];

const heroImages = [
  // Live Stage & Concert Performance (Landscape Framing - No Crop Issues)
  { src: '/images/hero/hero-ken-carson-1.webp', objectPosition: 'center 35%' },
  { src: '/images/hero/hero-ken-carson-2.webp', objectPosition: 'center 35%' },
  { src: '/images/hero/hero-ken-carson-3.webp', objectPosition: 'center 40%' },
  { src: '/images/hero/press-isabel-larosa-12.webp', objectPosition: 'center' },
  { src: '/images/hero/hero-glaive-1.webp', objectPosition: 'center' },
  { src: '/images/hero/hero-tiffany-1.webp', objectPosition: 'center' },
  { src: '/images/hero/press-tiffany-day-13.webp', objectPosition: 'center' },
  { src: '/images/hero/hero-thee-sacred-souls.webp', objectPosition: 'center 40%' },
  { src: '/images/hero/hero-rks.webp', objectPosition: 'center' },
  { src: '/images/hero/hero-yena.webp', objectPosition: 'center 40%' },
  { src: '/images/hero/press-yena-13.webp', objectPosition: 'center 40%' },
  { src: '/images/hero/press-bladee-13.webp', objectPosition: 'center' },
  { src: '/images/hero/press-cte-landscape.webp', objectPosition: 'center 35%' },
  { src: '/images/hero/press-wetleg-landscape.webp', objectPosition: 'center 35%' },
  { src: '/images/hero/press-xambassadors-03.webp', objectPosition: 'center' },
  { src: '/images/hero/press-maggie-lindemann-02.webp', objectPosition: 'center' },
  { src: '/images/hero/press-maggie-lindemann-21.webp', objectPosition: 'center' },
  { src: '/images/hero/press-snowstrippers-27.webp', objectPosition: 'center' },
  { src: '/images/hero/press-skatingp-10.webp', objectPosition: 'center' },
  { src: '/images/hero/press-concerts-01.webp', objectPosition: 'center' },

  // Kawai Artist Portraits (Preserved per User Request with Tuned Vertical Anchor)
  { src: '/images/hero/press-kawai-01.webp', objectPosition: 'center 20%' },
  { src: '/images/hero/press-kawai-13.webp', objectPosition: 'center 20%' },
  { src: '/images/hero/press-kawai-19.webp', objectPosition: 'center 25%' },
  { src: '/images/hero/press-kawai-21.webp', objectPosition: 'center 20%' },
];

export const dynamic = 'force-dynamic';

export default function Home() {
  // eslint-disable-next-line react-hooks/purity
  const randomIndex = Math.floor(Math.random() * heroImages.length);
  const randomHero = heroImages[randomIndex];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <HeroBackground hero={randomHero} />
        </div>
        <div className="hero-content">
          <p className="hero-subtitle">Los Angeles · San Diego · Worldwide</p>
          <h1 className="hero-title">Ben Power</h1>
          <p className="hero-description">
            Live music concert photography, tour visual packages, and band press portraits across Southern California. Hand-editing every frame from the pit to backstage.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link href="/services" className="hero-cta" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
              Tour Packages & Rates
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/work" className="hero-cta">
              View Work
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Credibility Bar */}
      <section className="editorial-credits-bar">
        <div className="container">
          <div className="editorial-credits-inner">
            <div className="credits-publication">
              <span className="credits-role">Lead Photographer &amp; Co-Owner</span>
              <a
                href="https://notonstage.com"
                target="_blank"
                rel="noopener noreferrer"
                className="credits-pub-link"
              >
                Not On Stage ↗
              </a>
              <span className="credits-detail">970+ published concert galleries</span>
            </div>

            <div className="credits-divider"></div>

            <div className="credits-roster">
              <span className="credits-label">Selected Live Coverage:</span>
              <p className="credits-artists">
                {clientRoster.join(' · ')}
              </p>
            </div>

            <a
              href="https://notonstage.com/coverage"
              target="_blank"
              rel="noopener noreferrer"
              className="credits-archive-btn"
            >
              Full Archive on Not On Stage ↗
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio Categories */}
      <section className="container" style={{ padding: '2rem 0 4rem' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem' }}>
          <div>
            <p className="hero-subtitle" style={{ marginBottom: '0.25rem' }}>Portfolio</p>
            <h2 style={{ margin: 0 }}>Galleries</h2>
          </div>
          <Link href="/work" style={{ color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            All Work →
          </Link>
        </div>

        <div className="category-grid">
          <Link href="/work/concerts" className="category-card">
            <div className="category-card-image" style={{ width: '100%', height: '100%', position: 'relative' }}>
               <ProtectedImage src="/images/concerts/cover.jpg" alt="Concerts by Ben Power" fill />
            </div>
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <h2 className="category-card-title">Live Music</h2>
              <div className="category-card-count">25+ Featured Shows</div>
            </div>
          </Link>
          
          <Link href="/work/portraits" className="category-card">
            <div className="category-card-image" style={{ width: '100%', height: '100%', position: 'relative' }}>
               <ProtectedImage src="/images/portraits/cover.jpg" alt="Portraits by Ben Power" fill />
            </div>
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <h2 className="category-card-title">Portraits &amp; EPK</h2>
              <div className="category-card-count">Artist Sessions</div>
            </div>
          </Link>
        </div>

        {/* Minimalist Editorial Service Hook */}
        <div className="editorial-tour-hook">
          <div className="editorial-tour-text">
            <span className="credits-role">Tour Stops &amp; Festivals</span>
            <h3>Next-Morning Selects Delivered by 8:00 AM</h3>
            <p>
              Tour recaps have to move fast. Get 10 custom color-graded hero selects in your management inbox the morning after your show for instant social recap rollouts, with the full high-res performance gallery within 48 hours. Full commercial promotional buyout rights included.
            </p>
          </div>
          <div className="editorial-tour-actions">
            <Link href="/services" className="hero-cta" style={{ background: 'var(--accent)', color: 'var(--bg-primary)', margin: 0 }}>
              View Tour Packages ($650 – $900)
            </Link>
            <Link href="/contact" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
              Check Date Availability →
            </Link>
          </div>
        </div>

        {/* Clean, Non-AI Understated Local SEO Statement */}
        <div style={{ marginTop: '5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.7' }}>
          <p style={{ maxWidth: '600px', margin: 0 }}>
            Based between Los Angeles and San Diego, specializing in live concert coverage, tour stop packages, and creative band press portraiture across Southern California venues and festivals. Available worldwide for multi-city tour routing.
          </p>
          <p style={{ margin: 0 }}>
            Inquiries: <a href="mailto:contact@benpowerphotography.com" style={{ color: 'var(--text-secondary)' }}>contact@benpowerphotography.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}
