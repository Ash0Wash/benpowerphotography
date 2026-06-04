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
  },
  title: {
    default: 'Ben Power Photography | Los Angeles & San Diego Photographer',
    template: '%s | Ben Power Photography',
  },
  description: 'Ben Power is a Los Angeles and San Diego photographer specializing in live music concerts, portraiture, and street photography. Based in California, shooting globally.',
  keywords: [
    'Ben Power Photography',
    'Ben Power photographer',
    'Los Angeles concert photographer',
    'San Diego music photographer',
    'California portrait photographer',
    'live music photography LA',
    'concert photography San Diego',
    'portrait photographer Los Angeles',
    'street photography California',
    'benpowerphotography',
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
    title: 'Ben Power Photography | Los Angeles & San Diego Photographer',
    description: 'Ben Power is a Los Angeles and San Diego photographer specializing in live music concerts, portraiture, and street photography.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ben Power Photography — Los Angeles & San Diego',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Power Photography | Los Angeles & San Diego Photographer',
    description: 'Live music, portraits & street photography. Based in Los Angeles & San Diego, CA.',
    images: ['/og-image.jpg'],
    creator: '@benpowerphoto',
  },
};

// JSON-LD Person schema — tells Google, AI search, and Knowledge Graph exactly who Ben Power is
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ben Power',
  jobTitle: 'Photographer',
  url: 'https://www.benpowerphotography.com',
  email: 'contact@benpowerphotography.com',
  sameAs: [
    'https://www.instagram.com/benpowerphoto',
    // Add your LinkedIn URL here once created: 'https://www.linkedin.com/in/benpowerphoto'
  ],
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
    'Portrait Photography',
    'Street Photography',
    'Live Music Photography',
  ],
  description: 'Ben Power is a Los Angeles and San Diego based photographer specializing in live music concert photography, portraiture, and street photography. His work has been featured in art shows across Los Angeles, San Diego, and Ventura.',
};

// JSON-LD WebSite schema — enables Google Sitelinks Search Box and confirms site identity
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ben Power Photography',
  url: 'https://www.benpowerphotography.com',
  description: 'Portfolio of Ben Power — Los Angeles and San Diego photographer.',
  author: {
    '@type': 'Person',
    name: 'Ben Power',
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
            <a href="mailto:contact@benpowerphotography.com" className="footer-email">contact@benpowerphotography.com</a>
            <div className="footer-copy">© {new Date().getFullYear()} Ben Power Photography. All rights reserved.</div>
          </div>
        </footer>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

