
import React, { useState } from 'react';
import { SlideData, SlideType, Branding } from '../types';
import { X, Save, Edit3, Image as ImageIcon, Plus, Trash2, Database, Layout as LayoutIcon, Settings as SettingsIconLucide } from 'lucide-react';

interface AdminPanelProps {
  slides: SlideData[];
  branding: Branding;
  onUpdateBranding: (branding: Branding) => void;
  onClose: () => void;
  onUpdate: (slide: SlideData) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ slides, branding, onUpdateBranding, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'slides' | 'branding'>('slides');
  const [selectedSlideId, setSelectedSlideId] = useState(slides[0].id);
  
  const currentSlide = slides.find(s => s.id === selectedSlideId)!;

  const handleFieldChange = (field: string, value: any) => {
    onUpdate({
      ...currentSlide,
      [field]: value
    });
  };

  const handleContentChange = (field: string, value: any) => {
    onUpdate({
      ...currentSlide,
      content: {
        ...currentSlide.content,
        [field]: value
      }
    });
  };

  const handleBrandingChange = (field: keyof Branding, value: string) => {
    onUpdateBranding({
      ...branding,
      [field]: value
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 w-[95%] max-w-5xl h-[85vh] rounded-[40px] border border-white/10 shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 bg-slate-950 p-8 flex flex-col">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
             <SettingsIconLucide className="text-blue-500" /> Panel
          </h2>

          <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('slides')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'slides' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              Slides
            </button>
            <button 
              onClick={() => setActiveTab('branding')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'branding' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              Marca
            </button>
          </div>
          
          {activeTab === 'slides' ? (
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {slides.map(slide => (
                <button
                  key={slide.id}
                  onClick={() => setSelectedSlideId(slide.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center justify-between group ${
                    selectedSlideId === slide.id 
                    ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="text-[10px] uppercase font-black opacity-50 tracking-tighter">{slide.type}</div>
                    <div className="font-bold truncate max-w-[140px] text-sm">{slide.title}</div>
                  </div>
                  <Edit3 size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedSlideId === slide.id ? 'opacity-100' : ''}`} />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
               <LayoutIcon size={48} className="text-blue-500 mb-4 opacity-20" />
               <p className="text-xs text-slate-500 font-medium italic">Edita la identidad visual de la cartelera en la sección derecha.</p>
            </div>
          )}

          <button 
            onClick={onClose}
            className="mt-6 w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} /> Salir
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-10 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
            
            {activeTab === 'branding' ? (
              <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h3 className="text-3xl font-black">Identidad Corporativa</h3>
                <div className="grid grid-cols-1 gap-8 max-w-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase font-black text-slate-500 mb-2 tracking-widest">Nombre Empresa</label>
                      <input 
                        type="text" 
                        value={branding.companyName}
                        onChange={(e) => handleBrandingChange('companyName', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-black text-slate-500 mb-2 tracking-widest">Ubicación / Planta</label>
                      <input 
                        type="text" 
                        value={branding.location}
                        onChange={(e) => handleBrandingChange('location', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex flex-col gap-2">
                    <p className="text-xs text-blue-400 font-black uppercase tracking-widest">Vista Previa de Identidad</p>
                    <p className="text-3xl font-black text-white italic">{branding.companyName}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">{branding.location}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between">
                   <h3 className="text-3xl font-black">Editando Slide: {currentSlide.title}</h3>
                   <div className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold uppercase tracking-widest">
                     {currentSlide.type}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase font-black text-slate-500 mb-2 tracking-widest">Título Principal</label>
                      <input 
                        type="text" 
                        value={currentSlide.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs uppercase font-black text-slate-500 mb-2 tracking-widest">Pie de Página</label>
                      <input 
                        type="text" 
                        value={currentSlide.footer || ''}
                        onChange={(e) => handleFieldChange('footer', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-black text-slate-500 mb-2 tracking-widest">Duración (segundos)</label>
                      <input 
                        type="number" 
                        value={currentSlide.duration || 10}
                        onChange={(e) => handleFieldChange('duration', parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 bg-slate-950/50 p-6 rounded-3xl border border-white/5">
                    <h4 className="font-black text-slate-400 uppercase text-xs tracking-widest">Contenido Específico</h4>
                    
                    {currentSlide.type === SlideType.BUZON && (
                      <>
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">Cuerpo de Texto</label>
                          <textarea 
                            value={currentSlide.content.body}
                            onChange={(e) => handleContentChange('body', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-32 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">Link de Formulario / QR</label>
                          <input 
                            type="text" 
                            value={currentSlide.content.qrData}
                            onChange={(e) => handleContentChange('qrData', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}

                    {currentSlide.type === SlideType.CUMPLEANOS && (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                          <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <Database size={18} />
                            <span className="text-xs font-black uppercase">Sincronización Cloud</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            Para automatizar, publica tu Google Sheet como CSV y pega el enlace aquí. El sistema filtrará automáticamente por el mes actual.
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-2 uppercase tracking-widest">URL Publicación CSV (Google Sheets)</label>
                          <input 
                            type="text" 
                            placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                            value={currentSlide.content.sheetUrl || ''}
                            onChange={(e) => handleContentChange('sheetUrl', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {currentSlide.type === SlideType.RESPONDE && (
                      <>
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">Pregunta de Trabajador</label>
                          <input 
                            type="text" 
                            value={currentSlide.content.question}
                            onChange={(e) => handleContentChange('question', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">Respuesta RRHH</label>
                          <textarea 
                            value={currentSlide.content.answer}
                            onChange={(e) => handleContentChange('answer', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-24 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}

                    {(currentSlide.type === SlideType.SEGURIDAD || currentSlide.type === SlideType.RECONOCIMIENTO) && (
                      <>
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">Mensaje / Consejo</label>
                          <textarea 
                            value={currentSlide.content.body}
                            onChange={(e) => handleContentChange('body', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-32 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-2">URL de Imagen</label>
                          <input 
                            type="text" 
                            value={currentSlide.imageUrl || ''}
                            onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-white/10 bg-slate-950 flex justify-between items-center">
             <p className="text-slate-500 text-sm">Los cambios se guardan automáticamente en este navegador.</p>
             <button 
              onClick={onClose}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 shadow-lg"
             >
                <Save size={18} /> Confirmar Todo
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
