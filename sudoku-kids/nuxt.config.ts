export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
  ],

  typescript: {
    strict: true,
    typeCheck: false, // Disabled to avoid vite-plugin-checker issues
  },

  components: {
    dirs: [
      { path: '~/components/game', pathPrefix: false },
      { path: '~/components/setup', pathPrefix: false },
      { path: '~/components/ui', pathPrefix: false },
    ],
  },

  app: {
    head: {
      title: '数独游戏 - Sudoku Kids',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '专为小学生设计的可自定义数独游戏' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: [
    '~/assets/css/main.css',
  ],

  compatibilityDate: '2024-01-01',
});
