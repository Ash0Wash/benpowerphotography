import ProtectedImage from '../components/ProtectedImage';

export const metadata = {
  title: 'About Ben Power',
  description: 'Ben Power is a Los Angeles and San Diego photographer with over 5 years of experience in concert, portrait, and street photography. His work has been featured in art shows across California.',
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
        text: 'Ben Power is a professional photographer based in Los Angeles and San Diego, California. He specializes in live music concert photography, portrait photography, and street photography. His work has been featured in art shows across Los Angeles, San Diego, and Ventura.',
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
        text: 'Ben Power Photography specializes in live music and concert photography, portrait photography, and street photography. Ben has covered 20+ shows and has extensive experience capturing the energy of live performance.',
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
              alt="Ben Power Photography — Los Angeles concert and portrait photographer"
              fill
            />
          </div>
          <div className="about-text">
            <p className="about-bio">
              Ben Power is a Los Angeles and San Diego based photographer with over five years of
              experience capturing the world through his lens. Rooted in California and shooting
              globally, Ben&apos;s work spans live music, portraiture, and street photography.
            </p>
            <p className="about-detail">
              His photography has been featured in multiple art shows across Los Angeles, San Diego,
              and Ventura — bringing his distinctive visual style to audiences throughout Southern
              California and beyond.
            </p>
          </div>
        </div>

        <div className="about-section" style={{ flexDirection: 'row-reverse' }}>
          <div className="about-image-wrapper" style={{ position: 'relative', height: '600px' }}>
            <ProtectedImage
              src="/images/misc/about-streetlight.jpg"
              alt="Ben Power street photography — Los Angeles"
              fill
            />
          </div>
          <div className="about-text">
            <p className="about-bio" style={{ marginBottom: '1.5rem' }}>
              Ben specializes in live music and concert photography, having covered 20+ shows at
              venues across Los Angeles and San Diego. His ability to freeze the raw energy of a
              live performance — the motion, the light, the emotion — defines his approach to
              every shoot.
            </p>
            <p className="about-detail">
              Whether shooting portraits, concerts, or the streets of California, Ben Power
              Photography brings technical precision and an eye for authentic moments to every
              project. Based in Los Angeles, available globally.
            </p>
            <p className="about-detail" style={{ marginTop: '1rem' }}>
              <strong>Contact:</strong>{' '}
              <a href="mailto:contact@benpowerphotography.com">
                contact@benpowerphotography.com
              </a>
              {' '}·{' '}
              <a
                href="https://instagram.com/benpowerphoto"
                target="_blank"
                rel="noopener noreferrer"
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

