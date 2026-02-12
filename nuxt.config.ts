export default defineNuxtConfig({
  app: {
    head: {
      title: '数独学习游戏',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '一个为小学生设计的数独学习游戏' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  css: [
    '~/assets/css/tailwind.css'
  ],
  
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  
  modules: [
    '@pinia/nuxt'
  ],
  
  pinia: {
    autoImports: [
      'defineStore',
      'acceptHMRUpdate'
    ]
  },
  
  imports: {
    dirs: [
      'stores',
      'composables'
    ]
  },
  
  devtools: {
    enabled: true
  }
})
