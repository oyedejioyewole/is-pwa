import { z } from "zod";
import { PROXY_BODY_SCHEMA } from "../utils/schema";
import scraper from "../utils/scraper";

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Content-Type", "application/x-ndjson");
  setResponseHeader(event, "Cache-Control", "no-cache");
  setResponseHeader(event, "Transfer-Encoding", "chunked");

  const parsedBody = await readValidatedBody(
    event,
    PROXY_BODY_SCHEMA.safeParseAsync,
  );

  if (!parsedBody.success)
    throw createError({
      data: z.prettifyError(parsedBody.error).split("\n"),
      message: "Failed to parse request body",
      statusCode: 400,
    });

  const stream = new ReadableStream({
    async start(controller) {
      await scraper(parsedBody.data.to, controller);
    },
  });

  return sendStream(event, stream);
});
