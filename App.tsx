import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_SLIDES, DEFAULT_BRANDING } from './constants.tsx';
import { SlideData, Branding } from './types.ts';
import { Layout } from './components/Layout.tsx';
import { SlideRenderer } from './components/SlideRenderer.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>(() => {
    try {
      const saved = localStorage.getItem('imerys_slides_v3');
      return saved ? JSON.parse(saved) : INITIAL_SLIDES;
    } catch {
      return INITIAL_SLIDES;
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('imerys_slides_v3', JSON.stringify(slides));
  }, [slides]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  useEffect(() => {
    if (showAdmin) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const duration = (slides[currentIndex]?.duration || 15) * 1000;
    const stepTime = 100;
    const steps = duration / stepTime;

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / steps);
        if (next >= 100) {
          nextSlide();
          return 0;
        }
        return next;
      });
    }, stepTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, slides, nextSlide, showAdmin]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="h-screen w-screen bg-[#0a0f1e] overflow-hidden select-none cursor-none group hover:cursor-default">
      <Layout branding={DEFAULT_BRANDING}>
        <div className="h-full relative flex flex-col">
          {/* Progress Bar Estilo Imagen (Justo bajo el header) */}
          {!showAdmin && (
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-[110]">
              <div 
                className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)] transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <SlideRenderer slide={currentSlide} />
          </div>

          {/* Hidden controls */}
          <button 
            onClick={() => setShowAdmin(true)}
            className="absolute bottom-20 left-10 p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity z-[150]"
          >
            <Settings size={20} />
          </button>
        </div>
      </Layout>

      {showAdmin && (
        <AdminPanel 
          slides={slides} 
          onUpdate={setSlides} 
          onClose={() => setShowAdmin(false)} 
        />
      )}
    </div>
  );
};

export default App;