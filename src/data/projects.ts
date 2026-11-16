export type Project = {
  name: string;
  slug: string;
  order: number;
  subtitle: string;
  description: string;
  images: string[];
  /** Miniatura vertical (4:5) para la portada en el móvil; si falta, se recorta images[0] */
  thumbMobile?: string;
  tech: { primary: string[]; tools?: string[] };
  metrics?: { label: string; value: string }[];
  links?: { demo?: string; repo?: string; docs?: string };
  role: string;
  dateStart: string;
  /** Textos en español; los campos de arriba son la versión en inglés */
  es?: { subtitle: string; description: string; role?: string; metrics?: { label: string; value: string }[] };
  /** Fuera de la portada y del recorrido "siguiente proyecto"; su página sigue accesible */
  hidden?: boolean;
};

/** El proyecto con sus textos en el idioma pedido */
export const localize = (p: Project, lang: string): Project => (lang === "es" && p.es ? { ...p, ...p.es } : p);

/** Proyectos de la portada, por prioridad */
export const featured = () => projects.filter((p) => !p.hidden).sort((a, b) => b.order - a.order);

export const projects: Project[] = [
  {
    name: "Andolimpio",
    slug: "andolimpio",
    es: {
      subtitle: "¿Cuántos venezolanos viven con menos que tu hogar?",
      description: "Escribes lo que entra a tu casa cada mes y te dice en qué lugar quedas en la distribución del ingreso de Venezuela, con los datos de la ENCOVI 2025 de la UCAB. Cada cifra cita la lámina de la que sale.",
      role: "Creador",
      metrics: [
        {
          label: "Hogares en la fuente",
          value: "11.352"
        },
        {
          label: "Peso de la página",
          value: "~19 KB"
        }
      ]
    },
    order: 103,
    subtitle: "How many Venezuelans live on less than your household?",
    description:
      "Type what your household earns each month and see where it falls in Venezuela's income distribution, built on the ENCOVI 2025 survey (UCAB). The survey only publishes ten decile averages, so I fitted a curve that reproduces them exactly, with every figure cited to its source slide.",
    images: [
      "/projects/andolimpio/hero.webp",
      "/projects/andolimpio/mobile-flow.webp",
      "/projects/andolimpio/result.webp",
      "/projects/andolimpio/chart.webp",
      "/projects/andolimpio/levels.webp"
    ],
    thumbMobile: "/projects/andolimpio/thumb-mobile.webp",
    tech: {
      primary: ["Astro", "TypeScript", "Data viz"],
      tools: ["SVG", "node:test", "Vercel"],
    },
    metrics: [
      { label: "Households in source", value: "11,352" },
      { label: "Page weight", value: "~19 KB" },
    ],
    links: {
      demo: "https://andolimpio.angelcalderon.dev",
      repo: "https://github.com/Doble-2/andolimpio",
    },
    role: "Creator",
    dateStart: "2026",
  },
  {
    name: "OSINT-D2",
    slug: "osint-d2",
    es: {
      subtitle: "Agente de IA autónomo para investigar identidades",
      description: "Le das un usuario o un email y un agente de IA lo investiga solo: busca en más de 20 plataformas, sigue las pistas que encuentra y entrega un dossier PDF basado en evidencia. Open source, con Docker y la opción de correr la IA en local con Ollama.",
      role: "Creador e ingeniero de seguridad",
      metrics: [
        {
          label: "Tests",
          value: "547"
        },
        {
          label: "Herramientas del agente",
          value: "9"
        }
      ]
    },
    order: 110,
    subtitle: "Autonomous AI agent for identity investigation",
    description:
      "Give it a username or email: an AI agent scans 20+ platforms, finds new leads, pivots on them on its own and delivers an evidence-based profile as a PDF dossier (6 dimensions, 3 of them opt-in because they are sensitive). Open source, Docker-ready, with the AI able to run locally via Ollama.",
    images: [
      "/projects/osint-d2/dashboard-timeline.webp",
      "/projects/osint-d2/dashboard-graph.webp",
      "/projects/osint-d2/dashboard-report.webp",
      "/projects/osint-d2/dossier-demo.webp"
    ],
    thumbMobile: "/projects/osint-d2/thumb-mobile.webp",
    tech: {
      primary: ["Python", "AI Agents", "Cybersecurity"],
      tools: ["FastAPI", "Typer", "Playwright", "WeasyPrint", "Docker", "Ollama"],
    },
    metrics: [
      { label: "Tests", value: "547" },
      { label: "Agent tools", value: "9" },
    ],
    links: {
      repo: "https://github.com/Doble-2/osint-d2",
      docs: "https://osint-d2.angelcalderon.dev",
    },
    role: "Creator & Security Engineer",
    dateStart: "2025",
  },
  {
    name: "Céflow",
    slug: "ceflow",
    es: {
      subtitle: "Planificación odontológica 3D en el navegador · 5.º lugar en Platanus Hack 26",
      description: "Lo construimos desde cero en las 36 horas de Platanus Hack 26 Caracas, un equipo de cinco con un odontólogo. El especialista carga escaneos intraorales y tomografías y obtiene un borrador de planificación en 3D en el navegador, sin licencias CAD ni GPU dedicada. El paciente recibe un informe interactivo con su modelo 3D.",
      role: "Desarrollador",
      metrics: [
        {
          label: "Platanus Hack 26",
          value: "5.º de 22"
        },
        {
          label: "Tests",
          value: "1.000+"
        }
      ]
    },
    order: 105,
    subtitle: "3D dental planning in the browser · 5th place, Platanus Hack 26",
    description:
      "Built in 36 hours at Platanus Hack 26 Caracas with a team of five, including a dentist. Dentists load intraoral scans (STL, OBJ, PLY) and CBCT scans (DICOM) and get a 3D planning draft in the browser, with no CAD license or dedicated GPU. Patients get an interactive report with their 3D model and an FDI odontogram. 5th of 22 teams and 3rd in technical execution.",
    images: [
      "/projects/ceflow/model-3d.webp",
      "/projects/ceflow/mobile-flow.webp",
      "/projects/ceflow/patient-report.webp",
      "/projects/ceflow/odontogram.webp"
    ],
    thumbMobile: "/projects/ceflow/thumb-mobile.webp",
    tech: {
      primary: ["React", "Three.js", "AI"],
      tools: ["TypeScript", "Web Workers", "DICOM", "Vercel AI SDK", "Playwright"],
    },
    metrics: [
      { label: "Platanus Hack 26", value: "5th of 22" },
      { label: "Tests", value: "1,000+" },
    ],
    links: {
      demo: "https://ceflow-ph.onrender.com",
      repo: "https://github.com/platanus-hack/platanus-hack-26-ve-team-18",
    },
    role: "Developer",
    dateStart: "2026",
  },
  {
    name: "Eficense Residence",
    slug: "eficense",
    es: {
      subtitle: "Ecosistema de seguridad residencial con IoT e IA",
      description: "Una plataforma de gestión residencial que conecta el hardware de seguridad física con una arquitectura cloud moderna. Automatiza el acceso de visitantes y simplifica los reportes financieros de condominios grandes.",
      role: "Arquitecto de software líder",
      metrics: [
        {
          label: "Unidades",
          value: "150+"
        },
        {
          label: "Sincronización",
          value: "Tiempo real"
        }
      ]
    },
    order: 100,
    subtitle: "IoT & AI Security Ecosystem",
    description:
      "A comprehensive residential management platform bridging physical security hardware with modern cloud architecture. Designed to automate visitor access and streamline complex financial reporting for large-scale condominiums.",
    images: [
      "/projects/eficense/dashboard.webp",
      "/projects/eficense/telegram.webp",
      "/projects/eficense/finances.webp",
      "/projects/eficense/docs.webp"
    ],
    tech: {
      primary: ["Next.js", "Python", "IoT"],
      tools: ["FastAPI", "PostgreSQL", "Redis", "DeepSeek API"],
    },
    metrics: [
      { label: "Units", value: "150+" },
      { label: "Sync", value: "Real-time" },
    ],
    links: {
      demo: "",
    },
    role: "Lead Software Architect",
    dateStart: "2025",
  },
  {
    name: "Studia",
    slug: "studia",
    es: {
      subtitle: "SaaS educativo con IA",
      description: "Un ecosistema de tutoría con IA para colegios. Toma la información de la institución y crea agentes RAG personalizados para cada estudiante, disponibles directamente por WhatsApp.",
      role: "Creador e ingeniero líder"
    },
    order: 20,
    hidden: true,
    subtitle: "AI-Powered EdTech SaaS",
    description:
      "An omnichannel AI tutoring ecosystem designed for schools. It ingests institutional data to create personalized RAG agents for students, accessible directly via WhatsApp.",
    images: [
        "/projects/studia/mobile-flow.webp",
      "/projects/studia/dashboardadmin.webp",
      "/projects/studia/light-dark.webp",
      "/projects/studia/dashboardowner.webp",
      "/projects/studia/chatbot.webp",
      "/projects/studia/quizes.webp",
      "/projects/studia/themes.webp"
    ],
    tech: {
      primary: ["React Native", "Python", "RAG"],
      tools: ["WhatsApp Cloud API", "Vector DB", "FastAPI", "PostgreSQL"],
    },
    role: "Creator & Lead Engineer",
    dateStart: "2025",
  },
  {
    name: "Scenery",
    slug: "scenery",
    es: {
      subtitle: "Gestor de fondos de pantalla para la terminal",
      description: "Una herramienta de línea de comandos para usuarios avanzados de Linux: gestiona, etiqueta y organiza colecciones grandes de fondos de pantalla. Se integra con gestores de ventanas en mosaico como Hyprland.",
      role: "Mantenedor open source",
      metrics: [
        {
          label: "Tipo",
          value: "Open source"
        },
        {
          label: "Interfaz",
          value: "TUI"
        }
      ]
    },
    order: 98,
    subtitle: "Modern CLI Wallpaper Manager",
    description:
      "A high-performance CLI tool for Linux power users to manage, tag, and organize large wallpaper collections. Built to integrate seamlessly with tiling window managers like Hyprland.",
    images: [
      "/projects/scenery/scenery-terminal.webp",
      "/projects/scenery/scenery-search.webp"
    ],
    tech: {
      primary: ["Python", "Linux"],
      tools: ["Typer", "Rich", "Pillow", "GitHub Actions"],
    },
    metrics: [
      { label: "Type", value: "Open source" },
      { label: "UX", value: "TUI" },
    ],
    links: {
      repo: "https://github.com/Doble-2/scenery-wallpapers",
    },
    role: "Open Source Maintainer",
    dateStart: "2026",
  },
  {
    name: "Born AI",
    slug: "born-ai",
    es: {
      subtitle: "Genética predictiva con LLMs (Next.js + OpenAI)",
      description: "Un concepto de app web que usa LLMs para generar resúmenes explicativos de predicción a partir de datos estructurados. Ganó el segundo lugar en una competencia de programación.",
      role: "Líder de desarrollo",
      metrics: [
        {
          label: "Premio",
          value: "2.º lugar"
        }
      ]
    },
    order: 61,
    subtitle: "Predictive genetics with LLMs (Next.js + OpenAI)",
    description:
      "A web app concept that uses LLMs to generate explanatory prediction summaries from structured inputs. Earned 2nd Place Winner in a coding competition.",
    images: [
      "/projects/born-ai/home.webp",
      "/projects/born-ai/form.webp",
      "/projects/born-ai/result.webp"
    ],
    tech: {
      primary: ["Next.js", "OpenAI", "TailwindCSS"],
      tools: ["React"],
    },
    metrics: [{ label: "Award", value: "2nd Place Winner" }],
    links: {
      demo: "https://born-ai.vercel.app/",
      repo: "https://github.com/Doble-2/herencia",
    },
    role: "Dev Lead",
    dateStart: "2024",
  },
  {
    name: "Appod",
    slug: "appod",
    es: {
      subtitle: "La foto astronómica del día de la NASA, rediseñada alrededor de la fotografía",
      description: "Mi primera app propia, y la que más he pulido. Explora la Astronomy Picture of the Day de la NASA: un calendario donde cada día muestra su foto, un archivo de 30 años, favoritos y vistas a pantalla completa que siguen tu dedo. Funciona sin conexión.",
      role: "Creador",
      metrics: [
        {
          label: "Datos de imagen",
          value: "−98 %"
        },
        {
          label: "Plataformas",
          value: "Web · Android"
        }
      ]
    },
    order: 104,
    subtitle: "NASA's picture of the day, redesigned around the photograph",
    description:
      "A Flutter app for web and Android to explore NASA's Astronomy Picture of the Day. Redesigned in 2026 around the photograph: a calendar where every day shows its picture, an endless archive spanning 30 years, favorites and full-screen views that follow your finger. It reads NASA's real archive, downloads 98% less image data than before and keeps every day it has seen, so it also works offline.",
    images: [
      "/projects/appod/home-2026.webp",
      "/projects/appod/evolution.webp",
      "/projects/appod/mobile-flow-2026.webp",
      "/projects/appod/archive-2026.webp"
    ],
    thumbMobile: "/projects/appod/thumb-mobile.webp",
    tech: {
      primary: ["Flutter", "Dart"],
      tools: ["Firebase", "Vercel", "Python"],
    },
    metrics: [
      { label: "Image data", value: "−98%" },
      { label: "Platforms", value: "Web · Android" },
    ],
    links: {
      demo: "https://appod.angelcalderon.dev/",
      repo: "https://github.com/Doble-2/Appod-AstronomyPictureOfDay",
    },
    role: "Creator",
    dateStart: "2022",
  },
  {
    name: "Onbox",
    slug: "onbox",
    es: {
      subtitle: "Hackatón de 48 h: adopción de mascotas en dos modalidades",
      description: "Hecho en un hackatón de dos días: una web de adopción de mascotas con dos flujos de adopción, en React + Vite.",
      role: "Desarrollador frontend",
      metrics: [
        {
          label: "Tiempo",
          value: "2 días"
        }
      ]
    },
    order: 10,
    hidden: true,
    subtitle: "48h hackathon: two-mode adoption system",
    description:
      "Built during a 2-day hackathon. Shipped a pet adoption web app featuring two adoption flows using React + Vite.",
    images: [
      "/projects/onbox/home.webp",
      "/projects/onbox/adopt.webp"
    ],
    tech: {
      primary: ["React", "Vite"],
      tools: ["Frontend"],
    },
    metrics: [{ label: "Time", value: "2 days" }],
    links: {
      demo: "https://onbox.angelcalderon.dev",
      repo: "https://github.com/raishid/codicon-project",
    },
    role: "Frontend Developer",
    dateStart: "2023",
  },
];
