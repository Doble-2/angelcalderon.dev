import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel';
import react from "@astrojs/react";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: 'https://angelcalderon.dev',
  integrations: [tailwind(), icon(), react()],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
});