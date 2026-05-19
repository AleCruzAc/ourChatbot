export interface CareerKnowledge {
  name: string;
  keywords: string[];
  impact: string;
  changingTasks: string[];
  skills: string[];
  tools: string[];
  advice: string;
}

export const careerKnowledge: CareerKnowledge[] = [
  {
    name: 'administracion de empresas',
    keywords: ['administracion', 'administracion de empresas', 'empresas', 'gerencia', 'gestion'],
    impact:
      'La IA apoya la planeacion, el analisis de indicadores, la automatizacion de reportes y la toma de decisiones basada en datos.',
    changingTasks: [
      'elaboracion de reportes administrativos',
      'analisis de ventas, costos y productividad',
      'seguimiento de procesos internos',
      'apoyo en planeacion estrategica',
    ],
    skills: [
      'analisis de datos',
      'pensamiento estrategico',
      'gestion del cambio',
      'criterio etico para usar IA en decisiones empresariales',
    ],
    tools: ['ChatGPT', 'Power BI', 'Excel con IA', 'herramientas de automatizacion'],
    advice:
      'Aprende a interpretar datos y a convertir resultados de IA en decisiones claras para equipos y organizaciones.',
  },
  {
    name: 'mercadeo',
    keywords: ['mercadeo', 'marketing', 'publicidad', 'marca'],
    impact:
      'La IA transforma la segmentacion de clientes, la personalizacion de campanas, el analisis de tendencias y la creacion de contenido.',
    changingTasks: [
      'generacion de ideas para campanas',
      'analisis de audiencias',
      'redaccion de piezas comerciales',
      'seguimiento de metricas digitales',
    ],
    skills: [
      'analisis de comportamiento del consumidor',
      'creatividad estrategica',
      'prompting para contenido',
      'lectura critica de metricas',
    ],
    tools: ['ChatGPT', 'Canva', 'Google Analytics', 'Meta Ads', 'herramientas de social listening'],
    advice:
      'Usa la IA para acelerar investigacion y contenido, pero conserva tu criterio creativo y conocimiento del consumidor.',
  },
  {
    name: 'negocios internacionales',
    keywords: ['negocios internacionales', 'comercio exterior', 'internacional', 'exportaciones'],
    impact:
      'La IA facilita el analisis de mercados, la traduccion, el monitoreo de riesgos y la comparacion de oportunidades internacionales.',
    changingTasks: [
      'busqueda de informacion de mercados',
      'analisis de competidores internacionales',
      'traduccion y resumen de documentos',
      'seguimiento de riesgos logisticos y comerciales',
    ],
    skills: [
      'analisis global',
      'comunicacion intercultural',
      'manejo de datos comerciales',
      'evaluacion de riesgos',
    ],
    tools: ['ChatGPT', 'DeepL', 'Power BI', 'bases de datos comerciales'],
    advice:
      'Combina herramientas de IA con conocimiento de regulaciones, cultura y contexto economico de cada mercado.',
  },
  {
    name: 'ingenieria de sistemas',
    keywords: ['ingenieria de sistemas', 'sistemas', 'programacion', 'software', 'desarrollo'],
    impact:
      'La IA acelera el desarrollo de software, la documentacion, las pruebas y el analisis de errores, pero exige bases tecnicas solidas.',
    changingTasks: [
      'generacion de codigo repetitivo',
      'revision de errores',
      'creacion de pruebas',
      'documentacion tecnica',
    ],
    skills: [
      'fundamentos de programacion',
      'arquitectura de software',
      'seguridad',
      'validacion critica de codigo generado por IA',
    ],
    tools: ['GitHub Copilot', 'ChatGPT', 'Codex', 'herramientas de testing'],
    advice:
      'Usa la IA como copiloto, no como reemplazo: entiende el codigo, valida resultados y fortalece fundamentos.',
  },
  {
    name: 'psicologia',
    keywords: ['psicologia', 'psicologo', 'salud mental'],
    impact:
      'La IA puede apoyar el analisis de datos, la orientacion inicial y la gestion administrativa, pero no reemplaza el juicio profesional ni la empatia humana.',
    changingTasks: [
      'organizacion de notas',
      'analisis de encuestas',
      'material psicoeducativo',
      'orientacion inicial no clinica',
    ],
    skills: [
      'etica profesional',
      'comunicacion empatica',
      'analisis de datos',
      'criterio para limites del uso de IA',
    ],
    tools: ['ChatGPT', 'formularios digitales', 'herramientas de analisis cualitativo'],
    advice:
      'Enfocate en usar IA para apoyo administrativo y educativo, cuidando privacidad, consentimiento y limites profesionales.',
  },
  {
    name: 'derecho',
    keywords: ['derecho', 'abogado', 'leyes', 'juridico'],
    impact:
      'La IA apoya la busqueda de informacion juridica, el resumen de documentos y la redaccion preliminar, pero requiere revision experta.',
    changingTasks: [
      'revision inicial de documentos',
      'resumen de casos',
      'busqueda de normativa',
      'redaccion de borradores',
    ],
    skills: [
      'argumentacion juridica',
      'lectura critica',
      'etica y proteccion de datos',
      'verificacion de fuentes',
    ],
    tools: ['ChatGPT', 'bases juridicas', 'asistentes de redaccion', 'gestores documentales'],
    advice:
      'Usa IA para acelerar investigacion y borradores, pero valida siempre fuentes, contexto legal y responsabilidad profesional.',
  },
  {
    name: 'contaduria',
    keywords: ['contaduria', 'contabilidad', 'contador', 'finanzas'],
    impact:
      'La IA automatiza conciliaciones, clasificacion de transacciones, reportes financieros y alertas sobre inconsistencias.',
    changingTasks: [
      'clasificacion de movimientos',
      'conciliaciones',
      'reportes financieros',
      'deteccion de inconsistencias',
    ],
    skills: [
      'analisis financiero',
      'manejo de herramientas digitales',
      'control interno',
      'criterio normativo y etico',
    ],
    tools: ['Excel con IA', 'Power BI', 'software contable', 'herramientas de auditoria'],
    advice:
      'Desarrolla habilidades analiticas y criterio normativo para interpretar lo que la automatizacion detecta.',
  },
  {
    name: 'diseno',
    keywords: ['diseno', 'diseno grafico', 'diseño', 'creatividad'],
    impact:
      'La IA acelera bocetos, referencias visuales, variaciones de piezas y prototipos, pero la direccion creativa sigue siendo humana.',
    changingTasks: [
      'generacion de referencias',
      'variaciones de piezas graficas',
      'prototipos rapidos',
      'adaptacion de contenidos',
    ],
    skills: [
      'direccion de arte',
      'criterio visual',
      'prompting creativo',
      'identidad de marca',
    ],
    tools: ['Canva', 'Adobe Firefly', 'ChatGPT', 'Figma'],
    advice:
      'Usa la IA para explorar mas rapido, pero fortalece tu criterio estetico, narrativa visual y comprension del usuario.',
  },
];

export function findCareerKnowledge(message: string): CareerKnowledge | undefined {
  const normalizedMessage = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return careerKnowledge.find((career) =>
    career.keywords.some((keyword) => normalizedMessage.includes(keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))),
  );
}
