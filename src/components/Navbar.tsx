import React, { useState, useEffect } from 'react';
import { useCursor } from '../context/CursorContext';
import { useAudioAmbience } from '../hooks/useAudioAmbience';

interface NavbarProps {
  onBookTableClick?: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookTableClick, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chc_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const { setCursor, resetCursor } = useCursor();
  const { isPlaying, toggleAudio } = useAudioAmbience();

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('chc_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('chc_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu scroll locking and escape key
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const navLinks = [
    { label: 'MENU', href: '#menu', num: '01' },
    { label: 'STORY', href: '#story', num: '02' },
    { label: 'CRAFT', href: '#craft', num: '03' },
    { label: 'LOCATION', href: '#location', num: '04' },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`chc-navbar ${isScrolled ? 'is-scrolled' : ''}`}
        role="banner"
      >
        <div className="container chc-nav-container">
          {/* Left: Brand Monogram & Title */}
          <a
            href="#"
            className="chc-nav-brand"
            onMouseEnter={() => setCursor('link')}
            onMouseLeave={resetCursor}
          >
            <span className="brand-name font-display">THE COFFEE HOUSE CO.</span>
            <span className="brand-loc meta-text">AHMEDABAD / 23.02°N</span>
          </a>

          {/* Center: Editorial Navigation Links */}
          <nav className="chc-nav-center" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="chc-nav-link font-sans"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                onMouseEnter={() => setCursor('link')}
                onMouseLeave={resetCursor}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Right: Dark Mode Toggle, Sound Ambience & Reserve Action */}
          <div className="chc-nav-right">
            {/* Dark Mode Theme Button before Sound */}
            <button
              type="button"
              className="chc-theme-btn meta-text"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Warm Ivory Light Mode' : 'Switch to Architectural Dark Mode'}
              aria-label="Toggle dark mode"
              onMouseEnter={() => setCursor('open', isDark ? 'LIGHT' : 'DARK')}
              onMouseLeave={resetCursor}
            >
              <span className="theme-icon font-mono">{isDark ? '☀' : '☾'}</span>
              <span>{isDark ? 'LIGHT' : 'DARK'}</span>
            </button>

            {/* Sound Ambience Toggle */}
            <button
              className={`chc-sound-btn meta-text ${isPlaying ? 'is-active' : ''}`}
              onClick={toggleAudio}
              title={isPlaying ? 'Pause Ambient Sound' : 'Play Ambient Room Sound'}
              aria-label="Toggle ambient café audio"
              onMouseEnter={() => setCursor('open', isPlaying ? 'MUTE' : 'AUDIO')}
              onMouseLeave={resetCursor}
            >
              <span className={`sound-dot ${isPlaying ? 'pulsing' : ''}`}></span>
              <span>{isPlaying ? 'SOUND: ON' : 'SOUND: OFF'}</span>
            </button>

            <button
              type="button"
              className="btn-swiss chc-reserve-btn"
              onClick={onBookTableClick}
              onMouseEnter={() => setCursor('link')}
              onMouseLeave={resetCursor}
            >
              <span>RESERVE</span>
              <span className="arrow-icon">→</span>
            </button>

