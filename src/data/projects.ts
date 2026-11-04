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
};

export const projects: Project[] = [
  {
    name: "Andolimpio",
    slug: "andolimpio",
    order: 104,
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
    order: 110,
    subtitle: "Autonomous AI agent for identity investigation",
    description:
      "Give it a username or email: an AI agent scans 20+ platforms, finds new leads, pivots on them on its own and delivers an evidence-based profile as a PDF dossier (6 dimensions, 3 of them opt-in because they are sensitive). Open source, Docker-ready, with the AI able to run locally via Ollama.",
    images: [
      "/projects/osint-d2/agent-run.webp",
      "/projects/osint-d2/trust-anchors.webp",
      "/projects/osint-d2/dossier.webp",
      "/projects/osint-d2/doctor.webp"
    ],
    tech: {
      primary: ["Python", "AI Agents", "Cybersecurity"],
      tools: ["FastAPI", "Typer", "Playwright", "WeasyPrint", "Docker", "Ollama"],
    },
    metrics: [
      { label: "Agent tools", value: "9" },
      { label: "Tests", value: "547" },
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
    order: 99,
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
    order: 60,
    subtitle: "NASA's picture of the day, redesigned around the photograph",
    description:
      "A Flutter app for web and Android to explore NASA's Astronomy Picture of the Day. Redesigned in 2026 around the photograph: a calendar where every day shows its picture, an endless archive spanning 30 years, favorites and full-screen views that follow your finger. It reads NASA's real archive, downloads 98% less image data than before and keeps every day it has seen, so it also works offline.",
    images: [
      "/projects/appod/home-2026.webp",
      "/projects/appod/mobile-flow-2026.webp"
    ],
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
    dateStart: "2024",
  },
  {
    name: "Onbox",
    slug: "onbox",
    order: 50,
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
