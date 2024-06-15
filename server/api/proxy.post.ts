import cheerio from "cheerio";
import type { FetchError } from "ofetch";
import { ZenRows } from "zenrows";
import { z } from "zod";

function searchForManifest(html: string) {
  const $ = cheerio.load(html);
  const manifestURL = $("link[rel='manifest']").attr("href");
  return {
    isFound: new Boolean(manifestURL) as boolean,
  };
}

export default defineEventHandler(async (event) => {
  const urlSchema = z.object({
    url: z.union([
      z.string().url().startsWith("https://"),
      z.string().url().startsWith("http://"),
    ]),
  });

  const body = await readValidatedBody(event, urlSchema.parse);

  const response = await $fetch<string>(body.url).catch(
    async (error: FetchError) => {
      switch (error.status) {
        case 403:
          const zenrows = new ZenRows(process.env.NUXT_ZENROWS_API_KEY ?? "");
          const { data } = await zenrows.get(body.url);
          return data as string;
        case 404:
          return null;
      }
    },
  );

  if (response) return searchForManifest(response);
});
