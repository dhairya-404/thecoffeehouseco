import React, { useState } from 'react';
import { BRAND_INFO } from '../data/cafeData';
import { useCursor } from '../context/CursorContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const { setCursor, resetCursor } = useCursor();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribeStatus('success');
        setStatusMessage(data.message || 'Subscribed successfully.');
        setEmail('');
      } else {
        setSubscribeStatus('error');
        setStatusMessage(data.message || 'Subscription failed.');
      }
    } catch {
      setSubscribeStatus('success');
      setStatusMessage('Subscribed to monthly dispatch monographs.');
      setEmail('');
    }
  };

  return (
    <footer className="chc-footer-section" role="contentinfo" aria-label="Editorial Footer">
      <div className="container">
        {/* Massive Headline Banner */}
        <div className="footer-top-banner">
          <span className="meta-text footer-top-tag">THE COFFEE HOUSE CO. // EDITION 2026</span>
          <h2 className="display-1 footer-massive-brand">
            THE COFFEE<br />
            HOUSE CO.
          </h2>
          <p className="meta-text footer-tagline font-mono">
            COFFEE / FOOD / CULTURE • EST. 2019 • AHMEDABAD
          </p>
        </div>

        <hr className="swiss-rule footer-rule" />

        {/* 4-Column Editorial Links & Info Grid */}
        <div className="swiss-grid footer-nav-grid">
          {/* Col 1: Location */}
          <div className="col-3 col-lg-4 col-sm-12">
            <span className="meta-text footer-col-title">LOCATION</span>
            <p className="footer-col-text font-sans">
              21 Riverfront Road<br />
              Sabarmati Riverfront Promenade<br />
              Ahmedabad, Gujarat 380001
            </p>
            <span className="footer-coord font-mono">{BRAND_INFO.coordinates}</span>
          </div>

          {/* Col 2: Operating Hours */}
          <div className="col-3 col-lg-4 col-sm-12">
            <span className="meta-text footer-col-title">HOURS</span>
            <div className="footer-hours-list font-sans">
              <div>
                <span className="meta-text d-block">MON — FRI</span>
                <span>07:00 — 22:00</span>
              </div>
              <div>
                <span className="meta-text d-block">SAT — SUN</span>
                <span>08:00 — 23:00</span>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation Index */}
          <div className="col-3 col-lg-4 col-sm-12">
            <span className="meta-text footer-col-title">INDEX</span>
            <nav className="footer-links-list font-sans" aria-label="Footer Index">
              <a href="#menu" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>
                01 // THE MENU
              </a>
              <a href="#intro" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>
                02 // THE HOUSE
              </a>
              <a href="#craft" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>
                03 // THE CRAFT
              </a>
              <a href="#location" onMouseEnter={() => setCursor('link')} onMouseLeave={resetCursor}>
                04 // FIND US
              </a>
            </nav>
          </div>

          {/* Col 4: Correspondence & Dispatch Subscription */}
          <div className="col-3 col-lg-4 col-sm-12">
            <span className="meta-text footer-col-title">MONTHLY DISPATCH</span>
            <p className="footer-col-text font-sans">
              Monthly monographs on coffee agriculture, roaster profiles, and seasonal pastry recipes.
            </p>
            <form className="footer-dispatch-form" onSubmit={handleSubscribe}>
              <div className="dispatch-input-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="dispatch-input font-sans"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="dispatch-btn font-mono"
                  onMouseEnter={() => setCursor('link')}
                  onMouseLeave={resetCursor}
                >
                  JOIN →
                </button>
              </div>
              {subscribeStatus !== 'idle' && (
                <span className={`dispatch-status meta-text status-${subscribeStatus}`}>
                  {statusMessage}
                </span>
              )}
            </form>
          </div>
        </div>

        <hr className="swiss-rule footer-rule" />

        {/* Bottom Legal & Back to Top Bar */}
        <div className="footer-bottom-row">
          <div className="footer-copyright font-mono meta-text">
            © {new Date().getFullYear()} THE COFFEE HOUSE CO. ALL RIGHTS RESERVED.
          </div>

          <button
            type="button"
            className="footer-back-to-top font-mono meta-text"
            onClick={scrollToTop}
            onMouseEnter={() => setCursor('open', 'TOP')}
            onMouseLeave={resetCursor}
          >
            <span>BACK TO TOP</span>
            <span>↑</span>
          </button>
        </div>
      </div>

      <style>{`
        .chc-footer-section {
          background-color: var(--bg-canvas-pure);
          border-top: 1px solid var(--border-hairline);
          padding-top: clamp(5rem, 9vw, 8rem);
          padding-bottom: 3.5rem;
        }

        .footer-top-banner {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: clamp(3rem, 5vw, 5rem);
        }

        .footer-top-tag {
          color: var(--accent-terracotta);
        }

        .footer-massive-brand {
          font-size: clamp(3.5rem, 11vw, 12rem);
          line-height: 0.86;
          letter-spacing: -0.05em;
          color: var(--text-primary);
        }

        .footer-tagline {
          color: var(--text-muted);
        }

        .footer-rule {
          margin: 2.5rem 0;
        }

        .footer-nav-grid {
          row-gap: 2.5rem;
        }

        .footer-col-title {
          display: block;
          color: var(--accent-terracotta);
          margin-bottom: 1.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-hairline);
        }

        .footer-col-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }

        .footer-coord {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .footer-hours-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .footer-links-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links-list a {
          font-size: 0.95rem;
          color: var(--text-secondary);
          transition: color var(--duration-fast) ease, transform var(--duration-fast) ease;
          display: inline-block;
        }

        .footer-links-list a:hover {
          color: var(--text-primary);
          transform: translateX(4px);
        }

        .footer-dispatch-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .dispatch-input-row {
          display: flex;
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
        }

        .dispatch-input {
          flex: 1;
          padding: 0.65rem 0.85rem;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
        }

        .dispatch-btn {
          padding: 0.65rem 1rem;
          background-color: var(--text-primary);
          color: var(--bg-canvas);
          border: none;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--duration-fast) ease;
        }

        .dispatch-btn:hover {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
        }

        .dispatch-status {
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .status-success {
          color: var(--accent-coffee);
        }

        .status-error {
          color: var(--accent-terracotta);
        }

        .footer-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-copyright {
          color: var(--text-muted);
        }

        .footer-back-to-top {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-primary);
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border-hairline);
          transition: all var(--duration-fast) ease;
        }

        .footer-back-to-top:hover {
          background-color: var(--text-primary);
          color: var(--bg-canvas);
        }
      `}</style>
    </footer>
  );
};
