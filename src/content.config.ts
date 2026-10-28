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

    // assets en /public/certifieds/<asset>.pdf y /public/certifieds/hd/<asset>.webp
    asset: z.string().optional(), // sin asset: se muestra una tarjeta tipográfica

    // Presentación
    name_en: z.string().optional(),
    kind: z.enum(["award", "hackathon", "course"]).default("course"),
    hours: z.number().int().optional(),
    issuer_detail: z.string().optional(), // p. ej. institución que avala
    place: z.number().int().optional(), // puesto obtenido (1, 2, 5…)
    pdf: z.boolean().default(true), // false: solo imagen (p. ej. captura de resultados)
    url: z.string().url().optional(), // web del evento, si no hay PDF
    note: z.string().optional(),
    note_en: z.string().optional(),
  }),
});

export const collections = { certifieds };
