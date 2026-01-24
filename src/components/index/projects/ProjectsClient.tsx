import React, { useEffect, useMemo, useState } from "react";
import I18N from "../../../i18n";
import { AnimatePresence } from "framer-motion";
import ProjectDetails from "./ProjectDetails.jsx";
import ProjectCard from "./ProjectCard.jsx";

type ProjectLike = {
  id?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  order?: number | string | null;
  [key: string]: unknown;
};

type Labels = Record<string, string>;

export default function ProjectsClient({
  projects = [],
  labels = {},
  lang = "es",
}: {
  projects?: ProjectLike[];
  labels?: Labels;
  lang?: "es" | "en" | string;
}) {
  // Helper de traducción: usa `labels` prop primero, luego el i18n del proyecto
  const t = (k: string) => {
    if (labels && labels[k]) return labels[k];
    if (I18N && I18N[lang] && I18N[lang][k]) return I18N[lang][k];
    return k;
  };
  // Asegurarse de que siempre haya proyectos para mostrar, usando datos de ejemplo si es necesario
  const effectiveProjects = useMemo(() => {
    if (!projects || !projects.length) return [];
    // Orden: mayor 'order' primero.
    // 'order' puede venir como string: convertir a número.
    // Si no es parseable -> usar -Infinity para que quede al final.
    const toOrderNumber = (val: unknown) => {
      if (val === null || val === undefined) return -Infinity;
      if (typeof val === "number" && !isNaN(val)) return val;
      if (typeof val === "string") {
        const trimmed = val.trim();
        if (!trimmed) return -Infinity;
        const num = Number(trimmed);
        return isNaN(num) ? -Infinity : num;
      }
      return -Infinity;
    };
    return [...projects].sort((a, b) => {
      const ao = toOrderNumber(a.order);
      const bo = toOrderNumber(b.order);
      if (bo !== ao) return bo - ao; // descendente
      const an = String(a.name || "").toLowerCase();
      const bn = String(b.name || "").toLowerCase();
      return an.localeCompare(bn);
    });
  }, [projects]);
  
  const [active, setActive] = useState(0);

  // Si cambia la lista y el índice queda fuera de rango, resetea.
  useEffect(() => {
    if (effectiveProjects.length === 0) return;
    if (active >= effectiveProjects.length) setActive(0);
  }, [active, effectiveProjects.length]);
  
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (effectiveProjects.length === 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((prev) => (prev + 1) % effectiveProjects.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((prev) => (prev - 1 + effectiveProjects.length) % effectiveProjects.length);
    }
  };

  return (
    <div
      className="space-y-8"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={t("projects")}
    >
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