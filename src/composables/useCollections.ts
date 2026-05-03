import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import collectionsMeta from '@/assets/collections/meta.json'

const collectionModules = import.meta.glob('@/assets/collections/*/meta.json', {
  eager: true,
})

const collectionLocaleModules = import.meta.glob('@/assets/collections/*/locales/meta-*.json', {
  eager: true,
})

const collectionObjectModules = import.meta.glob('@/assets/collections/*/*/meta.json', {
  eager: true,
})

const collectionObjectLocaleModules = import.meta.glob(
  '@/assets/collections/*/*/locales/meta-*.json',
  {
    eager: true,
  },
)

const collectionObjectImageModules = import.meta.glob(
  '@/assets/collections/*/*/*.{png,jpg,jpeg,webp,avif}',
  {
    eager: true,
  },
)

export interface CollectionObjectSection {
  id: string
  text: string
  caption?: string
  image?: string
  videoEmbedUrl?: string
}

export interface CollectionObjectDetailItem {
  label: string
  value: string
}

export interface CollectionObjectDetails {
  title?: string
  items?: CollectionObjectDetailItem[]
}

export interface CollectionObjectFinalCta {
  title?: string
  text?: string
  buttonLabel?: string
}

export interface CollectionObjectItem {
  slug: string
  title: string
  dimensions?: string
  weight?: string
  sections: CollectionObjectSection[]
  cover: string
  gallery: string[]
  order?: number
  kind: 'object'
  collectionSlug: string
  displayTitle: string
  summary: string
  details?: CollectionObjectDetails
  finalCta?: CollectionObjectFinalCta
}

export interface CollectionPlaceholderItem {
  kind: 'placeholder'
  id: string
  title: string
  summary: string
  variant: 'solid' | 'outline'
}

export type CollectionGridItem = CollectionObjectItem | CollectionPlaceholderItem

export interface CollectionItem {
  slug: string
  title: string
  description: string
  objects: CollectionObjectItem[]
  items: CollectionGridItem[]
  order?: number
}

type CollectionObjectConfig = {
  slug: string
  title?: string
  dimensions?: string
  weight?: string
  cover?: string
  sections?: Array<{ id?: string; image?: string; youtube?: string }>
  id?: string
  order?: number
}

type CollectionPlaceholderConfig = {
  id: string
  variant: 'solid' | 'outline'
  order?: number
}

type CollectionConfig = {
  folder: string
  title: string
  order?: number
}

type RootCollectionsMeta = {
  collections: CollectionConfig[]
}

type CollectionFolderMeta = {
  objects?: Array<{ folder: string; order?: number }>
  placeholders?: CollectionPlaceholderConfig[]
}

type CollectionFolderLocaleMeta = {
  description?: string
  placeholders?: Record<string, { title?: string; summary?: string }>
}

type CollectionObjectLocaleMeta = {
  cardTitle?: string
  summary?: string
  sections?: Record<string, { text?: string; caption?: string | string[] }>
  details?: CollectionObjectDetails
  finalCta?: CollectionObjectFinalCta
}

const rootCollectionsMeta = collectionsMeta as RootCollectionsMeta

