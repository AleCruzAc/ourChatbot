import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const dataDir = join(rootDir, 'data');
const dbPath = join(dataDir, 'careers.db');

mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);

db.exec(`
  DROP TABLE IF EXISTS careers;
  DROP TABLE IF EXISTS faculties;

  CREATE TABLE faculties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    faculty_id INTEGER NOT NULL,
    name TEXT NOT NULL UNIQUE,
    keywords TEXT NOT NULL,
    context TEXT NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id)
  );
`);

const insertFaculty = db.prepare(`
  INSERT INTO faculties (name)
  VALUES (?)
`);

const insertCareer = db.prepare(`
  INSERT INTO careers (
    faculty_id,
    name,
    keywords,
    context
  )
  VALUES (?, ?, ?, ?)
`);

const faculties = [
  'Facultad de Administración, Finanzas y Ciencias Económicas',
  'Facultad de Humanidades y Ciencias Sociales',
  'Facultad de Ingeniería',
];

const facultyIds = new Map();

for (const faculty of faculties) {
  const result = insertFaculty.run(faculty);
  facultyIds.set(faculty, result.lastInsertRowid);
}

const careers = [
  {
    faculty: 'Facultad de Administración, Finanzas y Ciencias Económicas',
    name: 'Administración de Empresas',
    keywords:
      'administracion, administración, administracion de empresas, administración de empresas, empresas, gestion, gestión, negocios',
    context:
      'La carrera de Administración de Empresas de la Universidad EAN pertenece a la Facultad de Administración, Finanzas y Ciencias Económicas. Esta carrera se relaciona con la gestión de organizaciones, liderazgo, innovación, toma de decisiones, análisis empresarial y desarrollo de estrategias. La inteligencia artificial impacta esta carrera al automatizar reportes, apoyar el análisis de datos, optimizar procesos, mejorar la toma de decisiones y facilitar la planeación estratégica. Para adaptarse, los estudiantes deben fortalecer habilidades en análisis de datos, pensamiento estratégico, liderazgo, ética, gestión del cambio y uso de herramientas como Excel con IA, Power BI y asistentes conversacionales.',
  },
  {
    faculty: 'Facultad de Humanidades y Ciencias Sociales',
    name: 'Lenguas Modernas',
    keywords:
      'lenguas modernas, lenguas, idiomas, traduccion, traducción, comunicacion intercultural, comunicación intercultural',
    context:
      'La carrera de Lenguas Modernas de la Universidad EAN pertenece a la Facultad de Humanidades y Ciencias Sociales. Esta carrera se relaciona con la comunicación intercultural, el dominio de idiomas, la traducción, la interpretación, la mediación cultural y la comunicación en contextos globales. La inteligencia artificial impacta esta carrera mediante herramientas de traducción automática, asistentes de escritura, análisis lingüístico, generación de contenido multilingüe y apoyo en procesos de comunicación internacional. Para adaptarse, los estudiantes deben fortalecer habilidades en pensamiento crítico, comunicación intercultural, edición y revisión de textos, ética en el uso de IA, dominio avanzado de idiomas y manejo de herramientas como DeepL, ChatGPT, Grammarly y plataformas de traducción asistida.',
  },
  {
    faculty: 'Facultad de Ingeniería',
    name: 'Ingeniería de Sistemas',
    keywords:
      'ingenieria de sistemas, ingeniería de sistemas, sistemas, software, programacion, programación, desarrollo de software, tecnologia, tecnología',
    context:
      'La carrera de Ingeniería de Sistemas de la Universidad EAN pertenece a la Facultad de Ingeniería. Esta carrera se relaciona con el desarrollo de software, arquitectura de sistemas, bases de datos, análisis de información, automatización, ciberseguridad y transformación digital. La inteligencia artificial impacta esta carrera al acelerar la programación, apoyar la detección de errores, automatizar pruebas, generar documentación, optimizar sistemas y facilitar el análisis de datos. Para adaptarse, los estudiantes deben fortalecer fundamentos de programación, pensamiento lógico, arquitectura de software, seguridad, análisis de datos, ética tecnológica y uso responsable de herramientas como GitHub Copilot, ChatGPT, Groq, entornos de desarrollo asistidos por IA y plataformas de machine learning.',
  },
];

for (const career of careers) {
  insertCareer.run(
    facultyIds.get(career.faculty),
    career.name,
    career.keywords,
    career.context
  );
}

console.log(`Base de datos creada correctamente en: ${dbPath}`);
console.log(`Facultades insertadas: ${faculties.length}`);
console.log(`Carreras insertadas: ${careers.length}`);

db.close();