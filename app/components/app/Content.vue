<script setup lang="ts">
import { z } from "zod/mini";
import readNDJSONStream from "ndjson-readablestream";

type JSONStreamEvent = {
  event:
    | "start"
    | "error"
    | "navigation:error"
    | "navigation:redirect"
    | "manifest:error"
    | "manifest:not-found"
    | "manifest:installable"
    | "manifest:not-installable"
    | "done";
  data: { message: string } | Record<string, unknown>;
};

const INPUT_SCHEMA = z.httpUrl("Must be a valid URL");

const rawUrl = shallowRef<string | null>(null);
const { start: startProgress, finish: finishProgress } = useLoadingIndicator();

const handleSubmit = async () => {
  if (!rawUrl.value) return;

  const parsedUrl = INPUT_SCHEMA.safeParse(rawUrl.value);
  if (!parsedUrl.success) {
    console.warn(z.prettifyError(parsedUrl.error));
    return;
  }

  const { origin } = new URL(parsedUrl.data);
  console.info(`Dispatched request ${origin} to proxy`);

  const response = await $fetch<ReadableStream>("/api/proxy", {
    method: "POST",
    body: {
      to: origin,
    },
    responseType: "stream",
  });

  rawUrl.value = null;

  for await (const streamEvent of readNDJSONStream<JSONStreamEvent>(response)) {
    switch (streamEvent.event) {
      case "start":
        console.info("[is-pwa] Stream started ...");
        startProgress();
        break;
      case "error":
        push.error({
          title: "Error",
          message: streamEvent.data.message,
        });
        break;
      case "manifest:error":
        push.error({
          title: "Error",
          message: streamEvent.data.message,
        });
        break;
      case "manifest:not-found":
        push.error({
          title: "Error.",
          message: streamEvent.data.message,
        });
        break;
      case "manifest:installable":
        push.success({
          title: "Done.",
          message: "You can install this as an app.",
          props: {
            detailType: "details",
          },
          duration: Infinity,
        });
        console.log(streamEvent.data);
        break;
      case "manifest:not-installable":
        push.warning({
          title: "Warning.",
          message: "There are issues stopping this from being installable.",
          props: { detailType: "issues" },
          duration: Infinity,
        });
        console.log(streamEvent.data);
        break;
      case "done":
        console.info("[is-pwa] Stream done ...");
        finishProgress();
        break;
    }
  }
};
</script>

<template>
  <main class="mx-auto self-center">
    <form
      class="flex flex-col items-center gap-4 md:flex-row"
      @submit.prevent="handleSubmit()"
    >
      <input
        class="hide-cursor rounded-full border border-orange-900 bg-transparent py-4 pl-4 ring-orange-900 outline-none hover:ring focus:ring dark:border-orange-100 dark:ring-orange-100"
        name="url"
        required
        type="url"
        v-model="rawUrl"
      />

      <button
        class="hide-cursor w-full rounded-full border border-orange-900 bg-transparent py-4 ring-orange-900 outline-none hover:ring focus:ring md:w-20 dark:border-orange-100 dark:ring-orange-100"
        type="submit"
      >
        <UiIcon
          name="magnifying-glass"
          class="mx-auto fill-orange-900 dark:fill-orange-100"
          size="25"
        />
      </button>
    </form>
  </main>
</template>
