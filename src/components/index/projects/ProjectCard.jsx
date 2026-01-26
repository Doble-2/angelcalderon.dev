import React from "react";
import { motion } from "framer-motion";

const ProjectCard = ({ project, isActive, onClick }) => {
    const buildIco = (p) =>
        (p?.slug || p?.name)
            ? `/projects/${encodeURIComponent(String(p.slug || p.name))}/ico.webp`
            : "/placeholder.svg";

    const accentVals = project?.color ? String(project.color).replace(/\s+/g, ",") : null;
    const activeStyle =
        isActive && accentVals
            ? {
                  boxShadow: `0 14px 44px rgba(${accentVals},0.18)`,
                  borderColor: `rgba(${accentVals},0.28)`,
              }
            : {};

    return (
        <motion.button
            onClick={onClick}
            type="button"
            title={project.title || project.name}
            aria-pressed={isActive}
            className={`projects-tab group text-left w-auto sm:w-fit p-2 sm:p-3 flex items-center gap-3 sm:gap-4 min-h-[44px]`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            style={{ ...activeStyle }}
        >
            <img
                src={buildIco(project)}
                alt={project.title || project.name}
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain flex-shrink-0 bg-white/5 border border-white/10 rounded-md p-1"
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                    // fallback si el proyecto no tiene ico.webp
                    e.currentTarget.src = "/placeholder.svg";
                }}
            />

                    {/* ocultar textos en pantallas móviles para tarjetas más compactas */}
                    <div className="hidden sm:flex flex-col flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-md truncate text-foreground">
                            {project.title || project.name}
                        </h4>
                        {project.subtitle && (
                            <p className="mt-0.5 text-xs text-muted-foreground truncate">{project.subtitle}</p>
                        )}
                    </div>
        </motion.button>
    );
};

export default ProjectCard;
