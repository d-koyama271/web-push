// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    baseURL: "/",
    head: {
      htmlAttrs: {
        lang: "ja",
      },
      title: "通知デモ",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "apple-touch-icon", href: "icons/web-512.png" },
      ],
    },
  },

  modules: ["@vite-pwa/nuxt"],

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "通知デモ",
      short_name: "Notify",
      description: "Web通知のデモサイトです。",
      start_url: "/",
      lang: "ja",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#4A90E2",
      icons: [
        {
          src: "icons/web-128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "icons/web-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: null,
    },
    // service workerの設定
    strategies: "injectManifest",
    srcDir: "plugins/pwa/",
    filename: "sw.js",
  },

  runtimeConfig: {
    public: {
      vapidPublicKey: process.env.NUXT_VAPID_PUBLIC_KEY,
      backendUrl: process.env.NUXT_BACKEND_URL,
    },
  },
});
