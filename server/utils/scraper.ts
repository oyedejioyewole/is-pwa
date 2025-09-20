import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { z } from "zod";
import { stringify } from "./data";
import { MANIFEST_SCHEMA } from "./schema";

export default async (
  url: string,
  streamController: ReadableStreamDefaultController,
) => {
  streamController.enqueue(stringify({ event: "start" }));

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
  });

  const siteTab = await browser.newPage();

  // This needs to be set as some websites serve different content based on the user agent
  await siteTab.setUserAgent({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  });

  try {
    const { origin } = new URL(url);

    // 3rd step (Load the URL)
    await siteTab.goto(origin, { waitUntil: "domcontentloaded" });

    // 4th step (Check if there's a manifest link tag, provided the grace period of 3s)
    const linkTagWithManifest = await siteTab.$('head link[rel="manifest"]');

    if (!linkTagWithManifest) {
      streamController.enqueue(
        stringify({
          event: "manifest:not-found",
        }),
      );

      return;
    }

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
