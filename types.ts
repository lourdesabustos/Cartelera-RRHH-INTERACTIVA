
export enum SlideType {
  BUZON = 'BUZON',
  RESPONDE = 'RESPONDE',
  CUMPLEANOS = 'CUMPLEANOS',
  SEGURIDAD = 'SEGURIDAD',
  RECONOCIMIENTO = 'RECONOCIMIENTO',
  VISITA = 'VISITA'
}

export interface Birthday {
  name: string;
  day: string;
  month: number; // 1-12
}

export interface SlideData {
  id: string;
  type: SlideType;
  title: string;
  content: any;
  imageUrl?: string;
  footer?: string;
  duration?: number;
}

export interface Branding {
  companyName: string;
  location: string;
}
