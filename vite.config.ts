import { fileURLToPath, URL } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import sitemap from 'vite-plugin-sitemap'

const staticRoutes = ['/', '/collections', '/about', '/contact']

const collectionsDir = resolve('./src/assets/collections')
const collectionObjectRoutes: string[] = []

try {
  const rootMeta = JSON.parse(readFileSync(join(collectionsDir, 'meta.json'), 'utf-8')) as {
    collections?: { folder?: string }[]
  }

  for (const collection of rootMeta.collections ?? []) {
    if (!collection.folder) continue
    const collectionFolder = join(collectionsDir, collection.folder)
    const collectionMeta = JSON.parse(
      readFileSync(join(collectionFolder, 'meta.json'), 'utf-8'),
    ) as { objects?: { folder?: string }[] }

    for (const obj of collectionMeta.objects ?? []) {
      if (!obj.folder) continue
      const objMetaPath = join(collectionFolder, obj.folder, 'meta.json')
      if (!existsSync(objMetaPath)) continue
      const objMeta = JSON.parse(readFileSync(objMetaPath, 'utf-8')) as { slug?: string }
      if (objMeta.slug?.trim()) {
        collectionObjectRoutes.push(`/collections/${collection.folder}/${objMeta.slug.trim()}`)
      }
    }
  }
} catch {
  // non-fatal: sitemap will still build without dynamic routes
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    sitemap({
      hostname: 'https://andreadeajones.com',
      dynamicRoutes: [...staticRoutes, ...collectionObjectRoutes],
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
