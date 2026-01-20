
import React from 'react';
import { SlideType, SlideData, Birthday } from '../types.ts';
import { MessageCircle, Cake, ShieldAlert } from 'lucide-react';

interface SlideRendererProps {
  slide: SlideData;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide }) => {
  const now = new Date();
  const currentMonthName = now.toLocaleString('es-CL', { month: 'long' }).toUpperCase();
  const currentMonthNumber = now.getMonth() + 1;

  const renderContent = () => {
    switch (slide.type) {
      case SlideType.BUZON:
        return (
          <div className="h-full flex flex-col lg:flex-row items-center justify-center px-8 lg:px-20 gap-8 lg:gap-16 pt-4 lg:pt-0">
            <div className="flex-1 space-y-4 lg:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                <MessageCircle size={14} /> BUZÓN DE SUGERENCIAS
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-[min(8vw,90px)] font-black italic text-white uppercase leading-[0.9] tracking-tighter">
                ¡TU VOZ ES<br className="hidden lg:block" /> NUESTRA FUERZA!
              </h1>
              <p className="text-base md:text-xl lg:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Escanea el código para enviarnos tus dudas, sugerencias o reclamos. Tu participación es 100% confidencial y fundamental para mejorar nuestra planta.
              </p>
              <div className="flex justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2 bg-[#1e293b] px-4 py-2 rounded-full border border-white/5 shadow-lg">
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">1</span>
                  <span className="text-white text-xs font-bold uppercase tracking-wider">Escanea</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1e293b] px-4 py-2 rounded-full border border-white/5 shadow-lg">
                  <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">2</span>
                  <span className="text-white text-xs font-bold uppercase tracking-wider">Opina</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 shrink-0 scale-90 lg:scale-100">
              <div className="bg-white p-4 lg:p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(slide.content.qrData)}&margin=10`} 
                  alt="QR" 
                  className="w-[180px] h-[180px] md:w-[250px] md:h-[250px] lg:w-[350px] lg:h-[350px]"
                />
              </div>
              <div className="bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                <span className="text-blue-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                  ESCANEAR PARA ABRIR FORMULARIO
                </span>
              </div>
            </div>
          </div>
        );

      case SlideType.CUMPLEANOS:
        // FILTRADO AUTOMÁTICO: Solo los del mes actual
        const monthlyBirthdays = slide.content.birthdays?.filter((b: Birthday) => b.month === currentMonthNumber) || [];
        
        return (
          <div className="h-full flex flex-col lg:flex-row bg-[#0a0f1e]">
            <div className="h-1/4 lg:h-full lg:w-[35%] bg-blue-600 flex flex-col items-center justify-center p-6 lg:p-12 text-center relative overflow-hidden">
              <Cake size={120} className="text-white/10 absolute -top-5 -left-5 rotate-12" />
              <h1 className="text-3xl lg:text-7xl font-black text-white italic tracking-tighter uppercase mb-4 z-10">¡FELIZ DÍA!</h1>
              <div className="bg-white text-blue-600 px-6 py-1.5 lg:px-10 lg:py-3 rounded-full text-lg lg:text-3xl font-black shadow-xl z-10 uppercase italic">
                {currentMonthName}
              </div>
            </div>
            <div className="flex-1 p-6 lg:p-12 flex flex-col justify-center gap-2 lg:gap-3 overflow-hidden">
              {monthlyBirthdays.length > 0 ? (
                monthlyBirthdays.slice(0, 7).map((b: Birthday, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 md:p-4 lg:p-5 bg-white/5 rounded-2xl border border-white/10 animate-fade-in" style={{animationDelay: `${i*0.1}s`}}>
                    <div className="flex items-center gap-3 lg:gap-6">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-blue-600 flex items-center justify-center text-sm lg:text-lg font-black text-white">
                        {b.name.charAt(0)}
                      </div>
                      <div className="text-sm md:text-xl lg:text-2xl font-bold text-white tracking-tight truncate max-w-[200px] md:max-w-md">{b.name}</div>
                    </div>
                    <div className="text-sm md:text-xl lg:text-2xl font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-xl border border-blue-500/20 shrink-0">
                      {b.day}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-slate-500 text-6xl opacity-20 flex justify-center"><Cake size={100}/></div>
                  <div className="text-slate-400 text-xl font-bold italic uppercase tracking-widest">Sin cumpleaños este mes</div>
                </div>
              )}
              {monthlyBirthdays.length > 7 && (
                <div className="text-center text-[10px] font-black text-blue-500/50 uppercase tracking-[0.5em] mt-2">
                  + {monthlyBirthdays.length - 7} MÁS EN LISTA
                </div>
              )}
            </div>
          </div>
        );

      case SlideType.SEGURIDAD:
        return (
          <div className="h-full flex flex-col lg:flex-row relative bg-[#0a0f1e]">
            <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center space-y-6 lg:space-y-10 z-20">
              <div className="inline-flex w-fit items-center gap-3 bg-red-600 px-5 py-2.5 rounded-xl text-white text-sm lg:text-lg font-black uppercase tracking-widest shadow-lg shadow-red-600/30">
                <ShieldAlert size={24} /> ATENCIÓN SEGURIDAD
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-[min(7vw,100px)] font-black text-white italic uppercase leading-[0.85] tracking-tighter">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl lg:text-4xl text-slate-300 font-medium leading-tight max-w-4xl">
                {slide.content.body}
              </p>
            </div>
            <div className="h-1/3 lg:h-full lg:w-1/2 relative shrink-0">
              <img src={slide.imageUrl} className="w-full h-full object-cover grayscale brightness-50" alt="Seguridad" />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0a0f1e] via-[#0a0f1e]/60 lg:via-[#0a0f1e]/40 to-transparent" />
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-12 lg:p-24 text-center">
            <h1 className="text-4xl lg:text-[80px] font-black text-blue-500 italic uppercase mb-6 leading-none tracking-tighter">
              {slide.title}
            </h1>
            <p className="text-xl lg:text-4xl text-white font-medium max-w-5xl leading-tight">
              {slide.content.body || slide.content.answer}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>
      
      <div className="h-10 md:h-12 px-8 flex items-center justify-between bg-black/40 border-t border-white/5 shrink-0">
        <div className="text-[8px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic">
          {slide.footer || 'COMUNICACIÓN INTERNA PLANTA SANTIAGO'}
        </div>
        <div className="flex items-center gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${slide.id === String(i+1) ? 'bg-blue-600 w-6' : 'bg-white/10 w-1.5'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
