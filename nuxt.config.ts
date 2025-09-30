import { description, displayName, name } from "./package.json";

export default defineNuxtConfig({
  colorMode: {
    classSuffix: "",
  },
  devtools: { enabled: false },
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
  seo: {
    meta: {
      description,
      themeColor: [
        {
          content: "rgb(124, 45, 18)",
          media: "(prefers-color-scheme: dark)",
        },
        {
          content: "rgb(255, 237, 213)",
          media: "(prefers-color-scheme: light)",
        },
      ],
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "apple-touch-icon",
          href: "/icons/apple-touch-icon.png",
        },
      ],
    },
  },
  site: {
    name: displayName,
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
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      id: name,
      description,
      name: displayName,
      short_name: displayName,
      icons: [
        {
          src: "icons/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "icons/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "icons/pwa-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "icons/pwa-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
  },
});
