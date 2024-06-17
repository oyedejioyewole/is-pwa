import cheerio from "cheerio";

export function locateManifest(html: string) {
  const $ = cheerio.load(html);
  return $("link[rel='manifest']").attr("href");
}

export async function validateManifest(url: string) {
  const response = await $fetch<{} | string>(url);

  if (typeof response === "object") {
    const requiredFields = ["name", "icons", "start_url", "display"];

    return requiredFields.every((field) => Object.hasOwn(response, field));
  }

  return false;
}
