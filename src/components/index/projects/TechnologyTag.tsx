import React, { useMemo } from "react";
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiFirebase,
  SiAstro,
  SiVercel,
  SiNodedotjs,
  SiFlutter,
  SiDart,
  SiPython,
  SiDjango,
  SiFlask,
  SiRuby,
  SiRubyonrails,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiGraphql,
  SiDocker,
  SiKubernetes,
  SiGooglecloud,
  SiWordpress,
  SiShopify,
  SiFigma,
  SiAdobe,
  SiJavascript,
  SiTypescript,
  SiVite,
  SiAmazon,
} from "react-icons/si";

const ICONS_MAP = {
  nextjs: SiNextdotjs,
  "next.js": SiNextdotjs,
  react: SiReact,
  "react native": SiReact,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  firebase: SiFirebase,
  astro: SiAstro,
  vercel: SiVercel,
  nodejs: SiNodedotjs,
  node: SiNodedotjs,
  "node.js": SiNodedotjs,
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
  "my sql": SiMysql,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  "postgre sql": SiPostgresql,
  mongodb: SiMongodb,
  "mongo db": SiMongodb,
  graphql: SiGraphql,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  gcp: SiGooglecloud,
  wordpress: SiWordpress,
  shopify: SiShopify,
  figma: SiFigma,
  adobe: SiAdobe,
  javascript: SiJavascript,
  typescript: SiTypescript,
  vitejs: SiVite,
  vite: SiVite,
  aws: SiAmazon,
};

const TechnologyTag = ({ tech, size = "md" }) => {
  const Icon = useMemo(() => {
    if (!tech) return null;
    return ICONS_MAP[tech.toLowerCase()] || null;
  }, [tech]);

  return (
    <div className={size === "lg" ? "tag gap-2 px-4 py-2.5 text-base whitespace-nowrap" : "tag gap-1.5 px-2 py-1 text-xs"}>
      {Icon && <Icon className={size === "lg" ? "w-5 h-5 opacity-80" : "w-3.5 h-3.5 opacity-70"} aria-hidden="true" />}
      <span>{tech}</span>
    </div>
  );
};

export default TechnologyTag;
