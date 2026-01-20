
import React, { useState } from 'react';
import { SlideData, SlideType, Birthday } from '../types.ts';
import { X, Save, Sparkles, Loader2, ClipboardList } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface AdminPanelProps {
  slides: SlideData[];
  onUpdate: (slides: SlideData[]) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ slides, onUpdate, onClose }) => {
  const [selectedId, setSelectedId] = useState(slides[0].id);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [importText, setImportText] = useState("");
  
  const currentSlide = slides.find(s => s.id === selectedId)!;

  const updateField = (field: string, value: any) => {
    onUpdate(slides.map(s => s.id === selectedId ? { ...s, [field]: value } : s));
  };

  const updateContent = (field: string, value: any) => {
    onUpdate(slides.map(s => s.id === selectedId ? { 
      ...s, 
      content: { ...s.content, [field]: value } 
    } : s));
  };

  const importBirthdaysWithAI = async () => {
    if (!importText.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Extrae la lista de cumpleaños del siguiente texto y devuélvela en formato JSON. Texto: "${importText}". El mes debe ser un número del 1 al 12.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              birthdays: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    day: { type: Type.STRING },
                    month: { type: Type.NUMBER }
                  },
                  required: ["name", "day", "month"]
                }
              }
            },
            required: ["birthdays"]
          }
        }
      });
      
      const data = JSON.parse(response.text);
      updateContent('birthdays', data.birthdays);
      setImportText("");
      alert("¡Lista de cumpleaños actualizada!");
    } catch (error) {
      console.error(error);
      alert("Error procesando la lista. Asegúrate de que el formato sea legible.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateAI = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Mejora este texto para un slide industrial. Tipo: ${currentSlide.type}. Título: ${currentSlide.title}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              body: { type: Type.STRING }
            },
            required: ["title", "body"]
          }
        }
      });
      const data = JSON.parse(response.text);
      updateField('title', data.title);
      if (data.body) updateContent('body', data.body);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl p-4 md:p-8 flex items-center justify-center animate-fade-in cursor-default">
      <div className="bg-slate-900 w-full max-w-6xl h-[90vh] rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-2xl">
        <div className="w-full md:w-80 border-r border-white/10 bg-black/30 p-6 flex flex-col">
          <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Contenidos</h2>
          <div className="flex-1 space-y-2 overflow-y-auto pr-2">
            {slides.map(s => (
              <button 
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedId === s.id ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}
              >
                <div className="text-[9px] uppercase font-black opacity-50 mb-0.5">{s.type}</div>
                <div className="font-bold truncate text-sm">{s.title}</div>
              </button>
            ))}
          </div>
          <button onClick={onClose} className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold uppercase tracking-widest text-[10px] transition-colors">
            <X size={14} /> Salir Editor
          </button>
        </div>

        <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-slate-900/50 space-y-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">Editando: {currentSlide.title}</h3>
            <button onClick={generateAI} disabled={isAiLoading} className="shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-white font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-colors disabled:opacity-50">
              {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} IA
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="block">
                <span className="text-slate-500 font-black uppercase text-[9px] tracking-[0.3em] mb-2 block">Título</span>
                <input type="text" value={currentSlide.title} onChange={e => updateField('title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg font-bold text-white focus:border-blue-500 outline-none transition-colors" />
              </label>
              
              {currentSlide.type === SlideType.CUMPLEANOS && (
                <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <ClipboardList size={18} />
                    <span className="font-black uppercase text-[10px] tracking-widest">Importar de Excel/Texto</span>
                  </div>
                  <textarea 
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Pega aquí: Juan 05/03, Pedro 12/03..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 h-32 text-sm text-white outline-none focus:border-blue-500 transition-all"
                  />
                  <button 
                    onClick={importBirthdaysWithAI}
                    disabled={isAiLoading || !importText}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} 
                    Procesar con IA
                  </button>
                </div>
              )}

              <label className="block">
                <span className="text-slate-500 font-black uppercase text-[9px] tracking-[0.3em] mb-2 block">Pie de página</span>
                <input type="text" value={currentSlide.footer || ''} onChange={e => updateField('footer', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" />
              </label>
            </div>

            <div className="space-y-6 p-6 bg-black/30 rounded-[2rem] border border-white/5">
              <h4 className="text-blue-500 font-black uppercase text-[9px] tracking-[0.3em] mb-4">Datos del Slide</h4>
              
              {currentSlide.type === SlideType.BUZON && (
                <textarea value={currentSlide.content.body} onChange={e => updateContent('body', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-48 text-white text-sm outline-none" />
              )}

              {currentSlide.type === SlideType.CUMPLEANOS && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {currentSlide.content.birthdays?.map((b: Birthday, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 text-xs">
                      <span className="text-white font-bold">{b.name}</span>
                      <span className="text-blue-400 font-black">{b.day}/{b.month}</span>
                    </div>
                  ))}
                  {(!currentSlide.content.birthdays || currentSlide.content.birthdays.length === 0) && (
                    <div className="text-slate-500 italic text-center py-8">No hay cumpleañeros cargados.</div>
                  )}
                </div>
              )}

              {currentSlide.type === SlideType.SEGURIDAD && (
                <textarea value={currentSlide.content.body} onChange={e => updateContent('body', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-48 text-white text-sm outline-none" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
