import React, { useState, useEffect } from 'react';
import { Branding } from '../types.ts';
import { Layers } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  branding: Branding;
}

export const Layout: React.FC<LayoutProps> = ({ children, branding }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-full relative bg-[#0a0f1e] overflow-hidden flex flex-col font-sans">
      {/* Header ultra-compacto para notebooks */}
      <header className="h-14 md:h-16 px-6 md:px-10 flex items-center justify-between border-b border-white/5 shrink-0 relative z-[200] bg-[#0a0f1e]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/20">
            <Layers className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <div className="text-white text-base md:text-lg font-black italic leading-none tracking-tight uppercase">
              RRHH CONECTA
            </div>
            <div className="text-blue-500 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
              {branding.location.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Reloj - Ajustado para estar más centrado verticalmente y no tan pegado al borde */}
        <div className="flex items-center gap-6 relative top-0 md:top-0.5">
          <div className="text-right">
            <div className="text-white text-xl md:text-2xl font-bold font-mono leading-none tracking-tighter">
              {time.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
            </div>
            <div className="text-slate-500 text-[8px] font-black uppercase tracking-widest mt-0.5">
              {time.toLocaleDateString('es-CL', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};