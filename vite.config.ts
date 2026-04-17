import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import sitemap from 'vite-plugin-sitemap'
import objectsMeta from './src/assets/objects/meta.json'

const staticRoutes = ['/', '/object', '/edition', '/about', '/contact']
const objectEntries =
  (Array.isArray((objectsMeta as { objects?: unknown[] }).objects) &&
    (objectsMeta as { objects?: { slug?: string }[] }).objects) ||
  (Array.isArray((objectsMeta as { projects?: unknown[] }).projects) &&
    (objectsMeta as { projects?: { slug?: string }[] }).projects) ||
  []

const objectRoutes = objectEntries
  .map((project) => project.slug?.trim())
  .filter((slug): slug is string => Boolean(slug))
  .map((slug) => `/object/${slug}`)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    sitemap({
      hostname: 'https://www.andrea-dea-jones.com',
      dynamicRoutes: [...staticRoutes, ...objectRoutes],
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
