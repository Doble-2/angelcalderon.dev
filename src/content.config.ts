import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const certifieds = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/certifieds" }),
  schema: z.object({
    name: z.string(),
    platform: z.string(),
    date: z.string(), // dd/mm/yyyy
    order: z.number().int(),
    code: z.string().optional().nullable(),

    // assets en /public/certifieds/<asset>.pdf/.webp
    asset: z.string(),
  }),
});

export const collections = { certifieds };
