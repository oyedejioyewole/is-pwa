export default defineNuxtConfig({
  colorMode: {
    classSuffix: "",
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/fonts",
    "@nuxtjs/color-mode",
    "@nuxtjs/seo",
    "@nuxtjs/tailwindcss",
    "@vite-pwa/nuxt",
    "@vueuse/nuxt",
    "notivue/nuxt",
    "nuxt-phosphor-icons",
  ],
  css: ["notivue/animations.css", "notivue/notification.css"],
  notivue: {
    position: "top-right",
  },
  site: {
    defaultLocale: "en",
    description: "Check whether a site is installable as an app",
    name: "Is PWA?",
    url: "https://is-pwa.vercel.app",
  },
  compatibilityDate: "2025-09-16",
  phosphorIcons: {
    componentName: "ui-icon",
  },
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
});
