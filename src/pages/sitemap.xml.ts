// Sitemap generado a partir de las rutas reales (home ES/EN + páginas de proyecto).
import { projects } from "../data/projects";

export const GET = ({ site }: { site?: URL }) => {
  const base = (site?.toString() || "https://angelcalderon.dev").replace(/\/$/, "");
  const urls = [
    { loc: `${base}/`, priority: "1.0" },
    { loc: `${base}/en`, priority: "0.9" },
    ...[...projects]
      .sort((a, b) => b.order - a.order)
      .map((p) => ({ loc: `${base}/projects/${encodeURIComponent(p.slug)}`, priority: "0.7" })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
