
import React, { useState, useEffect } from 'react';
import { SlideType, SlideData, Birthday } from '../types';
import { MessageCircle, Cake, ShieldCheck, Trophy, Loader2 } from 'lucide-react';

interface SlideRendererProps {
  slide: SlideData;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide }) => {
  const [dynamicBirthdays, setDynamicBirthdays] = useState<Birthday[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonthName, setCurrentMonthName] = useState('');

  useEffect(() => {
    const now = new Date();
    const month = now.toLocaleString('es-CL', { month: 'long' });
    setCurrentMonthName(month.charAt(0).toUpperCase() + month.slice(1));

    if (slide.type === SlideType.CUMPLEANOS && slide.content.sheetUrl) {
      fetchBirthdays(slide.content.sheetUrl, now.getMonth() + 1);
    } else if (slide.type === SlideType.CUMPLEANOS) {
      setDynamicBirthdays(slide.content.birthdays || []);
    }
  }, [slide]);

  const fetchBirthdays = async (url: string, currentMonth: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '').slice(1);
      const filtered = lines
        .map(line => {
          const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (parts.length < 2) return null;
          const name = parts[0].replace(/^"|"$/g, '').trim();
          const dateStr = parts[1].replace(/^"|"$/g, '').trim();
          const dateParts = dateStr.split(/[/-]/);
          let monthIndex = -1;
          if (dateParts.length >= 2) {
            monthIndex = parseInt(dateParts[1]);
          }
          if (monthIndex === currentMonth) return { name, day: dateStr };
          return null;
        })
        .filter((item): item is Birthday => item !== null);
      setDynamicBirthdays(filtered);
    } catch (error) {
      setDynamicBirthdays(slide.content.birthdays || []);
    } finally {
      setIsLoading(false);
    }
  };

  if (!slide) return <div className="h-full flex items-center justify-center text-slate-500 italic">Cargando...</div>;

  const renderContent = () => {
    switch (slide.type) {
      case SlideType.BUZON:
        return (
          <div className="flex flex-col lg:flex-row h-full p-6 sm:p-10 lg:p-20 items-center justify-center lg:justify-between gap-8 lg:gap-16 overflow-y-auto lg:overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900">
            <div className="flex-1 space-y-4 sm:space-y-8 max-w-3xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-xl text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] border border-blue-500/30">
                <MessageCircle size={18} />
                Buzón de Sugerencias
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight text-white italic uppercase tracking-tighter">
                {slide.title}
              </h1>
              <p className="text-base sm:text-2xl lg:text-3xl text-slate-200 leading-relaxed font-medium">
                {slide.content.body}
              </p>
              <div className="hidden sm:flex items-center gap-6 pt-6 justify-center lg:justify-start">
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-black">1</div>
                  <p className="text-sm font-bold text-white uppercase tracking-wide">Escanea el QR</p>
                </div>
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-black">2</div>
                  <p className="text-sm font-bold text-white uppercase tracking-wide">Envía tu idea</p>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative p-4 sm:p-10 bg-white rounded-[2rem] sm:rounded-[4rem] shadow-2xl border-[8px] sm:border-[20px] border-blue-600/10">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(slide.content.qrData)}`} 
                  alt="QR" 
                  className="w-40 sm:w-64 lg:w-80 xl:w-[450px] h-40 sm:h-64 lg:h-80 xl:h-[450px] object-contain"
                />
              </div>
              <div className="mt-4 sm:mt-12">
                <span className="text-blue-400 font-black tracking-[0.3em] uppercase text-[10px] sm:text-base bg-blue-500/10 px-6 py-2 rounded-full animate-pulse border border-blue-500/20">
                  ¡ESCANEAR AQUÍ!
                </span>
              </div>
            </div>
          </div>
        );

      case SlideType.RESPONDE:
        return (
          <div className="flex flex-col h-full p-6 sm:p-12 lg:p-24 justify-center max-w-6xl mx-auto overflow-y-auto">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-12 text-blue-400 italic uppercase tracking-[0.2em] text-center">
               RRHH Responde
            </h1>
            <div className="space-y-6 sm:space-y-12">
              <div className="bg-slate-800/40 p-6 sm:p-10 lg:p-14 rounded-2xl sm:rounded-[3rem] border-l-[8px] sm:border-l-[16px] border-blue-500 relative shadow-2xl">
                <div className="absolute -top-3 sm:-top-6 left-6 sm:left-14 bg-blue-500 text-white px-4 py-1 rounded-lg text-[10px] sm:text-sm font-black uppercase tracking-widest shadow-lg">Consulta</div>
                <p className="text-lg sm:text-3xl lg:text-4xl italic text-white font-medium">"{slide.content.question}"</p>
              </div>
              <div className="bg-blue-600 p-6 sm:p-10 lg:p-14 rounded-2xl sm:rounded-[3rem] border-l-[8px] sm:border-l-[16px] border-white relative shadow-2xl">
                <div className="absolute -top-3 sm:-top-6 left-6 sm:left-14 bg-white text-blue-600 px-4 py-1 rounded-lg text-[10px] sm:text-sm font-black uppercase tracking-widest font-bold shadow-lg">Respuesta</div>
                <p className="text-xl sm:text-4xl lg:text-6xl xl:text-7xl text-white font-black leading-tight tracking-tighter">{slide.content.answer}</p>
              </div>
            </div>
          </div>
        );

      case SlideType.CUMPLEANOS:
        return (
          <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            <div className="h-[30%] lg:h-full lg:w-[40%] bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex flex-col items-center justify-center text-center p-6 lg:p-16">
               <Cake size={40} className="text-white mb-2 lg:mb-10 sm:hidden" />
               <div className="hidden sm:flex w-24 lg:w-32 h-24 lg:h-32 bg-white/10 rounded-full items-center justify-center mb-6 lg:mb-10 border border-white/20">
                  <Cake size={40} className="text-white lg:hidden" />
                  <Cake size={70} className="text-white hidden lg:block" />
               </div>
               <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-2 sm:mb-8 uppercase italic tracking-tighter">
                 {slide.title}
               </h1>
               <div className="bg-white text-blue-900 px-6 lg:px-12 py-1 lg:py-4 rounded-full sm:rounded-[2rem] text-sm sm:text-3xl lg:text-5xl font-black uppercase shadow-2xl">
                 {currentMonthName}
               </div>
            </div>
            <div className="flex-1 p-4 sm:p-12 lg:p-24 flex flex-col justify-center bg-slate-900/60 overflow-y-auto">
               {isLoading ? (
                 <div className="flex flex-col items-center gap-4 text-blue-400">
                   <Loader2 size={40} className="animate-spin" />
                   <p className="text-xs sm:text-sm font-black uppercase tracking-widest">Cargando...</p>
                 </div>
               ) : dynamicBirthdays.length > 0 ? (
                 <div className="grid grid-cols-1 gap-3 sm:gap-6 max-w-2xl mx-auto w-full">
                   {dynamicBirthdays.slice(0, 5).map((person, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 sm:p-8 bg-white/5 rounded-2xl sm:rounded-[2.5rem] border border-white/10 shadow-xl">
                       <div className="flex items-center gap-4 sm:gap-8">
                         <div className="w-10 h-10 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-lg sm:text-4xl font-black text-white shadow-lg">
                           {person.name.charAt(0)}
                       </div>
                       <div className="text-base sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">{person.name}</div>
                     </div>
                     <div className="text-xs sm:text-2xl font-black text-blue-400 bg-blue-500/10 px-4 sm:px-8 py-1 sm:py-3 rounded-xl border border-blue-500/20">{person.day}</div>
                   </div>
                 ))}
               </div>
               ) : (
                 <div className="text-center">
                    <p className="text-lg sm:text-3xl font-bold text-slate-400 italic">No hay registros este mes.</p>
                 </div>
               )}
            </div>
          </div>
        );

      case SlideType.SEGURIDAD:
      case SlideType.RECONOCIMIENTO:
        const isSafety = slide.type === SlideType.SEGURIDAD;
        return (
          <div className="flex flex-col lg:flex-row h-full relative overflow-hidden bg-slate-950">
             <div className="flex-1 p-6 sm:p-16 lg:p-32 flex flex-col justify-center space-y-4 sm:space-y-10 relative z-20 bg-slate-950/80 lg:bg-transparent">
                <div className={`inline-flex w-fit items-center gap-2 sm:gap-4 px-4 py-1.5 sm:px-6 sm:py-3 ${isSafety ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'} rounded-xl text-[10px] sm:text-base font-black uppercase tracking-[0.2em] border`}>
                  {isSafety ? <ShieldCheck size={18} /> : <Trophy size={18} />}
                  {isSafety ? 'Seguridad' : 'Reconocimiento'}
                </div>
                <h1 className="text-3xl sm:text-6xl lg:text-8xl xl:text-9xl font-black text-white leading-tight italic uppercase tracking-tighter">{slide.title}</h1>
                <p className="text-base sm:text-3xl lg:text-5xl text-slate-200 leading-snug font-medium max-w-4xl">{slide.content.body}</p>
             </div>
             <div className="h-[40%] lg:h-full lg:w-[45%] relative shrink-0">
               <img src={slide.imageUrl} className="w-full h-full object-cover" alt="Visual" />
               <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>
      
      {/* Footer adaptable: se oculta en móviles muy pequeños para ahorrar espacio */}
      <div className="h-12 sm:h-20 px-6 sm:px-16 lg:px-24 flex items-center justify-between bg-black/60 border-t border-white/5 shrink-0 backdrop-blur-md">
        <div className="text-[10px] sm:text-base font-black text-white/40 italic tracking-widest uppercase truncate pr-4">
          {slide.footer || 'Gestión RRHH'}
        </div>
        <div className="flex items-center gap-4 text-white/30 shrink-0">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
