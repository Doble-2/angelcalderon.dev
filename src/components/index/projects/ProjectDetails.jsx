import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Eye } from "lucide-react";
import I18N from "../../../i18n";
import TechnologyTag from "./TechnologyTag";

const ProjectDetails = ({ project, onNext, lang = "es", labels = {} }) => {
  if (!project) return null;

  const t = (k) => {
    if (labels && labels[k]) return labels[k];
    if (I18N && I18N[lang] && I18N[lang][k]) return I18N[lang][k];
    return k;
  };

  const buildImage = (p) =>
    p?.images?.[0]
      ? `/projects/${encodeURIComponent(p.name)}/${encodeURIComponent(
          p.images[0]
        )}`
      : "/placeholder.svg";

  const demoUrl =
    project.demo || project.deployed || project.link || project.url || "#";

  // accent color from project.color (expected format: "R G B", e.g. "255 255 255")
  const accentVals = project?.color
    ? project.color.replace(/\s+/g, ",")
    : "59,130,246";
  const glowColor = `rgba(${accentVals}, 0.08)`;
  const borderAccent = `rgba(${accentVals}, 0.12)`;
  const highlightBg = `radial-gradient(circle at 20% 10%, rgba(${accentVals}, 0.12), rgba(${accentVals}, 0.04) 30%, transparent 50%)`;

  return (
    <motion.div
      key={project.id || project.name}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32, ease: "easeInOut" }}
      style={{
        boxShadow: `0 10px 30px ${glowColor}`,
        borderColor: borderAccent,
      }}
      className="relative max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 border"
    >
      <div className="md:flex">
        {/* subtle radial highlight using project color */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-56 h-56 rounded-full blur-3xl opacity-60"
          style={{ background: highlightBg }}
        />
        {/* Left: Image hero */}
        <div className="md:w-1/3 w-full bg-white ">
          <div className="relative h-56 md:h-full md:min-h-[260px] lg:min-h-[320px]">
            <img
              src={buildImage(project)}
              alt={project.title || project.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute left-4 bottom-4">
              {project.category && (
                <span className="hidden md:inline-block text-xs bg-white text-slate-900 px-3 py-1 rounded-full font-semibold shadow-sm">
                  {project.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900 ">
                {project.name}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {project.role && (
                <div className="text-xs text-muted-foreground text-right">
                  <div className="uppercase font-semibold text-[10px] tracking-wider text-slate-500">
                    {t("role")}
                  </div>
                  <div className="font-medium text-slate-900 ">
                    {project.role}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-700  leading-relaxed">
            {project.description}
          </p>

          <div className="mt-6">
            <h3 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-3">
              {t("technologies_used")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(project.front || project.technologies || []).map((tech) => (
                <TechnologyTag key={tech} tech={tech} />
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="uppercase text-[11px] font-semibold tracking-wider mb-1">
                {t("project_dates")}
              </div>
              <div className="font-medium text-slate-900 ">
                {project.dateStart || "--"} — {project.dateEnd || "--"}
              </div>
            </div>
            <div>
              <div className="uppercase text-[11px] font-semibold tracking-wider mb-1">
                {t("duration")}
              </div>
              <div className="font-medium text-slate-900 ">
                {project.duration || "--"}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100  flex flex-wrap items-center gap-3">
            <a
              className="inline-flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-blue-500 transition"
              href={`/projects/${encodeURIComponent(
                project.id || project.name
              )}`}
            >
              <Eye size={16} />
              {t("view_details_page")}
            </a>
            <a
              className="inline-flex items-center gap-2 border border-blue-500 text-blue-500 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} />
              {t("view_demo")}
            </a>
            <button
              onClick={onNext}
              className="ml-auto inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors group"
              title={t("next_project")}
            >
              {t("next")}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetails;
