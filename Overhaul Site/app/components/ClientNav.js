'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClientNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">Ben Power</Link>
          <ul className="nav-links">
            <li><Link href="/work" className={`nav-link ${pathname.startsWith('/work') ? 'active' : ''}`}>Work</Link></li>
            <li><Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link></li>
            <li><Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contact</Link></li>
          </ul>
          <div className="nav-socials">
            <a href="https://instagram.com/benpowerphoto" target="_blank" rel="noopener noreferrer" className="nav-social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
          <button 
            className={`hamburger ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <Link href="/work" className={`mobile-nav-link ${pathname.startsWith('/work') ? 'active' : ''}`}>Work</Link>
        <Link href="/about" className={`mobile-nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>
        <Link href="/contact" className={`mobile-nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        <div className="mobile-nav-socials">
          <a href="https://instagram.com/benpowerphoto" target="_blank" rel="noopener noreferrer" className="mobile-nav-link">
            Instagram
          </a>
        </div>
      </div>
    </>
  );
}
