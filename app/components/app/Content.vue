<script setup lang="ts">
import { z } from "zod/mini";
import readNDJSONStream from "ndjson-readablestream";
import type { EventStreamNotificationProps } from "./EventNotification.vue";
import type { PushOptions } from "notivue";

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
  data: {
    message: string;
    payload: EventStreamNotificationProps["payload"];
  };
};

const INPUT_SCHEMA = z.httpUrl("Must be a valid URL");

const rawUrl = shallowRef<string | null>(null);
const {
  start: startProgress,
  finish: finishProgress,
  isLoading,
} = useLoadingIndicator();
const { entries: activeNotifications } = useNotifications();

const pushEventNotification = (
  eventType: keyof typeof push,
  {
    props = {} as EventStreamNotificationProps,
    ...options
  }: PushOptions<EventStreamNotificationProps>,
) => {
  push[eventType]({
    title: `${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}.`,
    ...options,
    props: {
      ...props,
    },
  });
};

const handleSubmit = async () => {
  if (!rawUrl.value) return;

  const parsedUrl = INPUT_SCHEMA.safeParse(rawUrl.value);
  if (!parsedUrl.success) {
    console.warn(z.prettifyError(parsedUrl.error));
    return;
  }

  const { origin } = new URL(parsedUrl.data);
  console.info(`Dispatched request ${origin} to proxy`);

  startProgress();

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
      case "navigation:error":
      case "navigation:redirect":
      case "manifest:error":
      case "manifest:not-found":
        pushEventNotification("error", { message: streamEvent.data.message });
        break;

      case "manifest:not-installable":
        pushEventNotification("warning", {
          message: streamEvent.data.message,
          props: { detailType: "issues", payload: streamEvent.data.payload },
          duration: 3000,
        });
        break;

      case "manifest:installable":
        pushEventNotification("success", {
          message: streamEvent.data.message,
          props: { detailType: "details", payload: streamEvent.data.payload },
          duration: 3000,
        });
        break;

      case "done":
        console.info("[is-pwa] Stream done ...");
        finishProgress();
    }
  }
};
</script>

<template>
  <main>
    <UiInputGroup class="hide-cursor">
      <UiInputGroupInput placeholder="https://youtube.com" v-model="rawUrl" />
      <UiInputGroupAddon>
        <UiIcon name="link" />
      </UiInputGroupAddon>
      <UiInputGroupAddon align="inline-end">
        <UiInputGroupButton
          :disabled="isLoading || !rawUrl || activeNotifications.length > 0"
          variant="default"
          class="gap-2"
          @click="handleSubmit"
        >
          <UiIcon name="magnifying-glass" v-if="!isLoading" />
          <UiSpinner v-else />

          {{ isLoading ? "Please wait" : "Inspect" }}
        </UiInputGroupButton>
      </UiInputGroupAddon>
    </UiInputGroup>
  </main>
</template>
