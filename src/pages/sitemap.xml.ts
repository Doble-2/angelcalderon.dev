// Sitemap generado a partir de las rutas reales (home ES/EN + páginas de proyecto).
// Incluye lastmod, changefreq y anotaciones hreflang (xhtml:link).
import { projects } from "../data/projects";

export const GET = ({ site }: { site?: URL }) => {
  const base = (site?.toString() || "https://angelcalderon.dev").replace(/\/$/, "");
  const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const urls = [
    {
      loc: `${base}/`,
      lastmod: now,
      changefreq: "monthly",
      priority: "1.0",
      alternates: [
        { hreflang: "es", href: `${base}/` },
        { hreflang: "en", href: `${base}/en` },
        { hreflang: "x-default", href: `${base}/` },
      ],
    },
    {
      loc: `${base}/en`,
      lastmod: now,
      changefreq: "monthly",
      priority: "0.9",
      alternates: [
        { hreflang: "es", href: `${base}/` },
        { hreflang: "en", href: `${base}/en` },
        { hreflang: "x-default", href: `${base}/` },
      ],
    },
    ...[...projects]
      .sort((a, b) => b.order - a.order)
      .map((p) => ({
        loc: `${base}/projects/${encodeURIComponent(p.slug)}`,
        lastmod: `${p.dateStart}-01-01`,
        changefreq: "yearly" as const,
        priority: "0.7",
        alternates: [] as { hreflang: string; href: string }[],
      })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.alternates
      .map(
        (a) =>
          `\n    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`
      )
      .join("")}
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
