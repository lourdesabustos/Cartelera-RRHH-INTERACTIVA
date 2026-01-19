
import React, { useState, useEffect } from 'react';
import { Branding } from '../types';

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
    <div className="h-[100dvh] w-full relative bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 overflow-hidden flex flex-col">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Contenedor Principal */}
      <div className="relative z-10 h-full w-full flex flex-col p-2 sm:p-4 lg:p-6">
        {/* Encabezado: Reloj adaptable */}
        <div className="flex justify-end items-center mb-2 sm:mb-4 px-2">
          <div className="text-right bg-black/40 backdrop-blur-xl px-4 sm:px-7 py-2 sm:py-3 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-xl sm:text-4xl font-black text-white tracking-tighter tabular-nums leading-none">
              {time.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[10px] sm:text-xs text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">
              {time.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>

        {/* Área de Visualización de Slides */}
        <div className="flex-1 bg-white/5 backdrop-blur-md rounded-3xl sm:rounded-[3.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
