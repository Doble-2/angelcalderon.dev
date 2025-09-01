import React, { useState } from "react";

const SAMPLE_PROJECTS = [
  {
    id: "appod",
    name: "Appod",
    title: "Appod",
    image: "/covers/Appod.png",
    images: ["Appod.png"],
    description: "Interfaz de APOD con calendario y visualizaciones.",
    category: "Data",
    year: "2024",
    duration: "2 meses",
    color: "#0ea5e9",
    technologies: ["Astro", "Tailwind"],
  },
  {
    id: "born-ai",
    name: "Born AI",
    title: "Born AI",
    image: "/covers/Born AI.png",
    images: ["Born AI.png"],
    description: "Generador de imágenes con IA y UX optimizado.",
    category: "AI",
    year: "2024",
    duration: "1 mes",
    color: "#7c3aed",
    technologies: ["React", "Tailwind"],
  },
  {
    id: "onbox",
    name: "Onbox",
    title: "Onbox",
    image: "/covers/Onbox.png",
    images: ["Onbox.png"],
    description: "Plataforma de adopción con interfaz moderna.",
    category: "Web",
    year: "2023",
    duration: "3 meses",
    color: "#f97316",
    technologies: ["Next.js", "Firebase"],
  },
];

export default function ProjectsClient({
  projects = [],
  labels = {},
  lang = "es",
}) {
  const t = (k) => labels[k] || k;
  const effectiveProjects =
    projects && projects.length ? projects : SAMPLE_PROJECTS;
  const [active, setActive] = useState(0);
  const activeProject = effectiveProjects[active] || null;

  const buildImage = (p) => {
    if (!p || !p.images || !p.images[0]) return "/placeholder.svg";
    return `/projects/${encodeURIComponent(p.name)}/${encodeURIComponent(
      p.images[0]
    )}`;
  };

  try {
    // Debug info in case of client errors
    if (typeof window !== "undefined") {
      try {
        window.__PROJECTS_DEBUG__ = {
          effectiveProjectsLength: effectiveProjects.length,
        };
      } catch (e) {}
      console.debug("ProjectsClient effectiveProjects:", effectiveProjects);
    }

    return (
      <div>
        <div className="grid lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-8">
            {activeProject ? (
              <div className="relative group">
                <div
                  className="absolute inset-0 rounded-3xl blur-xl opacity-50 transition-all duration-700"
                  style={{
                    background: `linear-gradient(135deg, ${
                      activeProject.color || "#0000"
                    } 0%, transparent 60%)`,
                  }}
                />
                <div className="relative neomorphic hover:shadow-2xl transition-all duration-700 overflow-hidden border-0 bg-background/80 backdrop-blur-sm rounded-2xl">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={buildImage(activeProject)}
                      alt={activeProject.title || activeProject.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-6 right-6 flex gap-3">
                      <a
                        className="inline-flex items-center justify-center bg-white/20 backdrop-blur-md border-white/20 text-white rounded-full p-2"
                        href={activeProject.link || "#"}
                      >
                        🔗
                      </a>
                      <a
                        className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border-white/30 text-white rounded-full p-2"
                        href={activeProject.repo || "#"}
                      >
                        💻
                      </a>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm">
                          {activeProject.category}
                        </span>
                        <span className="text-white/70 text-sm">
                          {activeProject.year} • {activeProject.duration}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {activeProject.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {activeProject.description}
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-primary">
                          {t("challenge")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {activeProject.challenge}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">
                          {t("solution")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {activeProject.solution}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">
                          {t("impact")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {activeProject.impact}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <a
                        className="flex-1 neomorphic bg-blue-600 text-white py-3 px-4 rounded-full text-center"
                        href={activeProject.case || "#"}
                      >
                        {t("viewCase")}
                      </a>
                      <a
                        className="outline-button border rounded-full px-4 py-2"
                        href={activeProject.demo || "#"}
                      >
                        {t("liveDemo")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-gray-800 rounded-xl">No projects</div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-semibold mb-6">Otros Proyectos</h3>
            {effectiveProjects.map((p, idx) => (
              <div
                key={idx}
                className={`cursor-pointer transition-all duration-300 ${
                  active === idx
                    ? "ring-2 ring-primary shadow-lg scale-105"
                    : "hover:scale-102"
                }`}
                onClick={() => setActive(idx)}
              >
                <div className="p-4 flex gap-4">
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={p.title || p.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1 truncate">
                      {p.title || p.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {p.description}
                    </p>
                    <span className="inline-block text-xs bg-muted/30 px-2 py-1 rounded">
                      {p.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  } catch (err) {
    console.error("ProjectsClient render error:", err);
    return (
      <div className="p-8 bg-red-800 text-white rounded">
        <strong>Error al cargar proyectos.</strong>
        <div className="text-sm mt-2">Revisa la consola para más detalles.</div>
      </div>
    );
  }
}
