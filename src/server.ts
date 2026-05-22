import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { CareerContext, findCareerByMessage, getAvailableCareers } from './career-db';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
app.use(express.json());

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function isGreeting(message: string): boolean {
  const normalizedMessage = normalizeText(message);

  const greetings = [
    'hola',
    'holaa',
    'buenas',
    'buenos dias',
    'buenas tardes',
    'buenas noches',
    'hey',
    'hello',
    'hi',
    'que tal',
    'como estas',
  ];

  return greetings.some((greeting) => normalizedMessage === greeting);
}

let lastCareerContext: CareerContext | null = null;

function mentionsUnsupportedCareer(message: string): boolean {
  const normalizedMessage = normalizeText(message);

  const unsupportedCareers = [
    'medicina',
    'enfermeria',
    'arquitectura',
    'odontologia',
    'veterinaria',
    'derecho',
    'psicologia',
    'diseno grafico',
    'contaduria',
    'contabilidad',
    'comunicacion social',
    'comunicación social',
    'periodismo',
    'educacion',
    'educación',
    'enfermería',
    'ingeniería de petróleos',
    'petroleos',
  ];

  const mentionsUnsupportedName = unsupportedCareers.some((career) =>
    normalizedMessage.includes(normalizeText(career)),
  );

  return mentionsUnsupportedName;
}

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body?.message;

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({
      response: 'Debes escribir una pregunta para poder orientarte.',
    });
  }

  if (isGreeting(userMessage)) {
    return res.json({
      response:
        'Hola, soy el asistente de orientación profesional de la Universidad EAN. Puedo ayudarte a comprender cómo la inteligencia artificial impacta carreras como Administración de Empresas, Lenguas Modernas e Ingeniería de Sistemas, y qué habilidades puedes desarrollar para adaptarte.',
    });
  }

const detectedCareer = findCareerByMessage(userMessage);

if (!detectedCareer && mentionsUnsupportedCareer(userMessage)) {
  const availableCareers = getAvailableCareers();

  return res.json({
    response: `La carrera consultada no se encuentra disponible dentro de la base de carreras de la Universidad EAN para este asistente.

Por ahora puedo orientarte sobre:

- ${availableCareers.split(', ').join('\n- ')}`,
  });
}

const career = detectedCareer || lastCareerContext;

if (!career) {
  const availableCareers = getAvailableCareers();

  return res.json({
    response: `Para poder orientarte mejor, dime sobre cuál de estas carreras quieres preguntar:

- ${availableCareers.split(', ').join('\n- ')}

Por ejemplo: "¿Cómo impacta la IA en Ingeniería de Sistemas?"`,
  });
}

if (detectedCareer) {
  lastCareerContext = detectedCareer;
}

  const groqApiKey = process.env['GROQ_API_KEY'];

  if (!groqApiKey) {
    return res.status(500).json({
      response: 'No se encontró la API key de Groq en el backend.',
    });
  }

  const careerContext = `
Facultad: ${career.faculty}
Carrera: ${career.name}
Contexto: ${career.context}
`;

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'Eres un asistente virtual de orientación profesional para estudiantes próximos a egresar de la Universidad EAN. Tu objetivo es ayudarles a comprender cómo la inteligencia artificial impacta su carrera y cómo pueden adaptarse profesionalmente. Responde de forma empática, académica, clara y motivadora. Usa únicamente el contexto de carrera entregado por la base de datos.',
          },
          {
            role: 'user',
            content: `
Pregunta del estudiante:
${userMessage}

Contexto de la base de datos:
${careerContext}

Instrucciones de respuesta:
- Usa el contexto de la base de datos para responder.
- No saludes ni te presentes, excepto cuando el mensaje del usuario sea un saludo.
- Si la pregunta es general sobre la carrera, responde con una orientación completa: facultad, carrera, impacto de la IA, habilidades recomendadas y consejos.
- Si la pregunta es específica, por ejemplo sobre trabajos, cursos, herramientas, idiomas, habilidades, primeros pasos o recomendaciones, responde únicamente esa pregunta.
- Si el estudiante usa expresiones como "esta carrera", "mi carrera", "este programa" o "esa facultad", entiende que se refiere a la carrera del contexto.
- No repitas toda la información de la carrera en preguntas de seguimiento.
- No uses markdown con asteriscos ni negritas.
- Usa títulos cortos y listas con guiones cuando ayuden a ordenar la respuesta.
- Mantén un tono claro, profesional, cercano y motivador.
`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error('Groq API error:', data);

      return res.status(500).json({
        response: 'No pude conectarme correctamente con Groq.',
      });
    }

    return res.json({
      response: data.choices?.[0]?.message?.content || 'No recibí una respuesta válida de Groq.',
    });
  } catch (error) {
    console.error('Chat backend error:', error);

    return res.status(500).json({
      response: 'Ocurrió un error al generar la respuesta del asistente.',
    });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

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
