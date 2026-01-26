import React, { useMemo } from "react";
import I18N from "../../../i18n";

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

  const getLayoutClass = (idx: number) => {
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

  return (
    <div className="space-y-10" role="region" aria-label={t("projects")}>
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
            const accentSpaces = toAccentSpaces(p.color);
            const metrics = getMetrics(p);
            const topMetrics = metrics.slice(0, 2);
            const status = formatStatus(p.status);
            const detailsHref = `/projects/${encodeURIComponent(getSlug(p))}`;

            return (
              <article
                key={projectId}
                className={[
                  "bento-card surface-panel neo-border",
                  getLayoutClass(idx),
                ].join(" ")}
                style={
                  {
                    // CSS expects "R G B" so rgb(var(--bento-accent) / ... ) funcione.
                    ["--bento-accent" as any]: accentSpaces,
                  } as React.CSSProperties
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
                    <div
                      className="bento-kpis pointer-events-none z-20"
                      aria-hidden
                    >
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

                  <div className="bento-title pointer-events-none z-20">
                    <div className="bento-kicker">
                      {p.category || (lang === "en" ? "Case study" : "Caso")}
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

                  <a
                    href={detailsHref}
                    className="absolute inset-0 z-10 rounded-[20px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-white"
                    aria-label={`${t("view_details_page")}: ${p.title || p.name}`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
