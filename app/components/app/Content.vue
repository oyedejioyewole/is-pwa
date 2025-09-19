<script setup lang="ts">
import { z } from "zod/mini";
import readNDJSONStream from "ndjson-readablestream";

type JSONStreamEvent = {
  event:
    | "start"
    | "error"
    | "manifest:not-found"
    | "manifest:installable"
    | "manifest:not-installable"
    | "done";
  data?: { message: string } | Record<string, unknown>;
};

const INPUT_SCHEMA = z.httpUrl("Must be a valid URL");

const rawUrl = shallowRef<string | null>(null);
const pending = ref(false);

const handleSubmit = async () => {
  if (!rawUrl.value) return;

  const parsedUrl = INPUT_SCHEMA.safeParse(rawUrl.value);
  if (!parsedUrl.success) {
    console.warn(z.prettifyError(parsedUrl.error));
    return;
  }

  const { origin } = new URL(parsedUrl.data);
  console.info(`Dispatched request ${origin} to proxy`);

  const notification = push.promise("Forwading request");

  pending.value = true;
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
        break;
      case "error":
        notification.error(
          streamEvent.data?.message || "An error occured at the proxy",
        );
        console.error("Error:", streamEvent.data);
        break;
      case "manifest:not-found":
        notification.error({
          title: "This site is not a PWA! ",
          message: "because it doesn't have a webmanifest",
        });
        break;
      case "manifest:installable":
        notification.success({
          title: "This site is a PWA! 🎉",
          message: "and it is installable",
        });
        break;
      case "manifest:not-installable":
        notification.success({
          title: "This site is a PWA! 🎉",
          message: "but it is not installable",
          props: streamEvent.data,
        });
        break;
      case "done":
        console.info("[is-pwa] Stream done ...");
        break;
    }
  }

  pending.value = false;
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
