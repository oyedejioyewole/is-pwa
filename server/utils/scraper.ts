import chromium from "@sparticuz/chromium";
import type { PuppeteerLaunchOptions } from "puppeteer";
import puppeteer from "puppeteer";
import { z } from "zod";

type ScraperResponseTypes = "error" | "success";

export default async (url: string) => {
  let options: PuppeteerLaunchOptions | undefined;

  if (!import.meta.dev)
    options = {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    };

  // 1st step (Launch the browser)
  const browser = await puppeteer.launch(options);

  try {
    // 2nd step (Open a new page - for the URL)
    const siteTab = await browser.newPage();

    // Get the origin of the URL (for cases of paths in URL)
    const { origin } = new URL(url);

    // 3rd step (Load the URL)
    const response = await siteTab.goto(origin, {
      timeout: 0,
      waitUntil: "domcontentloaded",
    });

    if (response) {
      if (response.ok()) {
        // 4th step (Get link[rel=manifest] href if any)
        const manifestLink = await siteTab.$eval(
          "link[rel=manifest]",
          (element) => element.href,
        );

        // 5h step (Open a new page - for the manifest)
        const manifestTab = await browser.newPage();

        // 6th step (Load the manifest)
        const response = await manifestTab.goto(manifestLink);

        if (response) {
          if (response.ok()) {
            // 7th step (Get loaded page as JSON)
            const manifest = await response.json();

            // Schema to validate webmanifest
            const manifestSchema = z
              .object({
                name: z.string().optional(),
                icons: z.array(z.any()),
                short_name: z.string().optional(),
                start_url: z.string(),
                display: z.string().optional(),
                display_override: z.string().optional(),
                prefer_related_applications: z
                  .boolean()
                  .optional()
                  .refine((value) => value !== true),
              })
              .refine((values) => values.name || values.short_name);

            // Parse and validate webmanifest
            const result = manifestSchema.safeParse(manifest);

            return {
              data: {
                isValid: result.success,
              },
              type: "success" as ScraperResponseTypes,
            };
          } else {
            // Write logic later ...
            console.log("Manifest response is not OK");
          }
        }
      } else {
        // Write logic later ...
        console.log("Bot protection detected:", response.status());
      }
    }
  } catch (error: any) {
    const _error: {
      message: string;
      name?: string;
    } = { message: error.message };

    if (_error.message.includes("link[rel=manifest]"))
      _error.name = "ERR_MANIFEST_NOT_FOUND";
    else if (_error.message.includes("::"))
      _error.name = _error.message.split("::")[1].split(" ")[0];

    return { data: _error, type: "error" as ScraperResponseTypes };
  } finally {
    await browser.close();
  }
};
