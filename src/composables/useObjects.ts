import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ObjectItem {
  slug: string
  title: string
  dimensions?: string
  weight?: string
  sections: ObjectSection[]
  cover: string
  hoverCover?: string
  gallery: string[]
  order?: number
}

export interface ObjectSection {
  id: string
  text: string
  caption?: string
  image?: string
  videoEmbedUrl?: string
}

// load consolidated object metadata
import objectsMeta from '@/assets/objects/meta.json'

// load language-specific metadata for each project folder
const metaModules = import.meta.glob('@/assets/objects/*/meta-*.json', {
  eager: true,
})

// load all images inside each project folder
const imageModules = import.meta.glob('@/assets/objects/*/*.{png,jpg,jpeg,webp}', { eager: true })

type ObjectMeta = {
  slug?: string
  sections?: Record<string, { text?: string; caption?: string | string[] }>
  order?: number
}

type SectionConfig = {
  id?: string
  image?: string
  youtube?: string
}

type ObjectConfig = {
  order?: number
  slug?: string
  title?: string
  dimensions?: string
  weight?: string
  cover?: string
  hoverCover?: string
  sections?: SectionConfig[]
}

type RootObjectsMeta = {
  objects: Array<
    ObjectConfig & {
      folder: string
    }
  >
}

const rootObjectsMeta = objectsMeta as RootObjectsMeta