            {/* Mobile Burger Toggle */}
            <button
              className="chc-burger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`burger-bar ${isMobileMenuOpen ? 'bar-top' : ''}`}></span>
              <span className={`burger-bar ${isMobileMenuOpen ? 'bar-bottom' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Editorial Drawer */}
      <div
        className={`chc-mobile-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container mobile-drawer-inner">
          <div className="mobile-drawer-header">
            <div className="mobile-drawer-header-top">
              <div className="mobile-drawer-brand">
                <span className="font-display mobile-brand">THE COFFEE HOUSE CO.</span>
                <span className="meta-text">EST. 2019 / AHMEDABAD</span>
              </div>
              <button
                type="button"
                className="mobile-drawer-close-btn font-mono"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                ✕ CLOSE
              </button>
            </div>
          </div>

          <nav className="mobile-nav-menu">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="mobile-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
              >
                <span className="mobile-num meta-text">{link.num}</span>
                <span className="mobile-label font-display">{link.label}</span>
                <span className="mobile-arrow">→</span>
              </a>
            ))}
          </nav>

          <div className="mobile-drawer-footer">
            <button
              type="button"
              className="btn-swiss btn-swiss-outline full-width"
              onClick={toggleTheme}
              style={{ marginBottom: '0.75rem' }}
            >
              <span>THEME: {isDark ? 'LIGHT (WARM Ivory)' : 'DARK (ARCHITECTURAL)'}</span>
            </button>
            <button
              type="button"
              className="btn-swiss full-width"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onBookTableClick) onBookTableClick();
              }}
            >
              RESERVE A TABLE →
            </button>
            <div className="mobile-meta-row">
              <span className="meta-text">21 RIVERFRONT ROAD</span>
              {onOpenAdmin && (
                <button
                  type="button"
                  className="meta-text staff-link-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                >
                  STAFF CONSOLE ⚙
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .chc-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: var(--z-nav);
          background-color: rgba(245, 243, 238, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid transparent;
          transition: background-color var(--duration-base) ease, border-color var(--duration-base) ease, padding var(--duration-base) ease;
          padding: 1.25rem 0;
        }

        .chc-navbar.is-scrolled {
          background-color: rgba(245, 243, 238, 0.95);
          border-bottom-color: var(--border-hairline);
          padding: 0.85rem 0;
        }

        .chc-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .chc-nav-brand {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .brand-name {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .brand-loc {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .chc-nav-center {
          display: flex;
          align-items: center;
          gap: 2.25rem;
        }

        @media (max-width: 900px) {
          .chc-nav-center {
            display: none;
          }
        }

        .chc-nav-link {
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: var(--text-secondary);
          position: relative;
          padding: 0.25rem 0;
          transition: color var(--duration-fast) ease;
        }

        .chc-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 1px;
          background-color: var(--text-primary);
          transition: width var(--duration-fast) var(--ease-editorial);
        }

        .chc-nav-link:hover {
          color: var(--text-primary);
        }

        .chc-nav-link:hover::after {
          width: 100%;
        }

        .chc-nav-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .chc-theme-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border-hairline);
          background-color: transparent;
          color: var(--text-secondary);
          transition: all var(--duration-fast) ease;
        }

        .chc-theme-btn:hover {
          border-color: var(--text-primary);
          color: var(--text-primary);
        }

        .theme-icon {
          font-size: 0.85rem;
          color: var(--accent-terracotta);
        }

        .chc-sound-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border-hairline);
          background-color: transparent;
          color: var(--text-secondary);
          transition: all var(--duration-fast) ease;
        }

        .chc-sound-btn:hover {
          border-color: var(--text-primary);
          color: var(--text-primary);
        }

        .sound-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--text-muted);
          transition: background-color 0.2s ease;
        }

        .chc-sound-btn.is-active .sound-dot {
          background-color: var(--accent-terracotta);
          box-shadow: 0 0 8px var(--accent-terracotta);
        }

        .chc-sound-btn.is-active .sound-dot.pulsing {
          animation: soundPulse 1.4s infinite ease-in-out;
        }

        @keyframes soundPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.6; }
        }

        .chc-reserve-btn {
          padding: 0.65rem 1.25rem;
        }

        @media (max-width: 640px) {
          .chc-sound-btn {
            display: none;
          }
          .chc-reserve-btn {
            display: none;
          }
        }

        /* Burger Menu */
        .chc-burger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          padding: 6px;
          border: 1px solid var(--border-hairline);
        }

        @media (max-width: 900px) {
          .chc-burger-btn {
            display: flex;
          }
        }

        .burger-bar {
          width: 100%;
          height: 1.5px;
          background-color: var(--text-primary);
          transition: transform var(--duration-base) var(--ease-editorial);
        }

        .burger-bar.bar-top {
          transform: translateY(3.25px) rotate(45deg);
        }

        .burger-bar.bar-bottom {
          transform: translateY(-3.25px) rotate(-45deg);
        }

        /* Fullscreen Mobile Drawer */
        .chc-mobile-drawer {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background-color: var(--bg-canvas);
          z-index: var(--z-drawer);
          display: flex;
          flex-direction: column;
          padding-top: 5rem;
          padding-bottom: 2rem;
          transform: translateY(-110%);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: transform var(--duration-slow) var(--ease-editorial), opacity var(--duration-base) ease, visibility var(--duration-slow);
        }

        .chc-mobile-drawer.is-open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        @media (min-width: 901px) {
          .chc-mobile-drawer {
            display: none !important;
          }
        }

        .mobile-drawer-inner {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }

        .mobile-drawer-header {
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-hairline);
        }

        .mobile-drawer-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .mobile-drawer-brand {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .mobile-drawer-close-btn {
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          padding: 0.5rem 0.85rem;
          border: 1px solid var(--border-hairline);
          background-color: transparent;
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .mobile-drawer-close-btn:hover {
          background-color: var(--text-primary);
          color: var(--bg-canvas);
        }

        .mobile-brand {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .mobile-nav-menu {
          display: flex;
          flex-direction: column;
          margin: auto 0;
          gap: 0.5rem;
        }

        .mobile-nav-link {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 1.15rem 0;
          border-bottom: 1px solid var(--border-hairline);
          color: var(--text-primary);
        }

        .mobile-num {
          color: var(--accent-terracotta);
          width: 32px;
        }

        .mobile-label {
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          flex-grow: 1;
        }

        .mobile-arrow {
          font-size: 1.5rem;
          color: var(--text-muted);
        }

        .mobile-drawer-footer {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-top: 1.5rem;
        }

        .full-width {
          width: 100%;
        }

        .mobile-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .staff-link-btn {
          color: var(--accent-terracotta);
          text-decoration: underline;
          cursor: pointer;
          font-size: 0.6875rem;
        }
      `}</style>
    </>
  );
};
