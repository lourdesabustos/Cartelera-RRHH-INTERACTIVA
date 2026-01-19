
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_SLIDES, DEFAULT_BRANDING } from './constants';
import { SlideData, Branding } from './types';
import { Layout } from './components/Layout';
import { SlideRenderer } from './components/SlideRenderer';
import { AdminPanel } from './components/AdminPanel';
import { Play, Pause, ChevronLeft, ChevronRight, Settings, Maximize } from 'lucide-react';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>(() => {
    const saved = localStorage.getItem('rrhh_slides');
    return saved ? JSON.parse(saved) : INITIAL_SLIDES;
  });

  const [branding, setBranding] = useState<Branding>(() => {
    const saved = localStorage.getItem('rrhh_branding');
    return saved ? JSON.parse(saved) : DEFAULT_BRANDING;
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem('rrhh_slides', JSON.stringify(slides));
  }, [slides]);

  useEffect(() => {
    localStorage.setItem('rrhh_branding', JSON.stringify(branding));
  }, [branding]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    if (isPaused || showAdmin || slides.length === 0) return;

    const duration = (slides[currentIndex].duration || 15) * 1000;
    const stepTime = 100;
    const steps = duration / stepTime;
    let currentStep = 0;

    progressIntervalRef.current = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) {
        nextSlide();
      }
    }, stepTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPaused, slides, nextSlide, showAdmin]);

  const handleUpdateSlide = (updatedSlide: SlideData) => {
    setSlides(prev => prev.map(s => s.id === updatedSlide.id ? updatedSlide : s));
  };

  return (
    <div className="relative h-screen w-screen bg-slate-950 overflow-hidden text-white font-sans">
      <Layout branding={branding}>
        <div className="h-full flex flex-col relative">
          
          {!showAdmin && (
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 z-50">
              <div 
                className="h-full bg-blue-500 transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <SlideRenderer slide={slides[currentIndex]} />
          </div>

          <div className="absolute bottom-12 right-12 flex items-center gap-4 bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 opacity-0 hover:opacity-100 transition-all duration-500 z-50">
            <button onClick={() => setShowAdmin(!showAdmin)} className="p-2 hover:bg-white/10 rounded-xl text-blue-400" title="Configuración">
              <Settings size={22} className={showAdmin ? 'animate-spin' : ''} />
            </button>
            <div className="w-px h-6 bg-white/20" />
            <button onClick={prevSlide} className="p-2 hover:bg-white/10 rounded-xl"><ChevronLeft size={28} /></button>
            <button onClick={() => setIsPaused(!isPaused)} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-transform active:scale-95">
              {isPaused ? <Play size={28} fill="white" /> : <Pause size={28} fill="white" />}
            </button>
            <button onClick={nextSlide} className="p-2 hover:bg-white/10 rounded-xl"><ChevronRight size={28} /></button>
            <div className="w-px h-6 bg-white/20" />
            <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-xl"><Maximize size={22} /></button>
          </div>
        </div>
      </Layout>

      {showAdmin && (
        <AdminPanel 
          slides={slides} 
          branding={branding}
          onUpdateBranding={setBranding}
          onClose={() => setShowAdmin(false)} 
          onUpdate={handleUpdateSlide}
        />
      )}
    </div>
  );
};

export default App;
