export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-02-12',
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  css: ['~/assets/styles/main.css'],
  typescript: {
    strict: true,
    typeCheck: false
  },
  imports: {
    dirs: ['composables', 'utils']
  },
  app: {
    head: {
      title: '数独学习游戏 - Sudoku Kids',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '给小学生学习和练习数独的在线游戏' }
      ]
    }
  }
});
