<script lang="ts" setup>
const toggleDarkMode = () => {
  _theme.preference = _theme.value === "dark" ? "light" : "dark";
};

const _theme = useColorMode();

const theme = computed(() => ({
  icon:
    _theme.value === "light"
      ? resolveComponent("PhosphorIconMoonStars")
      : resolveComponent("PhosphorIconSun"),
  isDark: _theme.value === "dark",
}));
</script>

<template>
  <header class="mx-auto grid w-3/4 grid-rows-2 md:w-full">
    <!-- Theme switcher (loading indicator) -->
    <span class="ml-auto" v-if="$colorMode.unknown"> Loading ... </span>

    <!-- Theme switcher -->
    <AnimationsBlobHide class="ml-auto" v-else>
      <button
        class="group rounded-full border border-orange-900 p-3 outline-none ring-orange-900 hover:ring focus:ring dark:border-orange-100 dark:ring-orange-100"
        type="button"
        @click="toggleDarkMode"
      >
        <component
          class="fill-orange-900 dark:fill-orange-100"
          size="25"
          :class="{
            'transition-transform group-hover:rotate-180': theme.isDark,
          }"
          :is="theme.icon"
        />
        <span class="sr-only"
          >Switch theme to {{ !theme.isDark ? "dark" : "light" }}</span
        >
      </button>
    </AnimationsBlobHide>

    <div class="m-auto space-y-4 text-center">
      <!-- Name -->
      <h1 class="text-5xl font-bold md:text-7xl">Is PWA?</h1>

      <!-- Description -->
      <p class="font-handwriting md:text-xl">
        Check whether a URL can be installed as a web app
      </p>
    </div>
  </header>
</template>
