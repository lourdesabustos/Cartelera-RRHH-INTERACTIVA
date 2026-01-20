
import { SlideType, SlideData, Branding } from './types.ts';

export const DEFAULT_BRANDING: Branding = {
  companyName: 'IMERYS',
  location: 'Planta Santiago'
};

const currentMonth = new Date().getMonth() + 1;

export const INITIAL_SLIDES: SlideData[] = [
  {
    id: '1',
    type: SlideType.BUZON,
    title: '¡Queremos escucharte!',
    content: {
      body: 'Escanea el código para enviarnos tus dudas, sugerencias o reclamos. Es 100% confidencial.',
      qrData: 'https://docs.google.com/forms/d/e/1FAIpQLSfD_SugWuerR5-G4h0K_8XvU_U8rOqWv0NlA/viewform'
    },
    footer: 'RRHH siempre conectado contigo.',
    duration: 20
  },
  {
    id: '3',
    type: SlideType.CUMPLEANOS,
    title: '¡Feliz Cumpleaños!',
    content: {
      birthdays: [
        { name: 'Ejemplo Persona 1', day: '05', month: currentMonth },
        { name: 'Ejemplo Persona 2', day: '12', month: currentMonth },
        { name: 'Ejemplo Persona 3', day: '18', month: currentMonth + 1 > 12 ? 1 : currentMonth + 1 }
      ]
    },
    footer: '¡Un año más de éxito juntos!',
    duration: 15
  },
  {
    id: '4',
    type: SlideType.SEGURIDAD,
    title: 'Tu seguridad es lo primero.',
    content: {
      body: 'Recuerda usar tus protectores auditivos en la zona de molienda. ¡Cuidar tus oídos es cuidar tu futuro!'
    },
    imageUrl: 'https://images.unsplash.com/photo-1590103144002-393f607185c7?auto=format&fit=crop&q=80&w=1200',
    footer: 'Meta: Cero Accidentes.',
    duration: 15
  }
];
