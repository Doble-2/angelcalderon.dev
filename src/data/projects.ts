export type ProjectTeam = {
  name: string;
  members: string[];
};

export type Project = {
  name: string;
  order: number;

  color?: string; // "R G B"
  dateStart?: string; // dd/mm/yyyy
  dateEnd?: string; // dd/mm/yyyy

  description: string;
  front?: string[];
  back?: string[] | null;
  images?: string[];

  role?: string;
  type?: string;
  url?: string;
  repo?: string;
  win?: string;
  team?: ProjectTeam;
};

export const projects: Project[] = [
  {
    name: "Appod",
    order: 10,
    color: "51 145 255",
    dateStart: "10/01/2024",
    dateEnd: "17/08/2025",
    description:
      "APPOD es mi proyecto personal más preciado: una aplicación móvil que consume la API APOD de la NASA para ver y descargar imágenes astronómicas históricas. Desarrollada con Flutter (Frontend) y un Backend ligero en Python, ofrece Login con Firebase y funcionalidad completa. Superó las 500 solicitudes en su primera semana y está a esperas para publicarse en Play Store",
    front: ["flutter"],
    back: ["python"],
    images: ["home.webp", "apod.webp", "settings.png", "load.webp"],
    role: "Mobile Developer",
    type: "aplicación",
    url: "https://appod.angelcalderon.dev/",
    repo: "https://github.com/Doble-2/apod-nasa",
  },
  {
    name: "Born AI",
    order: 9,
    color: "125 157 175",
    dateStart: "15/03/2024",
    dateEnd: "17/03/2024",
    description:
      "El proyecto consistió en el desarrollo de una innovadora aplicación web que utiliza la inteligencia artificial para realizar predicciones genéticas. Utilizando Next.js para el framework de desarrollo y la API de OpenAI para el procesamiento de datos, nuestro equipo creó una interfaz donde los usuarios pueden ingresar información detallada sobre sus antecedentes familiares y los de su pareja. Esta información se procesa a través de ChatGPT, que actúa como un motor de predicción, analizando los datos para proporcionar una estimación de las características genéticas de un posible hijo. Este enfoque pionero en la genética predictiva nos valió el segundo lugar en una competición de codificación de alto perfil, destacando por su creatividad y aplicación práctica de la IA en la vida cotidiana.",
    front: ["nextjs", "react", "tailwindcss"],
    back: null,
    images: ["home.webp", "init.webp", "form.webp", "result.webp"],
    role: "Dev Lead",
    type: "Página web",
    url: "https://born-ai.vercel.app/",
    repo: "https://github.com/Doble-2/herencia",
  },
  {
    name: "Onbox",
    order: 6,
    color: "255 255 255",
    dateStart: "10/03/2023",
    dateEnd: "12/03/2023",
    description:
      "Este proyecto fue desarrollado como parte de una hackathon de 2 días llamada 'CODICON', en la que la temática era 'caja'. Mi equipo y yo trabajamos en desarrollar una página de adopciones de perritos con dos modalidades de adopción. Se utilizaron tecnologías como React.js y Vite.js en el frontend. Aunque el equipo de backend trabajó con Python, no pudimos conectar el frontend con el backend a tiempo para la presentación en la hackathon. Mi participación en el proyecto fue como desarrollador frontend.",
    front: ["react", "vitejs"],
    back: null,
    images: ["home.jpg", "adopt.jpg"],
    role: "Frontend Developer",
    type: "Página web",
    url: "https://onbox.angelcalderon.dev",
    repo: "https://github.com/raishid/codicon-project",
    win:
      "Como desarrollador frontend, logre completar exitosamente la página web en un tiempo limitado y bajo presión. También mejore mi ritmo de programación y desarrolle habilidades importantes en comunicación y trabajo en equipo al colaborar con otros miembros del equipo de desarrollo. Además, aprendí a adaptarme rápidamente a nuevas situaciones y a trabajar eficientemente en plazos ajustados.",
    team: { name: "Pixel Perfect", members: ["Fededav"] },
  },
];

export function getProjects(): Project[] {
  return [...projects].sort((a, b) => b.order - a.order);
}

export function getProjectByName(name: string): Project | undefined {
  const raw = (name || "").trim();
  return projects.find((p) => p.name === raw);
}
