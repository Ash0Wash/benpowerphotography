import Link from 'next/link';

export const metadata = {
  title: 'Services & Tour Rates | Ben Power Photography',
  description: 'Concert tour photo packages, band press & EPK sessions, creative portraits, and festival retainers in Los Angeles & San Diego. 8:00 AM next-morning hero delivery.',
  alternates: {
    canonical: 'https://www.benpowerphotography.com/services',
  },
  openGraph: {
    title: 'Services & Tour Rates | Ben Power Photography',
    description: 'Tour stop photography with 8:00 AM delivery, band press shoots, and creative portraits in Los Angeles & San Diego.',
    url: 'https://www.benpowerphotography.com/services',
  },
};

const packages = [
  {
    id: 'tour-stop',
    name: 'Turnkey Tour Stop Photo Pack',
    price: '$650 – $900',
    unit: 'per date',
    lead: 'Built for touring artists, tour managers, and publicists who need social recap assets immediately without waiting weeks for a gallery.',
    items: [
      '10 edited hero selects delivered by 8:00 AM next morning for recap reels and stories',
      '35+ full high-resolution performance and crowd photos within 48 hours',
      'Full commercial promotional buyout rights (socials, tour recap ads, merch promos, PR)',
      'Bonus: Editorial review feature and concert gallery placement on Not On Stage (notonstage.com)',
    ],
    cta: 'Book a Tour Stop',
    ctaLink: '/contact?service=tour-stop',
  },
  {
    id: 'press-epk',
    name: 'Band Press & EPK Portraits',
    price: '$750 – $1,200',
    unit: 'per session',
    lead: 'On-location or studio creative shoot in Los Angeles or San Diego for album rollouts, Spotify Canvas, and press releases.',
    items: [
      'Pre-shoot moodboard collaboration, concept planning, and lighting direction',
      '2–3 hour session on-location or in-studio across LA / San Diego',
      '20–30 finished, magazine-quality retouched selects formatted for print and digital',
      'Full promotional usage rights for publicity campaigns and streaming profiles',
    ],
    cta: 'Book a Press Shoot',
    ctaLink: '/contact?service=press-epk',
  },
  {
    id: 'portrait',
    name: 'Creative Portrait Session',
    price: '$450 – $650',
    unit: 'per session',
    lead: 'Editorial portraits, fashion styling, and stylized headshots for solo artists, creators, and models.',
    items: [
      '60–90 minute targeted location shoot in Southern California',
      '12–18 color-graded, hand-edited high-res deliverables',
      'Wardrobe and location guidance included',
      '3–5 day delivery with private proofing gallery',
    ],
    cta: 'Book a Session',
    ctaLink: '/contact?service=portrait',
  },
  {
    id: 'festival-retainer',
    name: 'Festival & Multi-City Tour Retainers',
    price: 'Custom Quote',
    unit: 'multi-date / routing',
    lead: 'Embedded visual coverage traveling with the artist across multi-day festivals or regional tour runs.',
    items: [
      'Full documentation of soundcheck, green room, pit, stage, and crowd energy',
      'Daily express turnarounds for real-time tour recap rollouts while on the road',
      'Priority scheduling and dedicated turnaround for every date on routing',
      'Custom bundled rates for 3+ dates with clear travel terms',
    ],
    cta: 'Inquire for Custom Quote',
    ctaLink: '/contact?service=festival-retainer',
  },
];

export default function ServicesPage() {
  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      {/* Header */}
      <div className="section-header" style={{ paddingBottom: '2rem' }}>
        <p className="hero-subtitle" style={{ marginBottom: '0.5rem' }}>Packages &amp; Rates</p>
        <h1 style={{ marginBottom: '1rem' }}>Tour &amp; Editorial Services</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', fontSize: '1.05rem', lineHeight: '1.7' }}>
          Visual packages built for the pace of modern live music. Every image is individually hand-edited from scratch—no batch presets, no automated shortcuts.
        </p>
      </div>

      {/* Editorial Rate Cards */}
      <div className="rate-cards-list">
        {packages.map((pkg) => (
          <div key={pkg.id} className="rate-card-row">
            <div className="rate-card-left">
              <h2 className="rate-card-title">{pkg.name}</h2>
              <div className="rate-card-price">
                <span>{pkg.price}</span>
                <span className="rate-card-unit"> / {pkg.unit}</span>
              </div>
              <p className="rate-card-lead">{pkg.lead}</p>
              <Link href={pkg.ctaLink} className="hero-cta" style={{ display: 'inline-flex', marginTop: '1.25rem', padding: '0.75rem 1.75rem', fontSize: '0.85rem' }}>
                {pkg.cta} →
              </Link>
            </div>

            <div className="rate-card-right">
              <ul className="rate-deliverables-list">
                {pkg.items.map((item, idx) => (
                  <li key={idx}>
                    <span className="rate-dot">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Grounded Note on Not On Stage */}
      <div className="editorial-note-box">
        <h3>The Not On Stage Connection</h3>
        <p>
          I co-own and shoot lead for{' '}
          <a href="https://notonstage.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Not On Stage (notonstage.com)
          </a>
          , an independent live music publication with over 970 published concert galleries and direct editorial relationships with Universal Music Group&apos;s 1824 and major touring PR firms.
        </p>
        <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
          When you book a tour stop or retainer, your show can also be featured with live review coverage directly on Not On Stage, giving your date authentic editorial press alongside commercial tour visual assets.
        </p>
      </div>

      {/* Straightforward Bottom Contact Callout */}
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem 1rem', borderTop: '1px solid var(--glass-border)' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Have upcoming tour dates or an album rollout?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
          Drop your city, venue, and date in the booking form. I typically reply within a few hours to confirm routing.
        </p>
        <Link href="/contact" className="hero-cta" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
          Check Date Availability →
        </Link>
      </div>
    </div>
  );
}
