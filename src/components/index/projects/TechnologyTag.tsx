import React, { useMemo } from "react";
import {
  SiNextdotjs, SiReact, SiTailwindcss, SiFirebase, SiAstro,
  SiVercel, SiNodedotjs, SiFlutter, SiDart, SiPython, SiDjango,
  SiFlask, SiRuby, SiRubyonrails, SiPhp, SiLaravel, SiMysql,
  SiPostgresql, SiMongodb, SiGraphql, SiDocker, SiKubernetes,
  SiGooglecloud, SiWordpress, SiShopify, SiFigma, SiAdobexd, SiJavascript, SiTypescript,
    SiVite, SiAmazon
} from "react-icons/si";

const ICONS_MAP = {
  nextjs: SiNextdotjs,
  react: SiReact,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  firebase: SiFirebase,
  astro: SiAstro,
  vercel: SiVercel,
  nodejs: SiNodedotjs,
  node: SiNodedotjs,
  flutter: SiFlutter,
  dart: SiDart,
  python: SiPython,
  django: SiDjango,
  flask: SiFlask,
  ruby: SiRuby,
  rails: SiRubyonrails,
  php: SiPhp,
  laravel: SiLaravel,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  graphql: SiGraphql,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  gcp: SiGooglecloud,
  wordpress: SiWordpress,
  shopify: SiShopify,
  figma: SiFigma,
  adobe: SiAdobexd,
  javascript: SiJavascript,
  typescript: SiTypescript,
  vitejs: SiVite,
  aws: SiAmazon,
};

const TechnologyTag = ({ tech }) => {
  const Icon = useMemo(() => {
    if (!tech) return null;
    return ICONS_MAP[tech.toLowerCase()] || null;
  }, [tech]);

  return (
    <div className="inline-flex items-center justify-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-foreground text-xs font-medium gap-2">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      <span>{tech}</span>
    </div>
  );
};

export default TechnologyTag;
