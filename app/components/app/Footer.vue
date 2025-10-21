<script lang="ts" setup>
const deviceTheme = useColorMode();

const toggleDarkMode = () => {
  deviceTheme.preference = deviceTheme.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <UiItem as="footer">
    <UiItemContent>
      <UiItemTitle>
        <p>
          Made while using 🎧 by

          <NuxtLink
            class="font-cursive hide-cursor underline underline-offset-4"
            target="_blank"
            to="https://github.com/oyedejioyewole"
            >oyedejioyewole</NuxtLink
          >
        </p>
      </UiItemTitle>
    </UiItemContent>

    <UiItemActions>
      <!-- Project repository -->
      <UiButton variant="ghost" size="icon-lg" as-child>
        <NuxtLink
          target="_blank"
          to="https://github.com/oyedejioyewole/is-pwa"
          class="hide-cursor"
        >
          <UiIcon name="github-logo" weight="duotone" />
        </NuxtLink>
      </UiButton>

      <!-- Theme switcher -->
      <UiButton variant="ghost" @click="toggleDarkMode">
        <ColorScheme>
          <!-- Theme switcher -->
          <UiIcon
            :name="{
              desktop: $colorMode.preference === 'system',
              sun: $colorMode.value === 'dark',
              'moon-stars': $colorMode.value === 'light',
            }"
            weight="duotone"
          />
          <span class="sr-only"
            >Switch theme to
            {{ $colorMode.value === "light" ? "dark" : "light" }}</span
          >

          <template #placeholder>
            <UiIcon name="desktop" />
          </template>
        </ColorScheme>
      </UiButton>
    </UiItemActions>
  </UiItem>
</template>
