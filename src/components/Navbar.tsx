import React, { useState, useEffect } from 'react';
import { MagneticButton } from './MagneticButton';
import { useCursor } from '../context/CursorContext';
import { useAudioAmbience } from '../hooks/useAudioAmbience';

interface NavbarProps {
  onBookTableClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookTableClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isPlaying, toggleAudio } = useAudioAmbience();
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'COFFEE', href: '#coffee' },
    { label: 'MENU', href: '#menu' },
    { label: 'THE RITUAL', href: '#ritual' },
    { label: 'STORY', href: '#story' },
    { label: 'ATMOSPHERE', href: '#atmosphere' },
    { label: 'VISIT', href: '#location' },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`navbar-wrapper ${isScrolled ? 'is-scrolled' : ''}`}
        role="banner"
      >
        <div className="navbar-container">
          {/* Brand Logo */}
          <a
            href="#"
            className="navbar-brand"
            onMouseEnter={() => setCursor('link')}
            onMouseLeave={resetCursor}
          >
            <span className="brand-title">EMBER & BEAN</span>
            <span className="brand-dot">•</span>
            <span className="brand-sub">AHMEDABAD</span>
          </a>

          {/* Center Navigation Links */}
          <nav className="navbar-links" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-item-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                onMouseEnter={() => setCursor('link')}
                onMouseLeave={resetCursor}
              >
                <span>{link.label}</span>
                <span className="nav-hover-line"></span>
              </a>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="navbar-actions">
            {/* Ambient Sound / Atmosphere Toggle Indicator */}
            <button
              className={`sound-toggle-btn ${isPlaying ? 'is-active' : ''}`}
              onClick={toggleAudio}
              title={isPlaying ? 'Pause Ambient Café Audio' : 'Play Ambient Café Audio'}
              aria-label="Toggle ambient café sound"
              onMouseEnter={() => setCursor('open', isPlaying ? 'MUTE' : 'PLAY')}
              onMouseLeave={resetCursor}
            >
              <div className={`sound-bars ${isPlaying ? 'is-playing' : ''}`}>
                <span className="bar bar-1"></span>
                <span className="bar bar-2"></span>
                <span className="bar bar-3"></span>
              </div>
              <span className="sound-label">{isPlaying ? 'SLOW SOUND: ON' : 'SLOW SOUND: OFF'}</span>
            </button>

            {/* Visit / Book CTA */}
            <MagneticButton
              as="a"
              href="#location"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#location');
                if (onBookTableClick) onBookTableClick();
              }}
              className="btn-magnetic btn-primary nav-cta-btn"
              cursorText="VISIT"
            >
              VISIT US
            </MagneticButton>

            {/* Mobile Menu Toggle Button */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`menu-burger-line ${isMobileMenuOpen ? 'open-1' : ''}`}></span>
              <span className={`menu-burger-line ${isMobileMenuOpen ? 'open-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <div className="mobile-menu-bg"></div>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <span className="label-caps">EMBER & BEAN</span>
            <span className="mobile-menu-meta">EST. 2018 / 21 RIVERFRONT RD</span>
          </div>

          <nav className="mobile-nav-list">
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                className="mobile-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
              >
                <span className="mobile-nav-num">0{idx + 1}</span>
                <span className="mobile-nav-title">{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="mobile-menu-footer">
            <button
              className={`mobile-sound-btn ${isPlaying ? 'is-active' : ''}`}
              onClick={toggleAudio}
            >
              <div className={`sound-bars ${isPlaying ? 'is-playing' : ''}`}>
                <span className="bar bar-1"></span>
                <span className="bar bar-2"></span>
                <span className="bar bar-3"></span>
              </div>
              <span>{isPlaying ? 'AMBIENT SOUND: ACTIVE' : 'ENABLE CAFÉ AMBIENCE'}</span>
            </button>

            <div className="mobile-info-block">
              <span className="label-caps">HOURS</span>
              <p>MON–FRI 7AM – 10PM</p>
              <p>SAT–SUN 8AM – 11PM</p>
            </div>
            <a
              href="#location"
              className="btn-magnetic btn-primary mobile-cta"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FIND THE CAFÉ →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: var(--z-header);
          transition: background-color 0.4s var(--ease-out-expo),
                      backdrop-filter 0.4s var(--ease-out-expo),
                      border-color 0.4s var(--ease-out-expo),
                      padding 0.4s var(--ease-out-expo);
          padding: 1.5rem 0;
        }

        .navbar-wrapper.is-scrolled {
          background-color: rgba(15, 12, 10, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-light);
          padding: 1rem 0;
        }

        .navbar-container {
          width: 100%;
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 var(--container-padding);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-serif);
          font-size: 1.25rem;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          transition: opacity 0.3s ease;
        }

        .navbar-brand:hover {
          opacity: 0.85;
        }

        .brand-dot {
          color: var(--accent-copper);
          font-size: 0.85rem;
        }

        .brand-sub {
          font-family: var(--font-sans);
          font-size: 0.6875rem;
          letter-spacing: 0.22em;
          color: var(--text-muted);
          font-weight: 500;
        }

        .navbar-links {
          display: none;
          align-items: center;
          gap: 2.25rem;
        }

        @media (min-width: 1024px) {
          .navbar-links {
            display: flex;
          }
        }

        .nav-item-link {
          position: relative;
          font-family: var(--font-sans);
          font-size: var(--text-xs);
          letter-spacing: 0.2em;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color 0.3s ease;
          padding: 0.4rem 0;
        }

        .nav-item-link:hover {
          color: #FFFFFF;
        }

        .nav-hover-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 1px;
          background-color: var(--accent-copper);
          transition: width 0.3s var(--ease-out-expo);
        }

        .nav-item-link:hover .nav-hover-line {
          width: 100%;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .sound-toggle-btn {
          display: none;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem 0.8rem;
          border-radius: 9999px;
          border: 1px solid var(--border-light);
          background: rgba(245, 240, 235, 0.03);
          color: var(--text-muted);
          transition: all 0.3s ease;
        }

        @media (min-width: 1200px) {
          .sound-toggle-btn {
            display: flex;
          }
        }

        .sound-toggle-btn:hover {
          border-color: var(--accent-copper);
          color: var(--text-primary);
        }

        .sound-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 12px;
        }

        .sound-bars .bar {
          width: 2px;
          background-color: var(--accent-copper);
          border-radius: 1px;
          height: 4px;
          transition: height 0.2s ease;
        }

        .sound-bars.is-playing .bar-1 {
          animation: soundWave 0.8s ease-in-out infinite alternate;
        }
        .sound-bars.is-playing .bar-2 {
          animation: soundWave 0.6s ease-in-out 0.2s infinite alternate;
        }
        .sound-bars.is-playing .bar-3 {
          animation: soundWave 0.9s ease-in-out 0.4s infinite alternate;
        }

        @keyframes soundWave {
          0% { height: 3px; }
          100% { height: 12px; }
        }

        .sound-label {
          font-size: 0.6875rem;
          letter-spacing: 0.15em;
          font-weight: 500;
        }

        .nav-cta-btn {
          display: none;
          padding: 0.65rem 1.4rem;
        }

        @media (min-width: 768px) {
          .nav-cta-btn {
            display: inline-flex;
          }
        }

        .mobile-menu-toggle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          width: 38px;
          height: 38px;
          padding: 4px;
          z-index: 1001;
        }

        @media (min-width: 1024px) {
          .mobile-menu-toggle {
            display: none;
          }
        }

        .menu-burger-line {
          width: 24px;
          height: 1.5px;
          background-color: var(--text-primary);
          transition: transform 0.3s var(--ease-out-expo), background-color 0.3s ease;
          transform-origin: center;
        }

        .menu-burger-line.open-1 {
          transform: translateY(3.75px) rotate(45deg);
          background-color: var(--accent-copper);
        }

        .menu-burger-line.open-2 {
          transform: translateY(-3.75px) rotate(-45deg);
          background-color: var(--accent-copper);
        }

        /* Mobile Menu Drawer */
        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: var(--z-modal);
          visibility: hidden;
          opacity: 0;
          transition: visibility 0.4s ease, opacity 0.4s ease;
        }

        .mobile-menu-drawer.is-open {
          visibility: visible;
          opacity: 1;
        }

        .mobile-menu-bg {
          position: absolute;
          inset: 0;
          background-color: rgba(15, 12, 10, 0.97);
          backdrop-filter: blur(20px);
        }

        .mobile-menu-content {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 6rem var(--container-padding) 3rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1.5rem;
        }

        .mobile-menu-meta {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--text-muted);
        }

        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin: 2rem 0;
        }

        .mobile-nav-item {
          display: flex;
          align-items: baseline;
          gap: 1.25rem;
          padding: 0.5rem 0;
        }

        .mobile-nav-num {
          font-size: var(--text-xs);
          color: var(--accent-copper);
          letter-spacing: 0.15em;
        }

        .mobile-nav-title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: var(--text-primary);
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .mobile-nav-item:hover .mobile-nav-title {
          color: var(--accent-copper);
          transform: translateX(8px);
        }

        .mobile-menu-footer {
          border-top: 1px solid var(--border-light);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .mobile-info-block p {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          letter-spacing: 0.05em;
          margin-top: 0.25rem;
        }

        .mobile-sound-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          border-radius: 9999px;
          border: 1px solid var(--border-light);
          background: rgba(245, 240, 235, 0.04);
          color: var(--text-secondary);
          font-size: var(--text-xs);
          letter-spacing: 0.15em;
          font-weight: 500;
          transition: all 0.3s ease;
          width: 100%;
        }

        .mobile-sound-btn.is-active {
          border-color: var(--accent-copper);
          color: var(--accent-copper);
          background: rgba(184, 99, 56, 0.08);
        }

        .mobile-cta {
          width: 100%;
          text-align: center;
        }
      `}</style>
    </>
  );
};
