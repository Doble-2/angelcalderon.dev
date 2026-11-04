// Experiencia laboral, de la más reciente a la más antigua (fuente: perfil de LinkedIn).
type L = { es: string; en: string };

export type Job = {
  company: string;
  role: L;
  period: L;
  mode: L;
  description: L;
  tags: string[];
};

export const jobs: Job[] = [
  {
    company: "TecnoRed",
    role: { es: "Programador Full Stack", en: "Full Stack Developer" },
    period: { es: "Mar. 2026 — Presente", en: "Mar 2026 — Present" },
    mode: { es: "Jornada completa · Presencial", en: "Full-time · On-site" },
    description: {
      es: "Automaticé nómina y liquidaciones, reduciendo el tiempo de procesamiento un 85 %. Llevo los flujos de solicitudes, permisos, suplencias y vacaciones de una gran empresa de recolección de desechos, y construí un microservicio de nómina con permisos granulares por cliente.",
      en: "Automated payroll and settlements, cutting processing time by 85%. I run the request, leave, substitution and vacation workflows for a large waste-collection company, and built a payroll microservice with granular per-client permissions.",
    },
    tags: ["Microservices", "Software architecture", "Automation"],
  },
  {
    company: "Rolapro",
    role: { es: "Desarrollador de aplicaciones móviles", en: "Mobile App Developer" },
    period: { es: "May. 2026 — Oct. 2026", en: "May 2026 — Oct 2026" },
    mode: { es: "Medio tiempo · Remoto", en: "Part-time · Remote" },
    description: {
      es: "Desarrollé MVPs y aplicaciones móviles para iOS y Android para clientes nacionales importantes.",
      en: "Built MVPs and mobile apps for iOS and Android for major national clients.",
    },
    tags: ["iOS", "Android", "MVPs"],
  },
  {
    company: "Eficense Residence",
    role: { es: "Lead Full Stack Developer", en: "Lead Full Stack Developer" },
    period: { es: "Oct. 2025 — Mar. 2026", en: "Oct 2025 — Mar 2026" },
    mode: { es: "Independiente · Remoto (México)", en: "Freelance · Remote (Mexico)" },
    description: {
      es: "Diseñé un ecosistema de seguridad residencial que une hardware IoT con una capa de orquestación con IA, y agentes LLM que automatizan las visitas y las finanzas.",
      en: "Architected a residential security ecosystem that bridges IoT hardware with an AI orchestration layer, plus LLM agents that automate visitor management and finances.",
    },
    tags: ["IoT", "LLM agents", "Next.js", "FastAPI"],
  },
  {
    company: "Crypto Portfolio",
    role: { es: "Frontend Web Developer", en: "Frontend Web Developer" },
    period: { es: "Mar. 2025 — Oct. 2025", en: "Mar 2025 — Oct 2025" },
    mode: { es: "Jornada completa · Remoto", en: "Full-time · Remote" },
    description: {
      es: "Construí pantallas y componentes de una plataforma de carteras cripto, integré datos de mercado de CoinGecko y TradingView, y los pagos y suscripciones con Stripe.",
      en: "Built screens and components for a crypto portfolio platform, integrated market data from CoinGecko and TradingView, and payments and subscriptions with Stripe.",
    },
    tags: ["Next.js", "TypeScript", "Stripe", "TanStack Query"],
  },
  {
    company: "Deepcompany",
    role: { es: "Semi-Senior Mobile Developer", en: "Semi-Senior Mobile Developer" },
    period: { es: "Feb. 2024 — Jul. 2024", en: "Feb 2024 — Jul 2024" },
    mode: { es: "Contrato temporal · Remoto", en: "Contract · Remote" },
    description: {
      es: "Desarrollé apps móviles en Flutter para clientes líderes en sus industrias, con foco en experiencia de usuario y rendimiento.",
      en: "Built Flutter mobile apps for industry-leading clients, focused on user experience and performance.",
    },
    tags: ["Flutter", "Dart"],
  },
  {
    company: "Over Group",
    role: { es: "Frontend Developer", en: "Frontend Developer" },
    period: { es: "Jul. 2023 — Dic. 2023", en: "Jul 2023 — Dec 2023" },
    mode: { es: "Independiente · Remoto (España)", en: "Freelance · Remote (Spain)" },
    description: {
      es: "Frontend con Flutter, Next.js, TypeScript y Tailwind para proyectos del mundo cripto.",
      en: "Frontend work with Flutter, Next.js, TypeScript and Tailwind on crypto projects.",
    },
    tags: ["Flutter", "Next.js", "Tailwind CSS"],
  },
  {
    company: "COLPIXTEC",
    role: { es: "Programador Junior", en: "Junior Developer" },
    period: { es: "Abr. 2022 — Dic. 2023", en: "Apr 2022 — Dec 2023" },
    mode: { es: "Contrato de formación · Híbrido", en: "Apprenticeship · Hybrid" },
    description: {
      es: "Desarrollé el frontend y el backend de EnviosFarma, una startup de envíos de farmacia, con JavaScript, PHP y MySQL.",
      en: "Built the frontend and backend of EnviosFarma, a pharmacy delivery startup, with JavaScript, PHP and MySQL.",
    },
    tags: ["JavaScript", "PHP", "MySQL"],
  },
];
