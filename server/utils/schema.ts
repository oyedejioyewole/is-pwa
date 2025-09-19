import { z } from "zod";

const DISPLAY_MODES = ["fullscreen", "minimal-ui", "standalone"] as const;

export const MANIFEST_SCHEMA = z
  .object({
    name: z.string().optional(),
    short_name: z.string().optional(),
    icons: z
      .array(
        z.object({
          src: z.string(),
          sizes: z.string(),
        }),
      )
      .min(1)
      .refine((icons) =>
        icons.some(
          (icon) => icon.sizes === "192x192" || icon.sizes === "512x512",
        ),
      ),
    start_url: z.string(),
    display: z.enum(DISPLAY_MODES).optional(),
    display_override: z.array(z.enum(DISPLAY_MODES)).optional(),
    prefer_related_applications: z
      .boolean()
      .optional()
      .refine((condition) => !condition, {
        error: "property shouldn't be present, or must be false.",
      }),
  })
  .refine((schema) => schema.name || schema.short_name, {
    error: '"name" and/or "short_name" must be present.',
  })
  .refine((schema) => schema.display || schema.display_override, {
    error: '"display" and/or "display_override" must be present.',
  });

export const PROXY_BODY_SCHEMA = z.object({
  to: z.httpUrl("Must be a valid URL"),
});
