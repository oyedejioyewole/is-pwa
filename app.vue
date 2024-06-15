<script lang="ts" setup>
import type { NotivueTheme } from "notivue";
import { outlinedIcons, pastelTheme } from "notivue";
// @ts-expect-error
import { theme } from "#build/tailwind.config";

// Styles
import "notivue/animations.css";
import "notivue/notification.css";

const _theme = useColorMode();
const notivueTheme = computed(() => {
  const colors = {
    background:
      _theme.value === "dark"
        ? theme.colors.orange[950]
        : theme.colors.orange[50],
    foreground:
      _theme.value === "dark"
        ? theme.colors.orange[50]
        : theme.colors.orange[950],
  };

  return {
    ...pastelTheme,
    "--nv-error-accent": colors.foreground,
    "--nv-error-bg": colors.background,
    "--nv-error-fg": colors.foreground,
    "--nv-promise-accent": colors.foreground,
    "--nv-promise-bg": colors.background,
    "--nv-promise-fg": colors.foreground,
    "--nv-success-accent": colors.foreground,
    "--nv-success-bg": colors.background,
    "--nv-success-fg": colors.foreground,
  } satisfies NotivueTheme;
});
</script>

<template>
  <AnimationsBlobMovement />

  <div class="mx-auto grid h-screen grid-rows-3 py-10 md:w-[90%]">
    <Header />

    <Content />

    <Footer />
  </div>

  <Notivue v-slot="item">
    <Notification :icons="outlinedIcons" :item="item" :theme="notivueTheme" />
  </Notivue>
</template>

<style>
body {
  @apply overflow-hidden bg-orange-100 text-orange-900 transition selection:bg-orange-300 dark:bg-orange-900 dark:text-orange-100;
}

@media (max-width: 768px) {
  :root {
    --nv-root-x-align: center;
  }
}
</style>
