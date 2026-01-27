import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@vite-pwa/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '数独学习游戏',
      short_name: '数独游戏',
      description: '面向小学生的数独学习游戏',
      theme_color: '#4f46e5',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
  },

  app: {
    head: {
      title: '数独学习游戏',
      meta: [
        { name: 'description', content: '面向小学生的在线数独学习游戏' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
