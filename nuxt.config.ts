export default defineNuxtConfig({
  colorMode: {
    classSuffix: "",
  },
  devtools: { enabled: true },
  googleFonts: {
    families: {
      Inter: [400, 700],
      Pacifico: true,
    },
  },
  modules: [
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "@nuxtjs/seo",
    "@nuxtjs/tailwindcss",
    "@vite-pwa/nuxt",
    "@vueuse/nuxt",
    "notivue/nuxt",
    "nuxt-phosphor-icons",
  ],
  notivue: {
    position: "bottom-right",
  },
  site: {
    defaultLocale: "en",
    description: "Check whether a site is installable as an app",
    name: "Is PWA?",
    url: "https://is-pwa.vercel.app",
  },
  tailwindcss: {
    exposeConfig: true,
  },
});
