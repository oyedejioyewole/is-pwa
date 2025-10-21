import chromium from "@sparticuz/chromium";
import * as cheerio from "cheerio";
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

  streamController.enqueue(stringify({ event: "start" }));

  const requestFailed = await $fetch(url, {
    method: "HEAD",
    ignoreResponseError: true,
  }).catch(() => null);

  if (requestFailed === null) {
    streamController.enqueue(
      stringify({
        event: "navigation:error",
        data: {
          message: "Couldn't load the provided URL.",
        },
      }),
    );

    streamController.enqueue(stringify({ event: "done" }));
    streamController.close();

    return;
  }

  const browser = await puppeteer.launch(
    import.meta.dev
      ? { headless: false }
      : {
          args: chromium.args,
          executablePath: await chromium.executablePath(),
        },
  );

  const siteTab = await browser.newPage();

  // This needs to be set as some websites serve different content based on the user agent
  await siteTab.setUserAgent({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  });

  try {
    const { origin, host } = new URL(url);

    // Load the URL.
    const response = await siteTab
      .goto(origin, {
        waitUntil: "domcontentloaded",
      })
      .catch(() => null);

    if (!response) {
      streamController.enqueue(
        stringify({
          event: "navigation:error",
          data: {
            message: "Couldn't load the provided URL.",
          },
        }),
      );

      return;
    }

    const redirectsBeforeResponse = response.request().redirectChain();

    const $ = cheerio.loadBuffer(await response.buffer());

    const relativeManifestHref = $("link[rel=manifest]").attr("href");

    if (!relativeManifestHref) {
      const hasCrossOriginRedirect =
        redirectsBeforeResponse.some(
          (redirect) => !new URL(redirect.url()).host.includes(host),
        ) || !new URL(response.url()).host.includes(host);

      if (redirectsBeforeResponse.length > 0 && hasCrossOriginRedirect) {
        streamController.enqueue(
          stringify({
            event: "navigation:redirect",
            data: {
              message:
                "Redirected to a different URL without returning a response (possibly for authentication).",
            },
          }),
        );
      } else
        streamController.enqueue(
          stringify({
            event: "manifest:not-found",
            data: {
              message: "You can't install this as an app.",
            },
          }),
        );

      return;
    }

    const { href: manifestHref } = new URL(relativeManifestHref, siteTab.url());

    // Use puppeteer to fetch the webmanifest cause some sites don't like native fetch.
    const manifestResponse = await siteTab.goto(manifestHref);

    if (!manifestResponse) {
      streamController.enqueue(
        stringify({
          event: "manifest:error",
          data: {
            message: "webmanifest reference found but couldn't be loaded.",
          },
        }),
      );

      return;
    }

    // Try to parse the response as JSON.
    const manifestContent = await manifestResponse.json().catch(() => null);

    if (!manifestContent) {
      streamController.enqueue(
        stringify({
          event: "manifest:error",
          data: {
            message: "webmanifest attached isn't readable.",
          },
        }),
      );

      return;
    }

    const manifestBlob = await MANIFEST_SCHEMA.safeParseAsync(manifestContent);

    // Validate the fetched webmanifest to standards for installablity.
    if (manifestBlob.success)
      streamController.enqueue(
        stringify({
          event: "manifest:installable",
          data: {
            message: "You can install this as an app.",
            payload: {
              manifestHref,
              manifestBlob: manifestBlob.data,
            },
          },
        }),
      );
    else
      streamController.enqueue(
        stringify({
          event: "manifest:not-installable",
          data: {
            message: "You can't install this as an app.",
            payload: {
              errorTree: z.treeifyError(manifestBlob.error),
              manifestHref,
              rawManifest: manifestContent,
            },
          },
        }),
      );
  } catch (error: unknown) {
    if (error instanceof Error) {
      streamController.enqueue(
        stringify({
          event: "error",
          data: {
            message: error.message,
          },
        }),
      );
    }
  } finally {
    await browser.close();
    streamController.enqueue(stringify({ event: "done" }));
    streamController.close();
  }
};
