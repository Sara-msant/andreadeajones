import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    sitemap({
      hostname: 'https://www.jora-studio.com',
      dynamicRoutes: ['/', '/welcome', '/services', '/portfolio', '/studio', '/contact-us'],
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
