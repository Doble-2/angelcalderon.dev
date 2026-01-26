export type Project = {
  name: string;
  slug: string;
  order: number;
  subtitle: string;
  description: string;
  images: string[];
  tech: { primary: string[]; tools?: string[] };
  metrics?: { label: string; value: string }[];
  links?: { demo?: string; repo?: string };
  role: string;
  dateStart: string;
};

export const projects: Project[] = [
  {
    name: "OSINT-D2",
    slug: "osint-d2",
    order: 96,
    subtitle: "AI-Powered Identity Intelligence Engine",
    description:
      "An automated Open Source Intelligence (OSINT) engine that triangulates digital footprints across 113+ platforms and leverages DeepSeek LLM to generate psychological profiles (OCEAN) and vulnerability assessments.",
    images: [
      "/projects/osint-d2/osint-terminal.png",
      "/projects/osint-d2/osint-report-pdf.png"
    ],
    tech: {
      primary: ["Python", "Cybersecurity", "AI Agents"],
      tools: ["DeepSeek API", "WeasyPrint", "Sherlock Core", "AsyncIO"],
    },
    metrics: [
      { label: "Data Sources", value: "113+" },
      { label: "Output", value: "PDF Dossier" },
    ],
    links: {
      repo: "https://github.com/Doble-2/osint-d2",
    },
    role: "Security Engineer & Creator",
    dateStart: "2025",
  },
  {
    name: "Eficense Residence",
    slug: "eficense",
    order: 100,
    subtitle: "IoT & AI Security Ecosystem",
    description:
      "A comprehensive residential management platform bridging physical security hardware with modern cloud architecture. Designed to automate visitor access and streamline complex financial reporting for large-scale condominiums.",
    images: [
      "/projects/eficense/dashboard.png",
      "/projects/eficense/telegram.png",
      "/projects/eficense/finances.png",
      "/projects/eficense/docs.png"
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
    dateStart: "2024",
  },
  {
    name: "Studia",
    slug: "studia",
    order: 99,
    subtitle: "AI-Powered EdTech SaaS",
    description:
      "An omnichannel AI tutoring ecosystem designed for schools. It ingests institutional data to create personalized RAG agents for students, accessible directly via WhatsApp.",
    images: [
        "/projects/studia/mobile-flow.png",
      "/projects/studia/dashboardadmin.png",
      "/projects/studia/light-dark.png",
      "/projects/studia/dashboardowner.png",
      "/projects/studia/chatbot.png",
      "/projects/studia/quizes.png",
      "/projects/studia/themes.png"
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
      "/projects/scenery/scenery-terminal.png",
      "/projects/scenery/scenery-search.png"
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
    order: 55,
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
    subtitle: "APOD explorer: NASA in your pocket",
    description:
      "A Flutter mobile app that integrates NASA’s APOD API to browse and download astronomy images, backed by a lightweight Python backend.",
    images: [
      "/projects/appod/flow.png",
      "/projects/appod/home.webp",
      "/projects/appod/apod.webp",
      "/projects/appod/load.webp"
    ],
    tech: {
      primary: ["Flutter", "Python"],
      tools: ["Firebase"],
    },
    metrics: [{ label: "Adoption", value: "500+ requests" }],
    links: {
      demo: "https://appod.angelcalderon.dev/",
      repo: "https://github.com/Doble-2/Appod-AstronomyPictureOfDay",
    },
    role: "Mobile Developer",
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
      "/projects/onbox/home.jpg",
      "/projects/onbox/adopt.jpg"
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
