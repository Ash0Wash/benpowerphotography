import { Inter, Playfair_Display } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import ClientNav from './components/ClientNav';
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
  title: 'Ben Power Photography',
  description: 'San Diego and LA photographer specializing in concerts, portraits, street photography, and cars.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <ClientNav />
        <main>{children}</main>
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
