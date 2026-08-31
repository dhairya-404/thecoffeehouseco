import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CursorProvider } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { ReservationModal } from './components/ReservationModal';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { IntroStatement } from './components/IntroStatement';
import { CoffeeSection } from './components/CoffeeSection';
import { MenuSection } from './components/MenuSection';
import { RitualSection } from './components/RitualSection';
import { StorySection } from './components/StorySection';
import { Atmosphere } from './components/Atmosphere';
import { Location } from './components/Location';
import { Footer } from './components/Footer';
import { useLenis } from './hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

function CafeApp() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useLenis();

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        // Admin functionality would go here
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <div className="app-root">
      {!loadingComplete && (
        <Preloader onComplete={handleLoadingComplete} />
      )}

      <Navbar onBookTableClick={() => setIsModalOpen(true)} />

      <main id="main-content">
        <Hero onReserveClick={() => setIsModalOpen(true)} />
        <IntroStatement />
        <CoffeeSection />
        <MenuSection />
        <RitualSection />
        <StorySection />
        <Atmosphere />
        <Location onReserveClick={() => setIsModalOpen(true)} />
      </main>

      <Footer />

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style>{`
        .app-root {
          position: relative;
          min-height: 100vh;
          background-color: var(--bg-canvas);
          color: var(--text-primary);
          overflow-x: hidden;
        }

        /* Custom cursor styles */
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background-color: var(--text-primary);
          border-radius: 50%;
          pointer-events: none;
          z-index: var(--z-cursor);
          mix-blend-mode: difference;
          transform: translate3d(0, 0, 0);
        }

        .cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border: 1px solid var(--text-primary);
          border-radius: 50%;
          pointer-events: none;
          z-index: var(--z-cursor);
          transform: translate3d(0, 0, 0);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        /* Preloader */
        .preloader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--bg-canvas);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .preloader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .preloader-label {
          letter-spacing: 0.2em;
        }

        .preloader-title {
          color: var(--text-primary);
        }

        /* Modal Styles */
        .reservation-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: var(--z-modal);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease;
        }

        .reservation-modal {
          position: relative;
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          max-width: 600px;
          width: 100%;
          padding: clamp(2rem, 5vw, 3.5rem);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          padding: 0.4rem 0.8rem;
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          z-index: 10;
        }

        .modal-close-btn:hover {
          background-color: var(--text-primary);
          color: var(--bg-canvas);
        }

        .reservation-header {
          margin-bottom: 2.5rem;
        }

        .reservation-title {
          margin-bottom: 0.75rem;
          line-height: 1;
        }

        .reservation-subtitle {
          color: var(--text-secondary);
        }

        .reservation-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-row-wide {
          grid-template-columns: 1fr;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .form-label {
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .form-input, .form-select {
          padding: 0.85rem 1rem;
          border: 1px solid var(--border-medium);
          background-color: transparent;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 1rem;
          transition: border-color var(--duration-fast) ease;
        }

        .form-input::placeholder, .form-select::placeholder {
          color: var(--text-muted);
        }

        .form-input:focus, .form-select:focus {
          border-color: var(--text-primary);
          outline: none;
        }

        .time-select-wrapper, .guest-select-wrapper {
          position: relative;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%23a3a3a3' stroke-width='2' d='M1 4l4 4 4-4'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 12px;
        }

        .reservation-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding-top: 1rem;
        }

        .reservation-submit-btn {
          flex: 1;
        }

        .reservation-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .reservation-success-banner {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background-color: rgba(196, 90, 68, 0.1);
          border: 1px solid var(--accent-terracotta);
          border-radius: 4px;
          text-align: center;
        }

        .reservation-success-banner h3 {
          color: var(--accent-terracotta);
          margin-bottom: 0.5rem;
        }

        .reservation-success-banner .body-text {
          color: var(--text-primary);
        }

        /* Noise Canvas */
        .noise-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9990;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <CursorProvider>
      <CafeApp />
    </CursorProvider>
  );
}
