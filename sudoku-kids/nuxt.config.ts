// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  css: ['~/assets/styles/main.css'],

  typescript: {
    strict: false,
    typeCheck: false
  },

  app: {
    head: {
      title: 'Sudoku Kids - Learn and Play',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A fun Sudoku learning game for elementary students' }
      ]
    }
  }
})
