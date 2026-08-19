import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CursorProvider } from './context/CursorContext';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { NoiseCanvas } from './components/NoiseCanvas';
import { ReservationModal } from './components/ReservationModal';
import { AdminPortal } from './components/AdminPortal';
import { useLenis } from './hooks/useLenis';
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

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function CafeApp() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize Lenis smooth scroll
  useLenis();

  // Listen for hash #admin or keyboard shortcut Shift+A
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('keydown', handleKeyDown);
    handleHash();

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <div className="app-root">
      {/* Tactile Noise Texture Overlay */}
      <NoiseCanvas />

      {/* Interactive Contextual Follower Cursor */}
      <CustomCursor />

      {/* Reservation Modal */}
      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Admin Reservations & Dispatch Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
      />

      {/* Preloader Curtain */}
      {!loadingComplete && (
        <Preloader onComplete={handleLoadingComplete} />
      )}

      {/* Main Navigation Header */}
      <Navbar
        onBookTableClick={() => setIsModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Page Content */}
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

      {/* Editorial Footer */}
      <Footer />
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
