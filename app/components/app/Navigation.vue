<script lang="ts" setup>
const deviceTheme = useColorMode();

const toggleDarkMode = () => {
  deviceTheme.preference = deviceTheme.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <!-- Theme switcher (loading indicator) -->
  <button
    class="hide-cursor w-fit cursor-pointer rounded-full border border-orange-900 p-3 ring-orange-900 outline-none hover:ring focus:ring dark:border-orange-100 dark:ring-orange-100"
    type="button"
    @click="toggleDarkMode"
  >
    <ColorScheme>
      <!-- Theme switcher -->
      <UiIcon
        :name="{
          desktop: $colorMode.preference === 'system',
          sun: $colorMode.value === 'light',
          'moon-stars': $colorMode.value === 'dark',
        }"
        :size="20"
      />
      <span class="sr-only"
        >Switch theme to
        {{ $colorMode.value === "light" ? "dark" : "light" }}</span
      >

      <template #placeholder>
        <UiIcon name="desktop" :size="20" />
      </template>
    </ColorScheme>
  </button>
</template>
