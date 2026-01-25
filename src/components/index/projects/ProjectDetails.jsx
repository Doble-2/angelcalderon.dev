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

  // --- Date helpers -------------------------------------------------
  const safeDate = (d) => {
    if (!d) return null;
    // If it's already a Date
    if (d instanceof Date && !isNaN(d)) return d;
    // If it's a string, try multiple formats
    if (typeof d === "string") {
      const s = d.trim();
      // Accept dd/mm/yyyy or d/m/yyyy
      const dmY = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      if (dmY.test(s)) {
        const [dd, mm, yyyy] = s.split("/").map((x) => parseInt(x, 10));
        // JS Date months are 0-based
        const parsed = new Date(yyyy, mm - 1, dd);
        if (!isNaN(parsed)) return parsed;
      }
      // Try direct ISO-like parse (YYYY-MM or YYYY-MM-DD or full ISO)
      const tryDirect = new Date(s);
      if (!isNaN(tryDirect)) return tryDirect;
      // YYYY-MM -> add day
      if (/^\d{4}-\d{2}$/.test(s)) return new Date(s + "-01");
      // YYYY -> add month/day
      if (/^\d{4}$/.test(s)) return new Date(s + "-01-01");
    }
    return null;
  };

  const formatDate = (dRaw) => {
    const d = safeDate(dRaw);
    if (!d) return "--";
    try {
      // Always display as dd/mm/yyyy per request
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch (e) {
      return d.toLocaleDateString();
    }
  };

  const computeDuration = (startRaw, endRaw) => {
    const start = safeDate(startRaw);
    const end = safeDate(endRaw) || new Date();
    if (!start) return null;
    // ensure chronological
    let earlier = start;
    let later = end;
    if (later < earlier) {
      earlier = end;
      later = start;
    }
    // compute months difference
    let months = (later.getFullYear() - earlier.getFullYear()) * 12 + (later.getMonth() - earlier.getMonth());
    if (later.getDate() < earlier.getDate()) months -= 1;
    if (months < 0) months = 0;

    // If less than 1 month, compute days (inclusive)
    if (months === 0) {
      // normalize times to midnight to avoid DST/timezone issues
      const startMid = new Date(earlier.getFullYear(), earlier.getMonth(), earlier.getDate());
      const endMid = new Date(later.getFullYear(), later.getMonth(), later.getDate());
      const msPerDay = 24 * 60 * 60 * 1000;
      const days = Math.round((endMid - startMid) / msPerDay) + 1; // inclusive count
      if (days <= 1) return lang === "en" ? "1 day" : "1 día";
      return lang === "en" ? `${days} days` : `${days} días`;
    }

    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? (lang === "en" ? "year" : "año") : (lang === "en" ? "years" : "años")}`);
    if (remMonths > 0) parts.push(`${remMonths} ${remMonths === 1 ? (lang === "en" ? "month" : "mes") : (lang === "en" ? "months" : "meses")}`);
    if (parts.length === 0) return lang === "en" ? "Less than a month" : "Menos de un mes";
    return parts.join(", ");
  };

  const computedDuration = computeDuration(project.dateStart, project.dateEnd);
  const displayDuration = project.duration || computedDuration || "--";

  // Use formatted dates for display
  const formattedStart = formatDate(project.dateStart);
  const formattedEnd = project.dateEnd ? formatDate(project.dateEnd) : "--";

  // accent color from project.color (expected format: "R G B", e.g. "255 255 255")
  const accentVals = project?.color
    ? project.color.replace(/\s+/g, ",")
    : "59,130,246";
  const glowColor = `rgba(${accentVals}, 0.08)`;
  const borderAccent = `rgba(${accentVals}, 0.12)`;
  const highlightBg = `radial-gradient(circle at 20% 10%, rgba(${accentVals}, 0.12), rgba(${accentVals}, 0.04) 30%, transparent 50%)`;

  const technologies = Array.from(
    new Set([...(project.front || []), ...(project.back || [])].filter(Boolean))
  );

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
      className="theme-light relative max-w-4xl mx-auto bg-background text-foreground rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 border border-border"
    >
      <div className="md:flex">
        {/* subtle radial highlight using project color */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-56 h-56 rounded-full blur-3xl opacity-60"
          style={{ background: highlightBg }}
        />
        {/* Left: Image hero */}
        <div className="md:w-1/3 w-full bg-background">
          <div className="relative h-56 md:h-full md:min-h-[260px] lg:min-h-[320px]">
            <img
              src={buildImage(project)}
              alt={project.title || project.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute left-4 bottom-4">
              {project.category && (
                <span className="hidden md:inline-block text-xs bg-background text-foreground px-3 py-1 rounded-full font-semibold shadow-sm border border-border">
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
              <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                {project.name}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {project.role && (
                <div className="text-xs text-muted-foreground text-right">
                  <div className="uppercase font-semibold text-[10px] tracking-wider text-muted-foreground">
                    {t("role")}
                  </div>
                  <div className="font-medium text-foreground">
                    {project.role}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          <div className="mt-6">
            <h3 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-3">
              {t("technologies_used")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <TechnologyTag key={tech} tech={tech} />
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="uppercase text-[11px] font-semibold tracking-wider mb-1">
                {t("project_dates")}
              </div>
              <div className="font-medium text-foreground">
                {formattedStart} — {formattedEnd}
              </div>
            </div>
            <div>
              <div className="uppercase text-[11px] font-semibold tracking-wider mb-1">
                {t("duration")}
              </div>
              <div className="font-medium text-foreground">
                {displayDuration}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-3">
            <a
              className="btn btn-primary btn-sm"
              href={`/projects/${encodeURIComponent(
                project.name
              )}`}
            >
              <Eye size={16} />
              {t("view_details_page")}
            </a>
            <a
              className="btn btn-secondary btn-sm"
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} />
              {t("view_demo")}
            </a>
            <button
              onClick={onNext}
              className="btn btn-ghost btn-sm ml-auto group"
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
