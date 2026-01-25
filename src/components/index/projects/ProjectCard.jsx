import React from "react";
import { motion } from "framer-motion";

const ProjectCard = ({ project, isActive, onClick }) => {
    const buildIco = (p) =>
        p?.name
            ? `/projects/${encodeURIComponent(p.name)}/ico.png`
            : "/placeholder.svg";

    const accentVals = project?.color ? String(project.color).replace(/\s+/g, ",") : null;
    const activeStyle = isActive && accentVals ? { boxShadow: `0 8px 24px rgba(${accentVals},0.12)`, borderColor: `rgba(${accentVals},0.18)` } : {};

    return (
        <motion.button
            onClick={onClick}
            type="button"
            title={project.title || project.name}
            aria-pressed={isActive}
            className={`theme-light group bg-white/95 hover:bg-white text-left w-auto sm:w-fit rounded-xl p-2 sm:p-3 flex items-center gap-3 sm:gap-4 transition-all duration-200 min-h-[44px] shadow-sm hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-black/60`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            style={{ border: '1px solid rgba(0,0,0,0.06)', ...activeStyle }}
        >
            <img
                src={buildIco(project)}
                alt={project.title || project.name}
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain flex-shrink-0 bg-background/50 rounded-md"
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
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
