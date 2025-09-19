import chromium from "@sparticuz/chromium";
import { z } from "zod";
import { stringify } from "./data";
import { MANIFEST_SCHEMA } from "./schema";

export default async (
  url: string,
  streamController: ReadableStreamDefaultController,
) => {
  const puppeteer = import.meta.dev
    ? await import("puppeteer")
    : await import("puppeteer-core");

  const options = !import.meta.dev
    ? {
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      }
    : { headless: false };

  streamController.enqueue(stringify({ event: "start" }));

  // 1st step (Launch the browser)
  const browser = await puppeteer.launch(options);

  try {
    // 2nd step (Open a new page - for the URL)
    const siteTab = await browser.newPage();

    // Get the origin of the URL (for cases of paths in URL)
    const { origin } = new URL(url);

    // 3rd step (Load the URL)
    await siteTab.goto(origin);

    // 4th step (Check if there's a manifest link tag, provided the grace period of 3s)
    const linkTagWithManifest = await siteTab
      .waitForSelector('link[rel="manifest"]', { timeout: 5000 })
      .catch(() => {
        streamController.enqueue(
          stringify({
            event: "manifest:not-found",
            data: { message: "No webmanifest was found during grace period." },
          }),
        );

        return null;
      });

    if (!linkTagWithManifest) return;

    const manifestHref = await linkTagWithManifest.evaluate((el) => el.href);
    const manifestContent = await $fetch(manifestHref, {
      onResponseError: ({ error }) => {
        if (!error) return;
        throw error;
      },
      responseType: "json",
    });

    const parsedManifest =
      await MANIFEST_SCHEMA.safeParseAsync(manifestContent);

    if (parsedManifest.success)
      streamController.enqueue(
        stringify({
          event: "manifest:installable",
        }),
      );
    else
      streamController.enqueue(
        stringify({
          event: "manifest:not-installable",
          data: z.prettifyError(parsedManifest.error).split("\n"),
        }),
      );
  } catch (error: unknown) {
    if (error instanceof Error) {
      streamController.enqueue(
        stringify({
          event: "error",
          data: { message: error.message },
        }),
      );
    }
  } finally {
    await browser.close();
    streamController.enqueue(stringify({ event: "done" }));
    streamController.close();
  }
};
