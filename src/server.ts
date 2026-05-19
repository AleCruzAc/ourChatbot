import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

const careerAdvisorPrompt = `
Eres un asistente de orientacion profesional para estudiantes de la Universidad EAN.
Tu objetivo es ayudarles a comprender como la inteligencia artificial impacta su carrera
y como pueden adaptarse de manera etica, practica y estrategica.

Cuando respondas:
- Usa lenguaje claro, cercano y profesional.
- Relaciona la respuesta con empleabilidad, habilidades y adaptacion al mercado laboral.
- Si el estudiante menciona una carrera, explica el impacto de la IA en esa carrera.
- Incluye recomendaciones concretas de habilidades, herramientas o proximos pasos.
- Evita respuestas alarmistas; explica riesgos y oportunidades con equilibrio.
- Si la pregunta no menciona una carrera, pide contexto o responde de forma general.
`;

function createLocalCareerResponse(message: string) {
  const normalizedMessage = message.toLowerCase();
  const careerExamples = [
    { keyword: 'administracion', name: 'administracion de empresas' },
    { keyword: 'negocios', name: 'negocios' },
    { keyword: 'mercadeo', name: 'mercadeo' },
    { keyword: 'marketing', name: 'mercadeo' },
    { keyword: 'derecho', name: 'derecho' },
    { keyword: 'medicina', name: 'medicina' },
    { keyword: 'psicologia', name: 'psicologia' },
    { keyword: 'diseno', name: 'diseno' },
    { keyword: 'ingenieria', name: 'ingenieria' },
    { keyword: 'sistemas', name: 'ingenieria de sistemas' },
  ];
  const detectedCareer =
    careerExamples.find((career) => normalizedMessage.includes(career.keyword))?.name ||
    'tu carrera';

  return {
    choices: [
      {
        message: {
          content: `La IA puede impactar ${detectedCareer} al automatizar tareas repetitivas, apoyar el analisis de informacion y mejorar la toma de decisiones. Para un estudiante de la Universidad EAN, lo importante no es verla solo como una amenaza, sino como una herramienta para aumentar su criterio profesional.

Areas de impacto:
1. Automatizacion de tareas operativas, reportes y busqueda de informacion.
2. Analisis de datos para detectar tendencias, riesgos y oportunidades.
3. Apoyo en comunicacion, investigacion y generacion de ideas.

Habilidades recomendadas:
- Pensamiento critico para revisar lo que produce la IA.
- Analisis de datos basico para tomar mejores decisiones.
- Comunicacion clara para formular buenas preguntas y presentar resultados.
- Etica profesional para usar IA de forma responsable.

Consejo practico: empieza usando herramientas de IA para investigar tu sector, comparar perfiles laborales y crear un plan de aprendizaje con habilidades tecnicas y humanas. La ventaja estara en combinar conocimiento profesional con buen uso de la tecnologia.`,
        },
      },
    ],
  };
}

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env['OPENAI_API_KEY'];
  const useOpenAi = process.env['USE_OPENAI'] === 'true';
  const userMessage = req.body?.message;

  if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({
      error: 'El mensaje no puede estar vacio.',
    });
  }

  if (!useOpenAi) {
    return res.json(createLocalCareerResponse(userMessage));
  }

  if (!apiKey) {
    return res.json(createLocalCareerResponse(userMessage));
  }

  try {
    const timeout = AbortSignal.timeout(30000);
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: careerAdvisorPrompt,
          },
          {
            role: 'user',
            content: userMessage.trim(),
          },
        ],
      }),
      signal: timeout,
    });

    const data = await openAiResponse.json();

    if (!openAiResponse.ok) {
      console.error('OpenAI API error:', data);

      if (data?.error?.code === 'insufficient_quota') {
        return res.json(createLocalCareerResponse(userMessage));
      }

      return res.status(openAiResponse.status).json({
        error: data?.error?.message || 'No se pudo generar la respuesta del asistente.',
      });
    }

    return res.json(data);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Ocurrio un error al conectar con el asistente. Intenta de nuevo en unos segundos.',
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
