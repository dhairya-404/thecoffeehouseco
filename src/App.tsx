import { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CursorProvider } from './context/CursorContext';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { NoiseCanvas } from './components/NoiseCanvas';
import { ReservationModal } from './components/ReservationModal';
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

// Register ScrollTrigger so we can call refresh
gsap.registerPlugin(ScrollTrigger);

function CafeApp() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Initialize Lenis smooth scroll
  useLenis();

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
    // Allow DOM to settle then recalculate GSAP scroll trigger offsets
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

      {/* Preloader Curtain */}
      {!loadingComplete && (
        <Preloader onComplete={handleLoadingComplete} />
      )}

      {/* Main Navigation Header */}
      <Navbar onBookTableClick={() => setIsModalOpen(true)} />

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
