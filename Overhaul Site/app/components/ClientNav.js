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
              IG
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
          <a href="https://instagram.com/benpowerphoto" target="_blank" rel="noopener noreferrer" className="nav-social-link">
            Instagram
          </a>
        </div>
      </div>
    </>
  );
}
