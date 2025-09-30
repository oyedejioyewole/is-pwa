<script setup lang="ts">
import type { NotivueItem } from "notivue";
import type { EventStreamNotificationProps } from "./components/app/EventNotification.vue";
</script>

<template>
  <NuxtPwaAssets />

  <ColorScheme>
    <NuxtLoadingIndicator
      :color="
        $colorMode.value === 'light'
          ? 'var(--color-orange-900)'
          : 'var(--color-orange-100)'
      "
    />
    <template #fallback>
      <NuxtLoadingIndicator color="var(--color-orange-900)" />
    </template>
  </ColorScheme>

  <AppCursor />

  <Body
    class="mx-auto w-[90%] bg-orange-100 text-orange-900 transition selection:bg-black/10 md:overflow-hidden min-lg:w-3/4 dark:bg-orange-900 dark:text-orange-100 dark:selection:bg-white/10"
  >
    <div class="flex min-h-screen flex-col justify-between py-8">
      <AppNavigation />

      <AppHeader />

      <AppFooter />
    </div>
  </Body>

  <Notivue v-slot="item">
    <AppEventNotification
      :item="item as NotivueItem<EventStreamNotificationProps>"
    />
  </Notivue>
</template>
