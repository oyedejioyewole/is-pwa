<template>
  <footer class="mt-auto flex items-center justify-around">
    <div>
      Made with 🎧 by
      <AnimationsBlobHide class="inline">
        <NuxtLink
          class="font-handwriting underline underline-offset-4 transition-opacity hover:opacity-50"
          target="_blank"
          to="https://github.com/oyedejioyewole"
          >oyedejioyewole</NuxtLink
        >
      </AnimationsBlobHide>
    </div>

    <nav>
      <ul class="flex gap-x-4">
        <li>
          <AnimationsBlobHide>
            <NuxtLink
              class="transition-opacity hover:opacity-50"
              target="_blank"
              to="https://github.com/oyedejioyewole/ispwa"
            >
              <PhosphorIconGithubLogo size="25" />
            </NuxtLink>
          </AnimationsBlobHide>
        </li>
        <li>
          <AnimationsBlobHide>
            <NuxtLink
              class="transition-opacity hover:opacity-50"
              target="_blank"
              to="https://oyedejioyewole.vercel.app"
            >
              <PhosphorIconLink size="25" />
            </NuxtLink>
          </AnimationsBlobHide>
        </li>
      </ul>
    </nav>
  </footer>
</template>