export const useObjects = () => {
  const { locale } = useI18n()

  const getYoutubeEmbedUrl = (value?: string): string | undefined => {
    if (!value) return undefined

    const trimmed = value.trim()
    if (!trimmed) return undefined

    const idPattern = /^[A-Za-z0-9_-]{11}$/
    if (idPattern.test(trimmed)) {
      return `https://www.youtube.com/embed/${trimmed}`
    }

    try {
      const url = new URL(trimmed)
      const host = url.hostname.toLowerCase()

      if (host === 'youtu.be') {
        const id = url.pathname.replace(/^\//, '').split('/')[0]
        if (id && idPattern.test(id)) return `https://www.youtube.com/embed/${id}`
      }

      if (host === 'www.youtube.com' || host === 'youtube.com' || host === 'm.youtube.com') {
        const vParam = url.searchParams.get('v')
        if (vParam && idPattern.test(vParam)) {
          return `https://www.youtube.com/embed/${vParam}`
        }

        const parts = url.pathname.split('/').filter(Boolean)
        const markerIndex = parts.findIndex((part) =>
          ['embed', 'shorts', 'live'].includes(part.toLowerCase()),
        )
        if (markerIndex >= 0) {
          const id = parts[markerIndex + 1]
          if (id && idPattern.test(id)) return `https://www.youtube.com/embed/${id}`
        }
      }
    } catch {
      return undefined
    }

    return undefined
  }

  const normalizeSectionConfigs = (
    value: unknown,
  ): { id: string; image?: string; youtube?: string }[] => {
    if (!Array.isArray(value)) return []

    return value
      .map((entry): { id: string; image?: string; youtube?: string } | null => {
        if (!entry || typeof entry !== 'object') return null

        const id =
          typeof (entry as { id?: unknown }).id === 'string'
            ? (entry as { id: string }).id.trim()
            : ''

        if (!id) return null

        const image =
          typeof (entry as { image?: unknown }).image === 'string'
            ? (entry as { image: string }).image.trim()
            : ''

        const youtube =
          typeof (entry as { youtube?: unknown }).youtube === 'string'
            ? (entry as { youtube: string }).youtube.trim()
            : ''

        return {
          id,
          image: image || undefined,
          youtube: youtube || undefined,
        }
      })
      .filter((entry): entry is { id: string; image?: string; youtube?: string } => Boolean(entry))
  }

  const objects = computed<ObjectItem[]>(() => {
    // folder -> meta (language-specific)
    const metaByFolder = new Map<string, ObjectMeta>()
    // Build config from consolidated meta.json
    const configByFolder = new Map<string, ObjectConfig>()
    rootObjectsMeta.objects.forEach((item) => {
      configByFolder.set(item.folder, {
        order: item.order,
        slug: item.slug,
        title: item.title,
        dimensions: item.dimensions,
        weight: item.weight,
        cover: item.cover,
        hoverCover: item.hoverCover,
        sections: item.sections,
      })
    })

    Object.entries(metaModules).forEach(([path, mod]) => {
      const parts = path.split('/')
      const folder = parts[parts.length - 2] as string // the project folder name
      const file = parts[parts.length - 1] as string // meta-en.json, meta-fr.json, etc.
      const metaCandidate = (mod as { default?: unknown }).default ?? mod

      if (!metaCandidate || typeof metaCandidate !== 'object') {
        return
      }

      const meta = metaCandidate as ObjectMeta

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
      { cover?: string; hoverCover?: string; images: { src: string; file: string }[] }
    >()

    Object.entries(imageModules).forEach(([path, mod]) => {
      const src = ((mod as { default?: string }).default ?? mod) as string
      const parts = path.split('/')
      const folder = parts[parts.length - 2] as string
      const file = parts[parts.length - 1] as string

      if (!imagesByFolder.has(folder)) {
        imagesByFolder.set(folder, { cover: undefined, hoverCover: undefined, images: [] })
      }
      const entry = imagesByFolder.get(folder)!
      // convention: files starting with "cover-hover" are used for card hover state.
      if (/^cover-hover/i.test(file)) {
        entry.hoverCover = src
      } else if (/^cover(?!-hover)/i.test(file)) {
        entry.cover = src
      }
      entry.images.push({ src, file })
    })

    const result: ObjectItem[] = []

    metaByFolder.forEach((meta, folder) => {
      const config = configByFolder.get(folder) ?? {}
      const imgEntry = imagesByFolder.get(folder) ?? {
        cover: undefined,
        hoverCover: undefined,
        images: [],
      }

      // sort images by filename so 01, 02, 03... are in order
      imgEntry.images.sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }))

      const allImages = imgEntry.images

      if (!allImages.length) {
        // no images, skip this project
        return
      }

      // pick cover: explicit config first, then filename convention, then first image
      const coverSrc = config.cover
        ? (allImages.find((img) => img.file.toLowerCase() === config.cover?.toLowerCase())?.src ??
          imgEntry.cover ??
          allImages[0]!.src)
        : (imgEntry.cover ?? allImages[0]!.src)
      const hoverCoverSrc = config.hoverCover
        ? allImages.find((img) => img.file.toLowerCase() === config.hoverCover?.toLowerCase())?.src
        : imgEntry.hoverCover

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

      const sectionConfigs = normalizeSectionConfigs(config.sections)
      const localizedSections = meta.sections ?? {}

      const sections: ObjectSection[] = sectionConfigs
        .map((sectionConfig): ObjectSection | null => {
          const localizedSection = localizedSections[sectionConfig.id]
          if (!localizedSection || typeof localizedSection !== 'object') {
            return null
          }

          const text = typeof localizedSection.text === 'string' ? localizedSection.text.trim() : ''
          if (!text) {
            return null
          }

          const caption =
            typeof localizedSection.caption === 'string'
              ? localizedSection.caption.trim()
              : Array.isArray(localizedSection.caption)
                ? localizedSection.caption
                    .map((line) => (typeof line === 'string' ? line.trim() : ''))
                    .filter(Boolean)
                    .join('\n')
                : ''

          const imageSrc = sectionConfig.image
            ? allImages.find((img) => img.file.toLowerCase() === sectionConfig.image?.toLowerCase())
                ?.src
            : undefined

          const videoEmbedUrl = getYoutubeEmbedUrl(sectionConfig.youtube)

          return {
            id: sectionConfig.id,
            text,
            ...(caption ? { caption } : {}),
            ...(imageSrc ? { image: imageSrc } : {}),
            ...(videoEmbedUrl ? { videoEmbedUrl } : {}),
          }
        })
        .filter((section): section is ObjectSection => section !== null)

      const objectItem: ObjectItem = {
        slug,
        title: config.title ?? folder,
        dimensions: config.dimensions,
        weight: config.weight,
        sections,
        cover,
        ...(hoverCoverSrc && hoverCoverSrc !== cover ? { hoverCover: hoverCoverSrc } : {}),
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
