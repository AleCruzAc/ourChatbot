import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { findCareerByMessage, getAvailableCareers } from './career-db';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
app.use(express.json());


app.post('/api/chat', async (req, res) => {
  const userMessage = req.body?.message;

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({
      response: 'Debes escribir una pregunta para poder orientarte.',
    });
  }

  const career = findCareerByMessage(userMessage);

  if (!career) {
    const availableCareers = getAvailableCareers();

    return res.json({
      response: `La carrera consultada no se encuentra disponible dentro de la base de carreras de la Universidad EAN para este asistente. Por ahora puedo orientarte sobre: ${availableCareers}.`,
    });
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

Responde incluyendo:
1. Nombre de la facultad.
2. Nombre de la carrera.
3. Cómo impacta la IA esa carrera.
4. Habilidades recomendadas.
5. Consejos para adaptarse.
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
