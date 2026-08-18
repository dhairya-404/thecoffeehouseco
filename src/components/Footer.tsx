import React, { useState } from 'react';
import { BRAND_INFO } from '../data/cafeData';
import { MagneticButton } from './MagneticButton';
import { useCursor } from '../context/CursorContext';

export const Footer: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setEmailInput('');
      setTimeout(() => setIsSubscribed(false), 3500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section" role="contentinfo">
      <div className="container">
        {/* Massive Headline Callout */}
        <div className="footer-closing-callout">
          <div className="footer-meta-top">
            <span className="label-caps">THE FINAL ACT</span>
            <span className="footer-est">{BRAND_INFO.established}</span>
          </div>

          <h2 className="footer-display-title">
            <span>SEE YOU</span>
            <span className="font-editorial italic highlight-copper">OVER COFFEE.</span>
          </h2>
        </div>

        {/* 4-Column Editorial Links & Newsletter Grid */}
        <div className="footer-links-grid">
          {/* Col 1: Newsletter / The Slow Journal */}
          <div className="footer-col newsletter-col">
            <span className="footer-col-label">THE SLOW LETTER</span>
            <p className="newsletter-p">
              Monthly musings on origin harvests, brewing physics, and quiet mornings along the river. No spam, ever.
            </p>
            {isSubscribed ? (
              <div className="newsletter-success">
                <span>✦ Welcome to the slow circle.</span>
              </div>
            ) : (
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  placeholder="your.email@domain.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-submit" aria-label="Subscribe">
                  →
                </button>
              </form>
            )}
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <span className="footer-col-label">EXPLORE</span>
            <ul className="footer-nav-list">
              <li><a href="#coffee" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>Single Origins</a></li>
              <li><a href="#menu" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>Tasting Menu</a></li>
              <li><a href="#ritual" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>The 4-Step Ritual</a></li>
              <li><a href="#story" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>Atelier Story</a></li>
              <li><a href="#atmosphere" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>Visual Journal</a></li>
            </ul>
          </div>

          {/* Col 3: Social & Culture */}
          <div className="footer-col">
            <span className="footer-col-label">CULTURE & SOCIAL</span>
            <ul className="footer-nav-list">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursor('open', 'INSTA')}
                  onMouseLeave={resetCursor}
                >
                  Instagram ↗
                </a>
              </li>
              <li>
                <a
                  href="https://spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursor('open', 'LISTEN')}
                  onMouseLeave={resetCursor}
                >
                  Café Playlist (Spotify) ↗
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND_INFO.email}`}
                  onMouseEnter={() => setCursor('link')}
                  onMouseLeave={resetCursor}
                >
                  {BRAND_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Atelier Sanctuary */}
          <div className="footer-col">
            <span className="footer-col-label">ATELIER LOCATION</span>
            <p className="footer-address-p">{BRAND_INFO.location}</p>
            <p className="footer-hours-p">
              MON–FRI: 07:00 – 22:00<br />
              SAT–SUN: 08:00 – 23:00
            </p>
          </div>
        </div>

        {/* Bottom Bar with Back to Top Button */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} EMBER & BEAN COFFEE ATELIER. ALL RIGHTS RESERVED.
          </div>

          <MagneticButton
            className="btn-magnetic btn-outline-light back-to-top-btn"
            cursorText="TOP"
            onClick={scrollToTop}
          >
            BACK TO TOP ↑
          </MagneticButton>
        </div>
      </div>

      <style>{`
        .footer-section {
          position: relative;
          background-color: #0A0807;
          border-top: 1px solid var(--border-light);
          padding-top: clamp(6rem, 12vw, 12rem);
          padding-bottom: 4rem;
          color: var(--text-primary);
        }

        .footer-closing-callout {
          border-bottom: 1px solid var(--border-light);
          padding-bottom: clamp(4rem, 8vw, 7rem);
          margin-bottom: 5rem;
        }

        .footer-meta-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .footer-est {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--text-muted);
        }

        .footer-display-title {
          font-family: var(--font-serif);
          font-size: clamp(3.2rem, 9vw, 8.5rem);
          line-height: 0.92;
          font-weight: 400;
          letter-spacing: -0.02em;
          display: flex;
          flex-direction: column;
          text-transform: uppercase;
        }

        .highlight-copper {
          color: var(--accent-copper);
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
          margin-bottom: 5rem;
        }

        @media (min-width: 640px) {
          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .footer-links-grid {
            grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
            gap: 4rem;
          }
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .footer-col-label {
          font-size: var(--text-2xs);
          letter-spacing: 0.22em;
          color: var(--accent-copper);
          font-weight: 600;
        }

        .newsletter-p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          font-weight: 300;
        }

        .footer-newsletter-form {
          position: relative;
          display: flex;
          align-items: center;
          margin-top: 0.5rem;
        }

        .newsletter-input {
          width: 100%;
          background: #14100E;
          border: 1px solid var(--border-light);
          padding: 0.85rem 3rem 0.85rem 1rem;
          border-radius: 4px;
          color: var(--text-primary);
          font-size: var(--text-xs);
          font-family: inherit;
        }

        .newsletter-input:focus {
          border-color: var(--accent-copper);
          outline: none;
        }

        .newsletter-submit {
          position: absolute;
          right: 0.75rem;
          font-size: 1.25rem;
          color: var(--accent-copper);
          cursor: pointer;
        }

        .newsletter-success {
          font-size: var(--text-xs);
          color: var(--accent-copper);
          padding: 0.75rem 0;
        }

        .footer-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .footer-nav-list a {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          transition: color 0.3s ease, transform 0.3s ease;
          display: inline-block;
        }

        .footer-nav-list a:hover {
          color: #FFF;
          transform: translateX(4px);
        }

        .footer-address-p,
        .footer-hours-p {
          font-size: var(--text-sm);
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .footer-bottom-bar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-light);
          padding-top: 2.5rem;
        }

        @media (min-width: 768px) {
          .footer-bottom-bar {
            flex-direction: row;
          }
        }

        .footer-copyright {
          font-size: var(--text-2xs);
          letter-spacing: 0.15em;
          color: var(--text-muted);
        }

        .back-to-top-btn {
          padding: 0.6rem 1.4rem;
        }
      `}</style>
    </footer>
  );
};
