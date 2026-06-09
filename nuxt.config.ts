// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {
    // Private keys available only on server-side
    hfToken: process.env.HF_TOKEN || '',
    
    // Public keys exposed to the client
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  },

  app: {
    head: {
      title: 'Copilot Implementation Agent',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1' },
        { name: 'description', content: 'Transform project ideas into structured, phased technical implementation plans powered by AI' },
        { name: 'theme-color', content: '#000000' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
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