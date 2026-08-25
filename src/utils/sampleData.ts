import { EvidencePage } from '../types';

// Helper to create clean visual placeholder images for sample data
function createSampleImage(title: string, color: string, icon: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <rect width="600" height="450" fill="${color}" />
    <defs>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="600" height="450" fill="url(#grid)" />
    <circle cx="300" cy="180" r="60" fill="rgba(255,255,255,0.25)" />
    <text x="300" y="195" font-family="Arial, sans-serif" font-size="48" fill="#ffffff" text-anchor="middle">${icon}</text>
    <text x="300" y="290" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#ffffff" text-anchor="middle">${title}</text>
    <text x="300" y="325" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.85)" text-anchor="middle">Evidencia Fotográfica de Campo</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const INITIAL_SAVED_LOCATIONS: string[] = [
  'Calle Los Angeles Centro Santa Catarina Ayometla.',
  'Centro Santa Catarina Ayometla',
  'Calle Chapultepec Centro Santa Catarina Ayometla',
  'Calle Allende Centro Santa Catarina Ayometla',
  'Pozo 1 Centro Santa Catarina Ayometla'
];

export const COMMON_ACTIVITY_SUGGESTIONS: string[] = [
  'Cobro de agua potable.',
  'Reparación de fugas de agua potable.',
  'Capacitación en manejo de válvulas',
  'Recolección de cloro para cloración.',
  'Mantenimiento de pozo de agua potable.',
  'Inspección y lectura de medidores.',
  'Atención a reporte ciudadano.',
  'Limpieza y desazolve de drenaje.'
];

export function createBlankPage(defaultLocation: string = ''): EvidencePage {
  return {
    id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: '',
    location: defaultLocation || INITIAL_SAVED_LOCATIONS[0] || 'Calle Los Angeles Centro Santa Catarina Ayometla.',
    title: '',
    notes: '',
    photos: [],
    layout: 'stacked'
  };
}

export const SAMPLE_PAGES: EvidencePage[] = [
  {
    id: 'sample-page-1',
    date: '2026-07-01',
    location: 'Calle Los Angeles Centro Santa Catarina Ayometla.',
    title: 'Reparación de fugas de agua potable.',
    notes: '',
    layout: 'stacked',
    photos: [
      {
        id: 'p1-1',
        dataUrl: createSampleImage('Excavación y reparación de tubería', '#1e3a8a', '🔧'),
        fileName: 'excavacion_fuga_1.jpg',
        rotation: 0
      },
      {
        id: 'p1-2',
        dataUrl: createSampleImage('Personal de cuadrilla en campo', '#0284c7', '👷'),
        fileName: 'personal_ayometla_2.jpg',
        rotation: 0
      }
    ]
  },
  {
    id: 'sample-page-2',
    date: '2026-07-02',
    location: 'Centro Santa Catarina Ayometla',
    title: 'Capacitación en manejo de válvulas',
    notes: 'Se llevó a cabo la consulta e inducción sobre los manuales para el manejo operativo de válvulas.',
    layout: 'stacked',
    photos: [
      {
        id: 'p2-1',
        dataUrl: createSampleImage('Inspección de caja de válvulas', '#0f766e', '⚙️'),
        fileName: 'valvulas_tanque_1.jpg',
        rotation: 0
      },
      {
        id: 'p2-2',
        dataUrl: createSampleImage('Instalación en estación de bombeo', '#0d9488', '💧'),
        fileName: 'estacion_bombeo_2.jpg',
        rotation: 0
      }
    ]
  },
  {
    id: 'sample-page-3',
    date: '2026-07-03',
    location: 'Centro Santa Catarina Ayometla',
    title: 'Recolección de cloro para cloración.',
    notes: 'Se realizó la recolección de cloro en Zacatelco, destinado al tratamiento de cloración del Pozo 1 ubicado entre calle Chapultepec y calle Allende, Centro de Santa Catarina Ayometla.',
    layout: 'single',
    photos: [
      {
        id: 'p3-1',
        dataUrl: createSampleImage('Garrafones de cloro recolectados', '#b45309', '🧪'),
        fileName: 'garrafones_cloro_1.jpg',
        rotation: 0
      }
    ]
  },
  {
    id: 'sample-page-4',
    date: '2026-07-06',
    location: 'Calle Chapultepec Centro Santa Catarina Ayometla',
    title: 'Cobro de agua potable.',
    notes: '',
    layout: 'stacked',
    photos: [
      {
        id: 'p4-1',
        dataUrl: createSampleImage('Cobro domiciliario en calle', '#4338ca', '📋'),
        fileName: 'cobro_domicilio_1.jpg',
        rotation: 0
      },
      {
        id: 'p4-2',
        dataUrl: createSampleImage('Recorrido de cobranza en campo', '#6366f1', '🚶'),
        fileName: 'cobranza_campo_2.jpg',
        rotation: 0
      }
    ]
  }
];
