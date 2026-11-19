import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import ClientNav from './components/ClientNav';
import ScrollToTop from './components/ScrollToTop';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.benpowerphotography.com'),
  verification: {
    google: 'iI9nnAsPxu0UWCB1hjqNqbM5ybPH5qX5zeWDnzXQJCk',
    other: {
      'p:domain_verify': 'dde1df7cef82e278c74bd4829a919d03',
    },
  },
  title: {
    default: 'Ben Power Photography | Los Angeles & San Diego Concert & Music Portrait Photographer',
    template: '%s | Ben Power Photography',
  },
  description: 'High-energy concert photography, band press portraits, and tour visual packages in Los Angeles and San Diego. Lead Photographer at Not On Stage.',
  keywords: [
    'Ben Power Photography',
    'Los Angeles concert photographer',
    'San Diego live music photographer',
    'tour photographer Southern California',
    'band press photographer LA',
    'music festival photographer California',
    'concert photography packages LA',
    'music industry photographer',
    'tour stop photographer',
    'Not On Stage photographer',
    'LA music photographer',
    'San Diego event photographer',
    'stylized portrait photographer Los Angeles',
  ],
  authors: [{ name: 'Ben Power', url: 'https://www.benpowerphotography.com' }],
  creator: 'Ben Power',
  publisher: 'Ben Power Photography',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://www.benpowerphotography.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.benpowerphotography.com',
    siteName: 'Ben Power Photography',
    title: 'Ben Power Photography | Los Angeles & San Diego Concert & Music Portrait Photographer',
    description: 'High-energy concert photography, band press portraits, and tour visual packages in Los Angeles and San Diego. Lead Photographer at Not On Stage.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ben Power Photography - Los Angeles & San Diego Concert and Tour Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Power Photography | Los Angeles & San Diego Concert & Music Portrait Photographer',
    description: 'High-energy concert photography, band press portraits, and tour visual packages in Los Angeles and San Diego. Lead Photographer at Not On Stage.',
    images: ['/og-image.jpg'],
    creator: '@benpowerphoto',
  },
};

// JSON-LD Person schema: establishes Knowledge Graph identity for Ben Power
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.benpowerphotography.com/#person',
  name: 'Ben Power',
  jobTitle: 'Lead Concert & Music Photographer, Co-Owner',
  url: 'https://www.benpowerphotography.com',
  email: 'contact@benpowerphotography.com',
  sameAs: [
    'https://www.instagram.com/benpowerphoto',
    'https://notonstage.com',
    'https://notonstage.com/coverage',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Not On Stage',
    url: 'https://notonstage.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Los Angeles',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'City', name: 'Los Angeles' },
    { '@type': 'City', name: 'San Diego' },
    { '@type': 'State', name: 'California' },
    { '@type': 'Country', name: 'United States' },
  ],
  knowsAbout: [
    'Concert Photography',
    'Tour Photography',
    'Band Press & EPK Portraits',
    'Music Festival Coverage',
    'Live Music Photojournalism',
    'Commercial Music Buyouts',
  ],
  description: 'Ben Power is a Los Angeles and San Diego concert, event, and portrait photographer. He is also the Lead Photographer and Co-Owner of Not On Stage (notonstage.com), an established live music publication.',
};

// JSON-LD ProfessionalService / LocalBusiness Schema: high local search visibility & pricing catalog
const businessSchema = {
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'LocalBusiness', 'Photographer'],
  '@id': 'https://www.benpowerphotography.com/#organization',
  name: 'Ben Power Photography',
  url: 'https://www.benpowerphotography.com',
  image: 'https://www.benpowerphotography.com/og-image.jpg',
  email: 'contact@benpowerphotography.com',
  priceRange: '$450 - $2500',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Credit Card, Stripe, Invoice, ACH',
  founder: {
    '@id': 'https://www.benpowerphotography.com/#person',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Los Angeles',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  areaServed: [
    {
      '@type': 'AdministrativeArea',
      name: 'Los Angeles Metropolitan Area',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'San Diego County',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Southern California',
    },
    {
      '@type': 'Country',
      name: 'United States',
    },
  ],
  sameAs: [
    'https://www.instagram.com/benpowerphoto',
    'https://notonstage.com',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Concert & Portrait Photography Packages',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Turnkey Tour Stop Photo Pack',
          description: '10 edited hero selects delivered by 8:00 AM next morning, 35+ high-res gallery within 48 hours, full commercial promotional rights, and bonus editorial syndication on Not On Stage.',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: '650',
          maxPrice: '900',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Band Press & EPK Portrait Session',
          description: 'On-location or studio creative shoot in Los Angeles / San Diego for album rollouts, Spotify Canvas, and press releases.',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: '750',
          maxPrice: '1200',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Creative Portrait Session',
          description: 'Editorial portraits, fashion styling, and creative headshots for musicians, models, and creators.',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: '450',
          maxPrice: '650',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Festival & Multi-City Tour Retainers',
          description: 'Dedicated visual coverage across multi-day festivals or full tour runs with express daily deliverables.',
        },
      },
    ],
  },
};

// JSON-LD WebSite schema
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ben Power Photography',
  url: 'https://www.benpowerphotography.com',
  description: 'Concert tour photography, band press portraits, and visual packages in Los Angeles and San Diego by Ben Power.',
  author: {
    '@id': 'https://www.benpowerphotography.com/#person',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <ClientNav />
        <main>
          {children}
        </main>
        <ScrollToTop />
        <footer className="footer">
          <div className="footer-inner">
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="mailto:contact@benpowerphotography.com" className="footer-email">
                contact@benpowerphotography.com
              </a>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <a href="https://notonstage.com" target="_blank" rel="noopener noreferrer" className="footer-email" style={{ color: 'var(--accent)' }}>
                Not On Stage
              </a>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <a href="https://instagram.com/benpowerphoto" target="_blank" rel="noopener noreferrer" className="footer-email">
                @benpowerphoto
              </a>
            </div>
            <div className="footer-copy">
              © {new Date().getFullYear()} Ben Power Photography. Los Angeles & San Diego. All rights reserved.
            </div>
          </div>
        </footer>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