export const useCollections = () => {
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

  const collections = computed<CollectionItem[]>(() => {
    const folderMetaByFolder = new Map<string, CollectionFolderMeta>()
    const localeMetaByFolder = new Map<string, CollectionFolderLocaleMeta>()
    const objectMetaByKey = new Map<string, CollectionObjectConfig>()
    const objectLocaleMetaByKey = new Map<string, CollectionObjectLocaleMeta>()
    const objectImagesByKey = new Map<
      string,
      { cover?: string; images: { src: string; file: string }[] }
    >()

    Object.entries(collectionModules).forEach(([path, mod]) => {
      const parts = path.split('/')
      const folder = parts[parts.length - 2] as string
      const metaCandidate = (mod as { default?: unknown }).default ?? mod

      if (!metaCandidate || typeof metaCandidate !== 'object') {
        return
      }

      folderMetaByFolder.set(folder, metaCandidate as CollectionFolderMeta)
    })

    Object.entries(collectionLocaleModules).forEach(([path, mod]) => {
      const parts = path.split('/')
      const folder = parts[parts.length - 3] as string
      const file = parts[parts.length - 1] as string
      const metaCandidate = (mod as { default?: unknown }).default ?? mod

      if (!metaCandidate || typeof metaCandidate !== 'object') {
        return
      }

      const lang = file.replace('meta-', '').replace('.json', '')
      if (lang === locale.value || (lang === 'en' && !localeMetaByFolder.has(folder))) {
        localeMetaByFolder.set(folder, metaCandidate as CollectionFolderLocaleMeta)
      }
    })

    Object.entries(collectionObjectModules).forEach(([path, mod]) => {
      const parts = path.split('/')
      const collectionFolder = parts[parts.length - 3] as string
      const objectFolder = parts[parts.length - 2] as string
      const metaCandidate = (mod as { default?: unknown }).default ?? mod

      if (!metaCandidate || typeof metaCandidate !== 'object') {
        return
      }

      objectMetaByKey.set(
        `${collectionFolder}/${objectFolder}`,
        metaCandidate as CollectionObjectConfig,
      )
    })

    Object.entries(collectionObjectLocaleModules).forEach(([path, mod]) => {
      const parts = path.split('/')
      const collectionFolder = parts[parts.length - 4] as string
      const objectFolder = parts[parts.length - 3] as string
      const file = parts[parts.length - 1] as string
      const metaCandidate = (mod as { default?: unknown }).default ?? mod

      if (!metaCandidate || typeof metaCandidate !== 'object') {
        return
      }

      const lang = file.replace('meta-', '').replace('.json', '')
      const key = `${collectionFolder}/${objectFolder}`
      if (lang === locale.value || (lang === 'en' && !objectLocaleMetaByKey.has(key))) {
        objectLocaleMetaByKey.set(key, metaCandidate as CollectionObjectLocaleMeta)
      }
    })

    Object.entries(collectionObjectImageModules).forEach(([path, mod]) => {
      const parts = path.split('/')
      const collectionFolder = parts[parts.length - 3] as string
      const objectFolder = parts[parts.length - 2] as string
      const file = parts[parts.length - 1] as string
      const src = ((mod as { default?: string }).default ?? mod) as string
      const key = `${collectionFolder}/${objectFolder}`

      if (!objectImagesByKey.has(key)) {
        objectImagesByKey.set(key, { cover: undefined, images: [] })
      }

      const entry = objectImagesByKey.get(key)!
      if (/^cover(?!-)/i.test(file)) {
        entry.cover = src
      }
      entry.images.push({ src, file })
    })

    return rootCollectionsMeta.collections
      .map((config) => {
        const folderMeta = folderMetaByFolder.get(config.folder) ?? {}
        const localeMeta = localeMetaByFolder.get(config.folder) ?? {}
        const objectRefs = Array.isArray(folderMeta.objects) ? folderMeta.objects : []
        const placeholderConfigs = Array.isArray(folderMeta.placeholders)
          ? folderMeta.placeholders
          : []
        const localizedPlaceholders = localeMeta.placeholders ?? {}

        const collectionObjectsWithOrder = objectRefs
          .map((objectRef, index): (CollectionObjectItem & { sortOrder: number }) | null => {
            const objectKey = `${config.folder}/${objectRef.folder}`
            const itemConfig = objectMetaByKey.get(objectKey)
            if (!itemConfig) {
              return null
            }

            const imageEntry = objectImagesByKey.get(objectKey)
            if (!imageEntry || !imageEntry.images.length) {
              return null
            }

            imageEntry.images.sort((a, b) =>
              a.file.localeCompare(b.file, undefined, { numeric: true }),
            )

            const allImages = imageEntry.images
            const coverSrc = itemConfig.cover
              ? (allImages.find((img) => img.file.toLowerCase() === itemConfig.cover?.toLowerCase())
                  ?.src ??
                imageEntry.cover ??
                allImages[0]!.src)
              : (imageEntry.cover ?? allImages[0]!.src)
            const gallery = [
              coverSrc,
              ...allImages.filter((img) => img.src !== coverSrc).map((img) => img.src),
            ]

            const localizedObject = objectLocaleMetaByKey.get(objectKey) ?? {}

            const sectionConfigs = normalizeSectionConfigs(itemConfig.sections)
            const localizedSections = localizedObject.sections ?? {}
            const sections: CollectionObjectSection[] = sectionConfigs
              .map((sectionConfig): CollectionObjectSection | null => {
                const localizedSection = localizedSections[sectionConfig.id]
                if (!localizedSection || typeof localizedSection !== 'object') {
                  return null
                }

                const text =
                  typeof localizedSection.text === 'string' ? localizedSection.text.trim() : ''
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
                  ? allImages.find(
                      (img) => img.file.toLowerCase() === sectionConfig.image?.toLowerCase(),
                    )?.src
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
              .filter((section): section is CollectionObjectSection => section !== null)

          const collectionObject: CollectionObjectItem & { sortOrder: number } = {
            slug: itemConfig.slug,
            title: itemConfig.title ?? localizedObject.cardTitle?.trim() ?? itemConfig.slug,
            dimensions: itemConfig.dimensions,
            weight: itemConfig.weight,
            sections,
            details: localizedObject.details,
            finalCta: localizedObject.finalCta,
            cover: coverSrc,
            gallery,
            order: itemConfig.order,
            kind: 'object' as const,
            collectionSlug: config.folder,
            displayTitle:
              localizedObject.cardTitle?.trim() || itemConfig.title?.trim() || itemConfig.slug,
            summary: localizedObject.summary?.trim() || '',
            sortOrder: objectRef.order ?? itemConfig.order ?? index,
          }
            return collectionObject
          })
          .filter((item): item is CollectionObjectItem & { sortOrder: number } => item !== null)
          .sort((a, b) => a.sortOrder - b.sortOrder)

        const collectionObjects: CollectionObjectItem[] = collectionObjectsWithOrder.map(
          (entry) => {
            const item = { ...entry }
            delete (item as { sortOrder?: number }).sortOrder
            return item
          },
        )

        const placeholderItems: (CollectionPlaceholderItem & { sortOrder: number })[] =
          placeholderConfigs
            .map((placeholderConfig, index) => {
              const localizedPlaceholder = localizedPlaceholders[placeholderConfig.id] ?? {}

              return {
                kind: 'placeholder' as const,
                id: placeholderConfig.id,
                title: localizedPlaceholder.title?.trim() || '',
                summary: localizedPlaceholder.summary?.trim() || '',
                variant: placeholderConfig.variant,
                sortOrder: placeholderConfig.order ?? objectRefs.length + index,
              }
            })
            .sort((a, b) => a.sortOrder - b.sortOrder)

        const items: CollectionGridItem[] = [...collectionObjectsWithOrder, ...placeholderItems]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((entry) => {
            const item = { ...entry }
            delete (item as { sortOrder?: number }).sortOrder
            return item
          })

        return {
          slug: config.folder,
          title: config.title,
          description: localeMeta.description?.trim() || '',
          objects: collectionObjects,
          items,
          order: config.order,
        }
      })
      .filter((collection) => collection.objects.length > 0)
      .sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER
        if (orderA !== orderB) return orderA - orderB
        return a.title.localeCompare(b.title)
      })
  })

  const getCollectionBySlug = (slug: string) =>
    collections.value.find((collection) => collection.slug === slug)

  const getCollectionObjectBySlugs = (collectionSlug: string, objectSlug: string) =>
    getCollectionBySlug(collectionSlug)?.objects.find((item) => item.slug === objectSlug)

  const getCollectionByObjectSlug = (objectSlug: string) =>
    collections.value.find((collection) =>
      collection.objects.some((item) => item.slug === objectSlug),
    )

  return {
    collections,
    getCollectionBySlug,
    getCollectionObjectBySlugs,
    getCollectionByObjectSlug,
  }
}
