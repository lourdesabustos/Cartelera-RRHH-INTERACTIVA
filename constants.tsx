
import { SlideType, SlideData, Branding } from './types';

export const DEFAULT_BRANDING: Branding = {
  companyName: 'IMERYS',
  location: 'Planta Operativa'
};

export const INITIAL_SLIDES: SlideData[] = [
  {
    id: '1',
    type: SlideType.BUZON,
    title: '¡Tu voz es nuestra fuerza!',
    content: {
      body: 'Escanea el código para enviarnos tus dudas, sugerencias o reclamos. Tu participación es 100% confidencial y fundamental para mejorar nuestra planta.',
      qrData: 'https://docs.google.com/forms/d/19WMOwuVyoh9a4VTOPTsgVMYVRvlriY5Q-VlMibms9UY/edit'
    },
    footer: 'RRHH Imerys • Comunicación Directa',
    duration: 20
  },
  {
    id: '2',
    type: SlideType.RESPONDE,
    title: 'RRHH Responde',
    content: {
      question: '¿Cuándo entregan el calzado de seguridad?',
      answer: 'Ya están en bodega, se entregan este jueves de 14:00 a 16:00 h.',
      note: 'Recuerda que puedes consultar todos tus beneficios en la App Corporativa.'
    },
    footer: 'Transparencia en la gestión.',
    duration: 12
  },
  {
    id: '3',
    type: SlideType.CUMPLEANOS,
    title: 'Cumpleaños del Mes',
    content: {
      month: '', 
      sheetUrl: '', 
      birthdays: [
        { name: 'Ejemplo: Juan Pérez', day: '15/05' }
      ]
    },
    footer: '¡Felicidades a todos los cumpleañeros!',
    duration: 15
  },
  {
    id: '4',
    type: SlideType.SEGURIDAD,
    title: 'Seguridad Primero',
    content: {
      body: 'El uso de protectores auditivos es OBLIGATORIO en toda la zona de producción. ¡Cuida tus oídos!'
    },
    imageUrl: 'https://images.unsplash.com/photo-1516937622528-f479c16369b5?auto=format&fit=crop&q=80&w=1200',
    footer: 'Compromiso con el Cero Accidente.',
    duration: 12
  },
  {
    id: '5',
    type: SlideType.RECONOCIMIENTO,
    title: 'Reconocimiento',
    content: {
      body: 'Felicitamos al equipo de Mantenimiento por su rápida respuesta en la contingencia del lunes pasado.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
    footer: 'Valoramos tu compromiso.',
    duration: 12
  }
];
