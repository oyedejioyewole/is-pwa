import { ZenRows } from "zenrows";
import { z } from "zod";
import puppeteer from "puppeteer";

export default defineEventHandler(async (event) => {
  const urlSchema = z.object({
    url: z.union([
      z.string().url().startsWith("https://"),
      z.string().url().startsWith("http://"),
    ]),
  });

  const body = await readValidatedBody(event, urlSchema.parse);

  const browser = await puppeteer.launch();
  const siteTab = await browser.newPage();

  const response = await siteTab
    .goto(body.url, {
      waitUntil: "domcontentloaded",
    })
    .catch(() => null);

  const result = {
    isFound: false,
    isValid: false,
  };

  if (response) {
    if (response.ok()) {
      const manifestPath = await siteTab
        .$eval("link[rel='manifest']", (element) => element.href)
        .catch(() => null);

      if (manifestPath) {
        result.isFound = true;

        const manifestTab = await browser.newPage();
        const response = await manifestTab.goto(manifestPath, {
          timeout: 10000,
        });

        if (response && response.ok()) {
          const manifest = await response.json().catch(() => null);
          if (!manifest) return;

          const isValid = ["display", "icons", "name", "start_url"].every(
            (field) => Object.hasOwn(manifest, field),
          );
          result.isValid = isValid;
        }
      }
    } else {
      switch (response.status()) {
        case 403: {
          const zenrows = new ZenRows(process.env.NUXT_ZENROWS_API_KEY ?? "");
          const data = await zenrows.get(body.url, { js_render: true });

          console.log(data);
        }
      }
    }
  }
});
