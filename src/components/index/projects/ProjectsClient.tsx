import React, { useEffect, useMemo, useState } from "react";
import I18N from "../../../i18n";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Eye, X } from "lucide-react";
import TechnologyTag from "./TechnologyTag";

type ProjectLike = {
  id?: string;
  name?: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  order?: number | string | null;
  links?: { demo?: string; live?: string; repo?: string };
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

  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  // Si cambia la lista y el id abierto ya no existe, resetea.
  useEffect(() => {
    if (!openProjectId) return;
    const stillExists = effectiveProjects.some(
      (p) => String(p.id ?? p.name) === openProjectId,
    );
    if (!stillExists) setOpenProjectId(null);
  }, [openProjectId, effectiveProjects]);

  const buildImage = (p: any) => {
    const first = p?.images?.[0];
    if (!first) return "/placeholder.svg";
    const s = String(first);
    if (s.startsWith("http") || s.startsWith("/")) return s;
    const folder = encodeURIComponent(String(p?.slug || p?.name || ""));
    return `/projects/${folder}/${encodeURIComponent(s)}`;
  };

  const toAccentSpaces = (raw: unknown) => {
    if (!raw) return "59 130 246";
    const asString = String(raw).trim();
    // expected: "R G B" or similar
    const normalized = asString.replace(/,+/g, " ").replace(/\s+/g, " ");
    return normalized || "59 130 246";
  };

  const getDemoUrl = (p: any) =>
    p?.links?.demo ||
    p?.links?.live ||
    p?.demo ||
    p?.deployed ||
    p?.link ||
    p?.url ||
    "#";

  const getSlug = (p: any) => {
    const explicit = String(p?.slug || "").trim();
    if (explicit) return explicit;
    const n = String(p?.name || "").trim();
    return n
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const formatStatus = (statusRaw: unknown) => {
    const s = String(statusRaw || "").trim();
    if (!s) return null;
    const normalized = s.toLowerCase();
    const map: Record<string, { es: string; en: string }> = {
      shipped: { es: "Entregado", en: "Shipped" },
      "in-progress": { es: "En progreso", en: "In progress" },
      archived: { es: "Archivado", en: "Archived" },
    };
    const item = map[normalized];
    if (!item) return s;
    return lang === "en" ? item.en : item.es;
  };

  const getMetrics = (p: any) =>
    (Array.isArray(p?.metrics) ? p.metrics : []) as Array<{
      label: string;
      value: string;
      note?: string;
    }>;

  const getTechnologies = (p: any) => {
    const legacy = [...(p?.front || []), ...((p?.back ?? []) as string[])];
    const t = p?.tech;
    const modern = [
      ...(t?.primary || []),
      ...(t?.frontend || []),
      ...(t?.backend || []),
      ...(t?.mobile || []),
      ...(t?.infra || []),
      ...(t?.tools || []),
      ...(t?.services || []),
    ];
    return Array.from(new Set([...modern, ...legacy].filter(Boolean)));
  };

  const getLayoutClass = (idx: number, isOpen: boolean) => {
    if (isOpen) return "md:col-span-12";
    if (idx === 0) return "md:col-span-7";
    if (idx === 1) return "md:col-span-5";
    // alternating sizes for rhythm
    return idx % 5 === 0 ? "md:col-span-6" : "md:col-span-6";
  };

  if (!effectiveProjects.length) {
    return (
      <div className="p-8 text-center bg-muted/50 rounded-xl">
        <h3 className="font-semibold">{t("no_projects_found")}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t("no_projects_found_desc")}
        </p>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setOpenProjectId(null);
    }
  };

  return (
    <div
      className="space-y-10"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={t("projects")}
    >
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -top-14 h-48 blur-3xl opacity-70"
          style={{
            background:
              "radial-gradient(700px 240px at 25% 0%, rgb(var(--ring) / 0.18), transparent 60%)",
          }}
        />

        <div className="bento-grid">
          {effectiveProjects.map((p: any, idx: number) => {
            const projectId = String(p.id ?? p.name ?? idx);
            const isOpen = openProjectId === projectId;
            const accentSpaces = toAccentSpaces(p.color);
            const technologies = getTechnologies(p);
            const demoUrl = getDemoUrl(p);
            const metrics = getMetrics(p);
            const topMetrics = metrics.slice(0, 2);
            const status = formatStatus(p.status);
            const detailsHref = `/projects/${encodeURIComponent(getSlug(p))}`;
            const ariaControls = `bento-project-${projectId}`;

            return (
              <article
                key={projectId}
                className={[
                  "bento-card surface-panel neo-border",
                  getLayoutClass(idx, isOpen),
                  isOpen ? "is-open" : "",
                ].join(" ")}
                style={
                  {
                    // CSS expects "R G B" so rgb(var(--bento-accent) / ... ) funcione.
                    ["--bento-accent" as any]: accentSpaces,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className="bento-hit"
                  aria-expanded={isOpen}
                  aria-controls={ariaControls}
                  onClick={() =>
                    setOpenProjectId((prev) =>
                      prev === projectId ? null : projectId,
                    )
                  }
                >
                  <div className="bento-media">
                    <img
                      src={buildImage(p)}
                      alt={p.title || p.name}
                      className="bento-img"
                      loading={idx < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div className="bento-overlay" />

                    {topMetrics.length ? (
                      <div className="bento-kpis" aria-hidden>
                        {topMetrics.map((m, mi) => (
                          <div
                            key={`${m.label}-${m.value}`}
                            className={
                              mi === 0 ? "bento-kpi is-hero" : "bento-kpi"
                            }
                            title={
                              m.note
                                ? `${m.label}: ${m.value} — ${m.note}`
                                : `${m.label}: ${m.value}`
                            }
                          >
                            <span className="bento-kpi-label">{m.label}</span>
                            <span className="bento-kpi-value">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="bento-title">
                      <div className="bento-kicker">
                        {p.category || (lang === "en" ? "Case study" : "Caso")}
                        {p.role ? (
                          <span className="hidden sm:inline text-[11px] opacity-80">
                            • {p.role}
                          </span>
                        ) : null}
                        {status ? (
                          <span
                            className="bento-badge"
                            data-variant={String(p.status || "").toLowerCase()}
                          >
                            {status}
                          </span>
                        ) : null}
                      </div>
                      <div className="bento-name">{p.name}</div>
                      {p.subtitle ? (
                        <div className="bento-sub">{p.subtitle}</div>
                      ) : null}
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={ariaControls}
                      key="content"
                      className="bento-body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.26, ease: "easeInOut" }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          {p.description ? (
                            <p className="type-body text-muted-foreground">
                              {p.description}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          className="icon-btn icon-btn-ghost shrink-0"
                          onClick={() => setOpenProjectId(null)}
                          aria-label={t("close")}
                          title={t("close")}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {technologies.length ? (
                        <div className="mt-4">
                          <div className="type-meta text-muted-foreground">
                            {t("technologies_used")}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {technologies.map((tech: string) => (
                              <TechnologyTag key={tech} tech={tech} />
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {metrics.length ? (
                        <div className="mt-4">
                          <div className="type-meta text-muted-foreground">
                            {t("highlights")}
                          </div>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {metrics.slice(0, 4).map((m) => (
                              <div
                                key={`${m.label}-${m.value}`}
                                className="rounded-xl border border-border bg-muted/40 px-3 py-2"
                              >
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                                  {m.label}
                                </div>
                                <div className="text-sm font-semibold text-foreground">
                                  {m.value}
                                </div>
                                {m.note ? (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {m.note}
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <a
                          className="btn btn-primary btn-sm"
                          href={detailsHref}
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
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
