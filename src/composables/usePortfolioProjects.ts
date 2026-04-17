import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface PortfolioProject {
  slug: string
  title: string
  type: string
  location: string
  area: string
  year?: string | number
  status?: string
  description: string
  cover: string // main image for portfolio grid
  gallery: string[] // all images for the project page (including cover)
  order?: number
}

// load consolidated object metadata
import portfolioMeta from '@/assets/objects/meta.json'

// load language-specific metadata for each project folder
const metaModules = import.meta.glob('@/assets/objects/*/meta-*.json', {
  eager: true,
})

// load all images inside each project folder
const imageModules = import.meta.glob('@/assets/objects/*/*.{png,jpg,jpeg,webp}', { eager: true })

type PortfolioMeta = {
  slug?: string
  title?: string
  type?: string
  location?: string
  area?: string
  year?: string | number
  status?: string
  description?: string
  order?: number
}

type PortfolioConfig = {
  folder?: string
  order?: number
  slug?: string
}

export const usePortfolioProjects = () => {
  const { locale } = useI18n()
  const projects = computed<PortfolioProject[]>(() => {
    // folder -> meta (language-specific)
    const metaByFolder = new Map<string, PortfolioMeta>()
    // Build config from consolidated meta.json
    const configByFolder = new Map<string, PortfolioConfig>()
    const objectEntries =
      (Array.isArray((portfolioMeta as { objects?: unknown[] }).objects) &&
        (portfolioMeta as { objects?: PortfolioConfig[] }).objects) ||
      []

    objectEntries.forEach((project) => {
      if (!project.folder) return
      configByFolder.set(project.folder, { order: project.order, slug: project.slug })
    })

    Object.entries(metaModules).forEach(([path, mod]) => {
      const parts = path.split('/')
      const folder = parts[parts.length - 2] as string // the project folder name
      const file = parts[parts.length - 1] as string // meta-en.json, meta-fr.json, etc.
      const metaCandidate = (mod as { default?: unknown }).default ?? mod

      if (!metaCandidate || typeof metaCandidate !== 'object') {
        return
      }

      const meta = metaCandidate as PortfolioMeta

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
      const src = ((mod as { default?: string }).default ?? mod) as string
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

    const result: PortfolioProject[] = []

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

      const project: PortfolioProject = {
        slug,
        title: meta.title ?? folder,
        type: meta.type ?? '',
        location: meta.location ?? '',
        area: meta.area ?? '',
        year: meta.year,
        status: meta.status,
        description: meta.description ?? '',
        cover,
        gallery,
        order: config.order ?? meta.order,
      }

      result.push(project)
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

  const getProjectBySlug = (slug: string) => projects.value.find((p) => p.slug === slug)

  const getNextProjectSlug = (slug: string) => {
    const idx = projects.value.findIndex((p) => p.slug === slug)
    if (idx === -1) return undefined
    const nextIdx = (idx + 1) % projects.value.length
    return projects.value[nextIdx]?.slug
  }

  const getPreviousProjectSlug = (slug: string) => {
    const idx = projects.value.findIndex((p) => p.slug === slug)
    if (idx === -1) return undefined
    const prevIdx = (idx - 1 + projects.value.length) % projects.value.length
    return projects.value[prevIdx]?.slug
  }

  return {
    projects,
    getProjectBySlug,
    getNextProjectSlug,
    getPreviousProjectSlug,
  }
}
