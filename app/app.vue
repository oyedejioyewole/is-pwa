<script lang="ts" setup>
import { outlinedIcons, darkTheme, lightTheme } from "notivue";
</script>

<template>
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
    <Notification
      :icons="outlinedIcons"
      :item="item"
      :theme="$colorMode.value === 'dark' ? darkTheme : lightTheme"
    />
  </Notivue>
</template>
