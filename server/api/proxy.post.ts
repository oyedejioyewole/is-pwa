import cheerio from "cheerio";
import type { FetchError } from "ofetch";
import { ZenRows } from "zenrows";
import { z } from "zod";

function searchForManifest(html: string) {
  const $ = cheerio.load(html);
  const manifestURL = $("link[rel='manifest']").attr("href");

  return {
    isFound: !!manifestURL,
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

  const response = await $fetch<string>(body.url, {
    headers: {
      "User-Agent":
        "'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'",
    },
  }).catch(async (error: FetchError) => {
    console.log(error.status);
    switch (error.status) {
      case 403:
        const zenrows = new ZenRows(process.env.NUXT_ZENROWS_API_KEY ?? "");
        const { data } = await zenrows.get(body.url);
        return data as string;
      default:
        return null;
    }
  });

  if (response) return searchForManifest(response);
});
