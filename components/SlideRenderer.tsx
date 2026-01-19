
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
      
      // Parser más robusto que ignora comillas de Excel/Sheets
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '').slice(1);
      
      const filtered = lines
        .map(line => {
          // Separar por coma pero respetar las que están dentro de comillas si las hubiera
          const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (parts.length < 2) return null;

          const name = parts[0].replace(/^"|"$/g, '').trim();
          const dateStr = parts[1].replace(/^"|"$/g, '').trim();
          
          if (!name || !dateStr) return null;
          
          // Detectar mes: soporta DD/MM, DD-MM, YYYY-MM-DD
          const dateParts = dateStr.split(/[/-]/);
          let monthIndex = -1;
          
          if (dateParts.length >= 2) {
            // Si es YYYY-MM-DD el mes es el segundo
            if (dateParts[0].length === 4) {
              monthIndex = parseInt(dateParts[1]);
            } else {
              // Si es DD/MM/YYYY o DD/MM el mes es el segundo
              monthIndex = parseInt(dateParts[1]);
            }
          }

          if (monthIndex === currentMonth) {
            return { name, day: dateStr };
          }
          return null;
        })
        .filter((item): item is Birthday => item !== null);

      setDynamicBirthdays(filtered);
    } catch (error) {
      console.error("Error cargando cumpleaños:", error);
      setDynamicBirthdays(slide.content.birthdays || []);
    } finally {
      setIsLoading(false);
    }
  };

  if (!slide) return <div className="h-full flex items-center justify-center text-slate-500 italic">Cargando información...</div>;

  const renderContent = () => {
    switch (slide.type) {
      case SlideType.BUZON:
        return (
          <div className="flex flex-col lg:flex-row h-full p-10 lg:p-20 items-center justify-between gap-16 overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900">
            <div className="flex-1 space-y-8 max-w-3xl">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-500/20 text-blue-400 rounded-2xl text-sm font-black uppercase tracking-[0.2em] border border-blue-500/30">
                <MessageCircle size={24} />
                Buzón de Sugerencias
              </div>
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black leading-[1.1] text-white italic uppercase tracking-tighter">
                {slide.title}
              </h1>
              <p className="text-2xl lg:text-3xl text-slate-200 leading-relaxed font-medium">
                {slide.content.body}
              </p>
              <div className="flex items-center gap-6 pt-6">
                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-5 shadow-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg text-xl font-black">1</div>
                  <p className="text-xl font-bold text-white uppercase tracking-wide">Escanea el QR</p>
                </div>
                <div className="w-8 h-px bg-white/20"></div>
                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-5 shadow-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg text-xl font-black">2</div>
                  <p className="text-xl font-bold text-white uppercase tracking-wide">Danos tu opinión</p>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 flex flex-col items-center group">
              <div className="relative p-10 bg-white rounded-[4rem] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.8)] border-[20px] border-blue-600/10 transition-transform duration-700 group-hover:scale-105">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(slide.content.qrData)}`} 
                  alt="QR" 
                  className="w-64 lg:w-80 xl:w-[450px] h-64 lg:h-80 xl:h-[450px] object-contain"
                />
              </div>
              <div className="mt-12 flex flex-col items-center space-y-2">
                <span className="text-blue-400 font-black tracking-[0.5em] uppercase text-sm lg:text-base bg-blue-500/10 px-8 py-3 rounded-full animate-pulse border border-blue-500/20">
                  ¡ESCANEAR AQUÍ!
                </span>
              </div>
            </div>
          </div>
        );

      case SlideType.RESPONDE:
        return (
          <div className="flex flex-col h-full p-12 lg:p-24 justify-center max-w-6xl mx-auto overflow-hidden">
            <h1 className="text-3xl lg:text-4xl font-black mb-12 text-blue-400 italic uppercase tracking-[0.3em] text-center">
               Transparencia y Gestión
            </h1>
            <div className="space-y-12">
              <div className="bg-slate-800/40 p-10 lg:p-14 rounded-[3rem] border-l-[16px] border-blue-500 relative shadow-2xl">
                <div className="absolute -top-6 left-14 bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg">Consulta</div>
                <p className="text-3xl lg:text-4xl italic text-white font-medium leading-tight">"{slide.content.question}"</p>
              </div>
              <div className="bg-blue-600 p-10 lg:p-14 rounded-[3rem] border-l-[16px] border-white relative shadow-2xl">
                <div className="absolute -top-6 left-14 bg-white text-blue-600 px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest font-bold shadow-lg">Respuesta</div>
                <p className="text-4xl lg:text-6xl xl:text-7xl text-white font-black leading-tight tracking-tighter">{slide.content.answer}</p>
              </div>
            </div>
          </div>
        );

      case SlideType.CUMPLEANOS:
        return (
          <div className="flex h-full overflow-hidden">
            <div className="w-[40%] bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex flex-col items-center justify-center text-center p-16">
               <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-10 border border-white/20">
                  <Cake size={70} className="text-white" />
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-8 uppercase italic tracking-tighter">
                 {slide.title}
               </h1>
               <div className="bg-white text-blue-900 px-12 py-4 rounded-[2rem] text-3xl lg:text-5xl font-black uppercase shadow-2xl">
                 {currentMonthName}
               </div>
            </div>
            <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center bg-slate-900/60">
               {isLoading ? (
                 <div className="flex flex-col items-center gap-4 text-blue-400">
                   <Loader2 size={60} className="animate-spin" />
                   <p className="font-black uppercase tracking-widest">Sincronizando nómina...</p>
                 </div>
               ) : dynamicBirthdays.length > 0 ? (
                 <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto w-full">
                   {dynamicBirthdays.slice(0, 5).map((person, idx) => (
                     <div key={idx} className="flex items-center justify-between p-8 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-xl animate-in slide-in-from-right duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                       <div className="flex items-center gap-8">
                         <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white/10">
                           {person.name.charAt(0)}
                       </div>
                       <div className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{person.name}</div>
                     </div>
                     <div className="text-2xl font-black text-blue-400 bg-blue-500/10 px-8 py-3 rounded-2xl border border-blue-500/20">{person.day}</div>
                   </div>
                 ))}
               </div>
               ) : (
                 <div className="text-center space-y-4">
                    <p className="text-3xl font-bold text-slate-400 italic">No hay cumpleaños registrados para este mes.</p>
                    <p className="text-slate-600 uppercase text-xs tracking-widest">Verifica la conexión con Google Sheets</p>
                 </div>
               )}
            </div>
          </div>
        );

      case SlideType.SEGURIDAD:
      case SlideType.RECONOCIMIENTO:
        const isSafety = slide.type === SlideType.SEGURIDAD;
        return (
          <div className="flex h-full relative overflow-hidden bg-slate-950">
             <div className="flex-1 p-16 lg:p-32 flex flex-col justify-center space-y-10 relative z-20">
                <div className={`inline-flex w-fit items-center gap-4 px-6 py-3 ${isSafety ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'} rounded-2xl text-base font-black uppercase tracking-[0.3em] border`}>
                  {isSafety ? <ShieldCheck size={28} /> : <Trophy size={28} />}
                  {isSafety ? 'Seguridad Industrial' : 'Nuestro Orgullo'}
                </div>
                <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black text-white leading-[1] italic uppercase tracking-tighter">{slide.title}</h1>
                <p className="text-3xl lg:text-5xl text-slate-200 leading-snug font-medium max-w-4xl">{slide.content.body}</p>
             </div>
             <div className="w-[45%] relative shrink-0">
               <img src={slide.imageUrl} className="w-full h-full object-cover" alt="Visual" />
               <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />
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
      
      <div className="h-20 px-16 lg:px-24 flex items-center justify-between bg-black/60 border-t border-white/5 shrink-0 backdrop-blur-md">
        <div className="text-base font-black text-white/40 italic tracking-[0.5em] uppercase truncate pr-16">
          {slide.footer || 'Gestión RRHH • Planta Santiago'}
        </div>
        <div className="flex items-center gap-6 text-white/30 shrink-0">
           <span className="text-xs font-black uppercase tracking-[0.4em]">Cartelera Digital Interactiva</span>
           <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
           </div>
        </div>
      </div>
    </div>
  );
};
