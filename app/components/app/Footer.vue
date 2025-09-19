<template>
  <footer class="flex items-center justify-between">
    <div>
      Made while using 🎧 by

      <NuxtLink
        class="font-handwriting hide-cursor underline underline-offset-4 transition-opacity hover:opacity-50"
        target="_blank"
        to="https://github.com/oyedejioyewole"
        >oyedejioyewole</NuxtLink
      >
    </div>

    <nav>
      <ul class="flex gap-x-4">
        <li>
          <NuxtLink
            class="hide-cursor transition-opacity hover:opacity-50"
            target="_blank"
            to="https://github.com/oyedejioyewole/is-pwa"
          >
            <UiIcon name="github-logo" :size="25" />
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>
