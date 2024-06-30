import { Readable } from "node:stream";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const urlSchema = z.object({
    url: z.union([
      z.string().url().startsWith("https://"),
      z.string().url().startsWith("http://"),
    ]),
  });

  const { url } = await readValidatedBody(event, urlSchema.parse);

  const stream = new Readable({
    destroy: (error) => {
      if (error) {
        throw createError({
          message: error.message,
          statusCode: 502,
          statusMessage: error.name,
        });
      }
    },
    read: () => {},
  });

  scraper(url).then((response) => {
    if (response) {
      if (response.type === "error") {
        stream.destroy(response.data);
      } else if (response.type === "success") {
        stream.push(JSON.stringify(response.data));
        stream.push(null);
      }
    }
  });

  return sendStream(event, stream);
});
