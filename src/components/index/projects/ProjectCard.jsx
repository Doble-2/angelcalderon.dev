import React from "react";
import { motion } from "framer-motion";

const ProjectCard = ({ project, isActive, onClick }) => {
    const buildIco = (p) =>
        p?.name
            ? `/projects/${encodeURIComponent(p.name)}/ico.png`
            : "/placeholder.svg";

    const activeStyle = isActive && project?.color ? { boxShadow: `0 8px 24px rgba(${project.color},0.12)`, borderColor: `rgba(${project.color},0.18)` } : {};

    return (
        <motion.button
            onClick={onClick}
            title={project.title || project.name}
            aria-pressed={isActive}
            className={`group hover:shadow-xl  bg-white text-left w-auto sm:w-fit rounded-xl p-2 sm:p-3 flex items-center gap-3 sm:gap-4 transition-shadow duration-200 focus:outline-none min-h-[44px]`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            style={{ border: '1px solid rgba(0,0,0,0.06)', ...activeStyle }}
        >
            <img
                src={buildIco(project)}
                alt={project.title || project.name}
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain flex-shrink-0 bg-background/50 rounded-md"
            />

                    {/* ocultar textos en pantallas móviles para tarjetas más compactas */}
                    <div className="hidden sm:flex flex-1 min-w-0">
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
