import ProtectedImage from '../components/ProtectedImage';

export const metadata = {
  title: 'About Ben Power | Los Angeles & San Diego Photographer',
  description: 'Ben Power is a Los Angeles and San Diego photographer with over 5 years of experience in concert, portrait, and street photography. Co-owner of Not On Stage.',
  alternates: {
    canonical: 'https://www.benpowerphotography.com/about',
  },
  openGraph: {
    title: 'About Ben Power | Ben Power Photography',
    description: 'Los Angeles & San Diego photographer specializing in live music, portraiture, and street photography.',
    url: 'https://www.benpowerphotography.com/about',
  },
};

// FAQ schema — feeds AI search & Google's People Also Ask section
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is Ben Power Photography?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ben Power is a professional photographer based in Los Angeles and San Diego, California. He specializes in live music concert photography, portrait photography, and street photography, and is the Co-Owner and Lead Photographer at Not On Stage (notonstage.com).',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Ben Power Photography located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ben Power Photography is based in Los Angeles and San Diego, California, USA. Ben shoots throughout California and takes on commissions globally.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Ben Power Photography specialize in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ben Power Photography specializes in live music and concert photography, portrait photography, and street photography with extensive experience capturing the energy of live performance.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I contact Ben Power Photography?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can reach Ben Power Photography by email at contact@benpowerphotography.com or via Instagram @benpowerphoto.',
      },
    },
  ],
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container">
        <div className="section-header">
          <h1>About Ben Power</h1>
        </div>

        <div className="about-section">
          <div className="about-image-wrapper" style={{ position: 'relative', height: '600px' }}>
            <ProtectedImage
              src="/images/misc/about-barn.jpg"
              alt="Ben Power Photography based in Los Angeles for concerts and portraits"
              fill
            />
          </div>
          <div className="about-text">
            <p className="about-bio">
              I&apos;m a Los Angeles and San Diego based photographer with over five years of experience capturing the world through my lens. Rooted in California and shooting globally, my work spans live music, portraiture, and street photography.
            </p>
            <p className="about-detail">
              My work has been featured in art shows across Los Angeles, San Diego, and Ventura, bringing my visual style to audiences throughout California and beyond.
            </p>
          </div>
        </div>

        <div className="about-section" style={{ flexDirection: 'row-reverse' }}>
          <div className="about-image-wrapper" style={{ position: 'relative', height: '600px' }}>
            <ProtectedImage
              src="/images/misc/about-streetlight.jpg"
              alt="Ben Power street photography in Los Angeles"
              fill
            />
          </div>
          <div className="about-text">
            <p className="about-bio" style={{ marginBottom: '1.5rem' }}>
              I specialize in live music and concert photography, having covered 25+ shows at venues across Los Angeles and San Diego. I&apos;m also the Lead Photographer and Co-Owner of{' '}
              <a
                href="https://notonstage.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                Not On Stage
              </a>
              , an independent publication with over 970 published concert galleries. My approach is centered on freezing the true energy, motion, and emotion of a live performance.
            </p>
            <p className="about-detail">
              Whether I&apos;m shooting portraits, concerts, or street photography, I bring technical precision and an eye for real moments to every project. I hand-edit every single frame from scratch. Based in Los Angeles &amp; San Diego, available globally.
            </p>
            <p className="about-detail" style={{ marginTop: '1.5rem' }}>
              <strong>Contact:</strong>{' '}
              <a href="mailto:contact@benpowerphotography.com" className="contact-link">
                contact@benpowerphotography.com
              </a>
              {' '}·{' '}
              <a
                href="https://instagram.com/benpowerphoto"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                @benpowerphoto
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
