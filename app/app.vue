<script setup lang="ts">
import type { NotivueItem } from "notivue";
import type { EventStreamNotificationProps } from "./components/app/EventNotification.vue";
</script>

<template>
  <NuxtPwaAssets />

  <NuxtLoadingIndicator color="var(--color-primary)" />

  <!-- This is the cursor following animation. -->
  <AppCursor />

  <Body
    class="bg-background text-primary selection:bg-foreground/10 mx-auto w-[90%] transition md:overflow-hidden min-lg:w-3/4 dark:selection:bg-white/10"
  >
    <div class="flex h-[calc(100vh_-_74px)] flex-col justify-center gap-y-4">
      <h1 class="font-cursive text-4xl font-bold">Is it a PWA?</h1>
      <p>Check whether a URL can be installed as a web app</p>

      <!-- This is where things begin. -->
      <AppContent />
    </div>

    <AppFooter />

    <!-- This contains the dialog for viewing manifests and warnings. -->
    <AppDialog />
  </Body>

  <Notivue v-slot="item">
    <!-- This is a wrapper for event notifications. -->
    <AppEventNotification
      :item="item as NotivueItem<EventStreamNotificationProps>"
    />
  </Notivue>
</template>
