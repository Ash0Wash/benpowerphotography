import Link from 'next/link';

export const metadata = {
  title: 'Concert Photography Lightroom Preset Pack ($29) | Ben Power',
  description: 'Download the signature Ben Power Concert Photography Lightroom Presets. Engineered for harsh stage lighting, LED blowouts, and moody live music color grading.',
  alternates: {
    canonical: 'https://www.benpowerphotography.com/presets',
  },
  openGraph: {
    title: 'Concert Photography Lightroom Presets | Ben Power Photography',
    description: 'Master stage lighting with signature Lightroom presets created from 970+ concerts across Southern California venues.',
    url: 'https://www.benpowerphotography.com/presets',
  },
};

const presetsList = [
  {
    name: '01. Neon Pit Tamer',
    desc: 'Controls aggressive magenta, red, and blue LED stage wash without crushing skin tones.',
    tag: 'LED Fix',
  },
  {
    name: '02. Golden Hour Stage',
    desc: 'Warm, amber-drenched concert tone built for festival sunset slots and acoustic sets.',
    tag: 'Warm / Golden',
  },
  {
    name: '03. High-Contrast Monochrome',
    desc: 'Deep, punchy blacks with crisp highlights reminiscent of vintage rock journalism prints.',
    tag: 'B&W Contrast',
  },
  {
    name: '04. Cinematic Indie Film',
    desc: 'Subtle greens and muted warm highlights for moody underground venue aesthetics.',
    tag: 'Analog Vibe',
  },
  {
    name: '05. Arena Flash Pop',
    desc: 'Optimized for high-energy crowd interactions, stage jumps, and harsh spotlights.',
    tag: 'High Energy',
  },
  {
    name: '06. Clean Skin Rescue',
    desc: 'Specialized curve adjustment that pulls natural skin tones out from deep stage shadows.',
    tag: 'Portrait / Skin',
  },
];

export default function PresetsPage() {
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="preset-hero">
        <div className="preset-hero-content">
          <div className="service-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '1rem' }}>
            Lightroom Classic & Mobile Presets (.xmp + .dng)
          </div>
          <h1>The Concert Photography Lightroom Preset Pack</h1>
          <p className="preset-hero-sub">
            Engineered specifically to solve the hardest problems in live music photography: harsh colored LEDs, high-contrast spotlight blowouts, muddy shadows, and erratic stage lighting.
          </p>

          <div className="preset-price-block">
            <div className="preset-price-tag">
              <span className="preset-original-price">$49</span>
              <span className="preset-current-price">$29</span>
              <span className="preset-discount-badge">Instant Download</span>
            </div>
            <p className="preset-guarantee-note">Compatible with Lightroom Desktop (CC & Classic) and Lightroom Mobile (iOS & Android)</p>
          </div>

          <div className="preset-cta-wrap">
            {/* Ready for Lemon Squeezy or Stripe buy button embed */}
            <a
              href="mailto:contact@benpowerphotography.com?subject=Inquiry%3A%20Lightroom%20Preset%20Pack"
              className="cta-btn-primary"
              style={{ display: 'inline-flex', padding: '1rem 2.5rem', fontSize: '1rem' }}
              data-checkout="lemonsqueezy"
            >
              Get The Preset Pack — $29
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <span className="preset-instant-badge">⚡ Instant .zip download with step-by-step installation guide</span>
          </div>
        </div>

        <div className="preset-preview-card">
          <div className="preset-card-inner">
            <div className="preset-card-header">
              <span className="preset-badge-tag">Signature Collection</span>
              <h3>What&apos;s Included in the Pack:</h3>
            </div>
            <ul className="preset-included-list">
              <li>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="var(--accent)"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span><strong>6 Custom Developed Presets</strong> for concert & live music scenarios</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="var(--accent)"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span><strong>Desktop (.XMP) + Mobile (.DNG)</strong> versions for editing anywhere</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="var(--accent)"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span><strong>Concert Photography Cheatsheet</strong> with recommended ISO, shutter & aperture settings by venue size</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="var(--accent)"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span><strong>Step-by-step PDF & Video Installation Guide</strong> for Mac, Windows, iOS, and Android</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preset Breakdown Grid */}
      <section style={{ padding: 'var(--section-pad) 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>The Presets Inside The Pack</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Tested across hundreds of shows—from dark dive bars in LA to brightly lit arena festival stages.
        </p>

        <div className="presets-features-grid">
          {presetsList.map((p, i) => (
            <div key={i} className="preset-feature-card">
              <span className="preset-tag">{p.tag}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Behind the Presets / Credentials */}
      <section className="preset-author-section">
        <div className="editorial-advantage-card">
          <h2>Developed in the Pit Across 970+ Shows</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginTop: '1rem' }}>
            As Lead Photographer and Co-Owner of <strong>Not On Stage</strong> and a working concert photographer covering shows across Los Angeles and San Diego, I built these presets out of absolute necessity. When you need to deliver 10 edited hero selects to an artist&apos;s tour manager by 8:00 AM the morning after a midnight show, you don&apos;t have hours to troubleshoot blown-out red LED channels. These profiles do the heavy lifting instantly.
          </p>
        </div>
      </section>

      {/* Preset FAQ */}
      <section style={{ padding: '3rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Do I need the paid version of Lightroom?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>No! You can use these presets on the free Lightroom Mobile app (iOS and Android) using the included .DNG files. They also work with paid Lightroom CC and Lightroom Classic desktop versions.</p>
          </div>
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>How do I receive the files after purchase?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>Immediately after checkout, you receive an instant download link to a .ZIP file containing all desktop .XMP files, mobile .DNG files, and the installation PDF guide.</p>
          </div>
          <div className="faq-item" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Do these work on both RAW and JPEG photos?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>Yes, although RAW files provide the most dynamic range to recover stage highlights and skin tones.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="services-bottom-cta" style={{ marginBottom: '4rem' }}>
        <h2>Level up your live music edits tonight.</h2>
        <p>Get the signature color grades used for major touring acts across Southern California.</p>
        <Link href="/contact" className="hero-cta" style={{ marginTop: '1rem' }}>
          Inquire or Order Preset Pack ($29)
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
