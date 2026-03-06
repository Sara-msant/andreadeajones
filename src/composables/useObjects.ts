import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ObjectItem {
  slug: string
  title: string
  dimensions?: string
  weight?: string
  description: string[]
  cover: string
  gallery: string[]
  order?: number
}

// load consolidated object metadata
import objectsMeta from '@/assets/objects/meta.json'

// load language-specific metadata for each project folder
const metaModules = import.meta.glob('@/assets/objects/*/meta-*.json', {
  eager: true,
})

// load all images inside each project folder
const imageModules = import.meta.glob('@/assets/objects/*/*.{png,jpg,jpeg,webp}', { eager: true })

export const useObjects = () => {
  const { locale } = useI18n()
  const objects = computed<ObjectItem[]>(() => {
    // folder -> meta (language-specific)
    const metaByFolder = new Map<string, any>()
    // Build config from consolidated meta.json
    const configByFolder = new Map<string, any>()
    objectsMeta.projects.forEach((item) => {
      configByFolder.set(item.folder, { order: item.order, slug: item.slug })
    })

    Object.entries(metaModules).forEach(([path, mod]) => {
      const parts = path.split('/')
      const folder = parts[parts.length - 2] as string // the project folder name
      const file = parts[parts.length - 1] as string // meta-en.json, meta-fr.json, etc.
      const meta = (mod as any).default ?? mod

      if (file.startsWith('meta-')) {
        // Language-specific content
        const lang = file.replace('meta-', '').replace('.json', '') // en, pt, fr
        if (lang === locale.value || (lang === 'en' && !metaByFolder.has(folder))) {
          metaByFolder.set(folder, meta)
        }
      }
    })

    // folder -> { cover, gallery }
    const imagesByFolder = new Map<
      string,
      { cover?: string; images: { src: string; file: string }[] }
    >()

    Object.entries(imageModules).forEach(([path, mod]) => {
      const src = (mod as any).default ?? (mod as string)
      const parts = path.split('/')
      const folder = parts[parts.length - 2] as string
      const file = parts[parts.length - 1] as string

      if (!imagesByFolder.has(folder)) {
        imagesByFolder.set(folder, { cover: undefined, images: [] })
      }
      const entry = imagesByFolder.get(folder)!
      // convention: any file starting with "cover" is the cover image
      if (/^cover/i.test(file)) {
        entry.cover = src
      }
      entry.images.push({ src, file })
    })

    const result: ObjectItem[] = []

    metaByFolder.forEach((meta, folder) => {
      const config = configByFolder.get(folder) ?? {}
      const imgEntry = imagesByFolder.get(folder) ?? {
        cover: undefined,
        images: [],
      }

      // sort images by filename so 01, 02, 03... are in order
      imgEntry.images.sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }))

      const allImages = imgEntry.images

      if (!allImages.length) {
        // no images, skip this project
        return
      }

      // pick cover: explicit cover if present, otherwise first image
      const coverSrc = imgEntry.cover ?? allImages[0]!.src

      // build gallery with cover as first item
      const gallery = [
        coverSrc,
        ...allImages.filter((img) => img.src !== coverSrc).map((img) => img.src),
      ]

      const slug: string =
        config.slug ??
        meta.slug ??
        folder
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')

      const cover = coverSrc

      const description = Array.isArray(meta.description)
        ? (meta.description as string[])
        : typeof meta.description === 'string'
          ? meta.description
              .split(/\n\n+/)
              .map((paragraph: string) => paragraph.trim())
              .filter(Boolean)
          : []

      const objectItem: ObjectItem = {
        slug,
        title: meta.title ?? folder,
        dimensions: meta.dimensions,
        weight: meta.weight,
        description,
        cover,
        gallery,
        order: config.order ?? meta.order,
      }

      result.push(objectItem)
    })

    // optional: sort by meta.order then title
    result.sort((a, b) => {
      const orderA = a.order ?? 9999
      const orderB = b.order ?? 9999
      if (orderA !== orderB) return orderA - orderB
      return a.title.localeCompare(b.title)
    })

    return result
  })

  const getObjectBySlug = (slug: string) => objects.value.find((item) => item.slug === slug)

  const getNextObjectSlug = (slug: string) => {
    const idx = objects.value.findIndex((item) => item.slug === slug)
    if (idx === -1) return undefined
    const nextIdx = (idx + 1) % objects.value.length
    return objects.value[nextIdx]?.slug
  }

  const getPreviousObjectSlug = (slug: string) => {
    const idx = objects.value.findIndex((item) => item.slug === slug)
    if (idx === -1) return undefined
    const prevIdx = (idx - 1 + objects.value.length) % objects.value.length
    return objects.value[prevIdx]?.slug
  }

  return {
    objects,
    getObjectBySlug,
    getNextObjectSlug,
    getPreviousObjectSlug,
  }
}
