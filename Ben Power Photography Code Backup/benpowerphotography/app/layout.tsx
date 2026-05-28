import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { DM_Serif_Text } from '@next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"
import { Fraunces } from 'next/font/google';


const dmSerifText = DM_Serif_Text({ subsets: ['latin'], weight: '400' });
const fraunces = Fraunces({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'Ben Power Photography',
  description: 'Photography portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSerifText.className} bg-[#ffffff] text-black text-lg md:text-xl`}>
        <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-black/10">
          <div className="container mx-auto px-4 py-4 md:py-6">
            <nav className="flex items-center justify-between">
              {/* <Link href="/" className={window.innerWidth <= 768 ? 'text-lg md:text-xl font-light' : window.innerWidth <= 1024 ? 'text-xl md:text-2xl font-light' : 'text-2xl md:text-3xl font-light'}>
                <span className="font-[400]">Ben Power</span>
              </Link> */}
              <Link href="/" className="pb-1 text-xl md:text-4xl font-light">
                <span className="font-[400]">Ben Power</span>
              </Link>
              <div className="flex-1 flex justify-center">
                <div className="flex text-base md:text-3xl gap-2 md:gap-14">
                  <Link href="/work" className="hover:underline underline-offset-4">
                    Work
                  </Link>
                  <Link href="/about" className="hover:underline underline-offset-4">
                    About
                  </Link>
                  <Link href="/contact" className="hover:underline underline-offset-4">
                    Contact
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <a href="https://instagram.com/benpowerphoto" target="_blank" rel="noopener noreferrer" className="p-2">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-5 h-5 md:w-8 md:h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37a4 4 0 1 1-2.74-2.74A4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="mailto:contact@benpowerphotography.com" className="p-2">
                  <Mail className="w-5 h-5 md:w-8 md:h-8" />
                  <span className="sr-only">Email</span>
                </a>
              </div>
              <SpeedInsights />
              <Analytics />
            </nav>
          </div>
        </header>
        <main className="pt-16 md:pt-20">{children}</main>
        <footer className="absolute mt-52 pb-4 text-sm right-10">
        © {new Date().getFullYear()} Ben Power. All rights reserved.
        </footer>
      </body>
    </html>
  );
}