// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    baseURL: "/web-push/",
  },
  app:{
    head: {
      htmlAttrs:{
        lang: 'ja'
      },
      title: "通知デモ",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  modules: ["@vite-pwa/nuxt"],

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Web Notification Demo",
      short_name: "NotifDemo",
      description: "Web通知のデモサイト",
      lang: "ja",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#4A90E2",
      icons: [
        {
          src: "icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {},
  },
});
