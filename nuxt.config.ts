// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  
  runtimeConfig: {
    // Private keys available only on server-side
    hfToken: process.env.HF_TOKEN || '',
    
    // Public keys exposed to the client
    public: {}
  },

  app: {
    head: {
      title: 'Copilot Implementation Agent',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Transform project ideas into structured, phased technical implementation plans powered by AI' },
        { name: 'theme-color', content: '#0f172a' },
        { property: 'og:title', content: 'Copilot Implementation Agent' },
        { property: 'og:description', content: 'Transform project ideas into structured, phased technical implementation plans powered by AI' },
        { property: 'og:image', content: '/logo.svg' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo-white.svg' },
        { rel: 'apple-touch-icon', href: '/logo-white.svg' }
      ]
    }
  }
})