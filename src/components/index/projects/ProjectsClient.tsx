import React, { useState, useEffect, useMemo } from "react";
import I18N from "../../../i18n";
import { AnimatePresence } from "framer-motion";
import ProjectDetails from "./ProjectDetails.jsx";
import ProjectCard from "./ProjectCard.jsx";

export default function ProjectsClient({
  projects = [],
  labels = {},
  lang = "es",
}) {
  // Helper de traducción: usa `labels` prop primero, luego el i18n del proyecto
  const t = (k) => {
    if (labels && labels[k]) return labels[k];
    if (I18N && I18N[lang] && I18N[lang][k]) return I18N[lang][k];
    return k;
  };
  // Asegurarse de que siempre haya proyectos para mostrar, usando datos de ejemplo si es necesario
  const effectiveProjects = useMemo(() =>
    projects && projects.length ? projects :  [],
    [projects]
  );
  
  const [active, setActive] = useState(0);

  // Navegación con teclado para accesibilidad
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setActive((prev) => (prev + 1) % effectiveProjects.length);
      } else if (e.key === "ArrowLeft") {
        setActive((prev) => (prev - 1 + effectiveProjects.length) % effectiveProjects.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [effectiveProjects.length]);
  
  const activeProject = effectiveProjects[active] || null;

  const handleNextProject = () => {
    setActive((prev) => (prev + 1) % effectiveProjects.length);
  };

  if (!effectiveProjects.length) {
    return (
      <div className="p-8 text-center bg-muted/50 rounded-xl">
        <h3 className="font-semibold">{t("no_projects_found")}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t("no_projects_found_desc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Selector de Proyectos */}
      <div className="flex overflow-x-auto space-x-4 p-2 snap-x snap-mandatory items-center justify-center">
        {effectiveProjects.map((p, idx) => (
          <ProjectCard
            key={p.id || p.name}
            project={p}
            isActive={active === idx}
            onClick={() => setActive(idx)}
          />
        ))}
      </div>

      {/* Vista Detallada del Proyecto Activo */}
      <AnimatePresence mode="wait">
        <ProjectDetails
          project={activeProject}
          onNext={handleNextProject}
          labels={labels}
          lang={lang}
        />
      </AnimatePresence>
    </div>
  );
}