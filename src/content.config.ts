import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/projects" }),
  schema: z.object({
    name: z.string(),
    order: z.number().int(),

    // "R G B" (ej: "51 145 255")
    color: z.string().optional(),

    // dd/mm/yyyy
    dateStart: z.string().optional(),
    dateEnd: z.string().optional(),

    description: z.string(),

    front: z.array(z.string()).optional(),
    back: z.array(z.string()).optional().nullable(),
    images: z.array(z.string()).optional(),

    role: z.string().optional(),
    type: z.string().optional(),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),

    win: z.string().optional(),
    team: z
      .object({
        name: z.string(),
        members: z.array(z.string()),
      })
      .optional(),
  }),
});

const certifieds = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/certifieds" }),
  schema: z.object({
    name: z.string(),
    platform: z.string(),
    date: z.string(), // dd/mm/yyyy
    order: z.number().int(),
    code: z.string().optional().nullable(),

    // assets en /public/certifieds/<asset>.pdf/.jpg
    asset: z.string(),
  }),
});

export const collections = { projects, certifieds };
