<template>
  <PageWrapper>
    <section v-if="featuredObject" class="home">
      <section class="home-hero">
        <div class="home-main-area">
          <!-- Logo -->
          <div class="home-logo-section">
            <div class="home-brand">
              <img v-no-right-click :src="fatLogo" alt="Andrea Dea Jones" draggable="false" />
            </div>
          </div>

          <!-- Divider -->
          <hr class="home-divider" />

          <!-- Text + Object row -->
          <div class="home-content-row">
            <div class="home-left-col">
              <p class="home-caption">
                <span class="line-1">{{ t('home.caption.line1') }}</span>
                <span class="line-2">{{ t('home.caption.line2') }}</span>
              </p>

              <p class="home-intro-text">{{ t('home.intro') }}</p>

              <section class="home-actions">
                <button class="home-explore" type="button" @click="goToObjectDetail">
                  <span class="home-explore-text">DISCOVER YO*01</span>
                  <span class="home-explore-arrow" aria-hidden="true">→</span>
                </button>

                <button class="home-inquiry" type="button" @click="goToContact">
                  {{ t('home.purchaseInquiry') }}
                </button>
              </section>
            </div>

            <div class="home-center-col">
              <button
                class="home-object-link"
                type="button"
                @click="goToObjectDetail"
                :aria-label="`Discover ${featuredObject.title}`"
              >
                <img
                  v-no-right-click
                  class="home-object-image"
                  :src="featuredObject.cover"
                  :alt="featuredObject.alt || featuredObject.title"
                  draggable="false"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Right image -->
        <article class="home-intro-card">
          <img v-no-right-click :src="introCopyImage" alt="I did this" draggable="false" />
        </article>
      </section>
    </section>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PageWrapper from '@/components/PageWrapper.vue'
import fatLogo from '@/assets/home/fat-logo.png'
import introCopyImage from '@/assets/home/i-did-this.png'
import featuredMetaRaw from '@/assets/home/featured/meta.json'
import { useCollections } from '@/composables/useCollections'

type FeaturedMeta = {
  slug?: string
  title?: string
  cover?: string
  alt?: string
}

const router = useRouter()
const { t } = useI18n()
const { getCollectionByObjectSlug } = useCollections()
const featuredMeta = featuredMetaRaw as FeaturedMeta

const featuredImageModules = import.meta.glob('@/assets/home/featured/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
})

const featuredCover = computed(() => {
  if (!featuredMeta.cover) return null

  const imageEntry = Object.entries(featuredImageModules).find(([path]) =>
    path.endsWith(`/${featuredMeta.cover}`),
  )

  if (!imageEntry) return null
  return ((imageEntry[1] as { default?: string }).default ?? imageEntry[1]) as string
})

const featuredObject = computed(() => {
  if (!featuredCover.value || !featuredMeta.title) {
    return null
  }

  const slug = typeof featuredMeta.slug === 'string' ? featuredMeta.slug.trim() : ''

  return {
    slug: slug || undefined,
    title: featuredMeta.title,
    cover: featuredCover.value,
    alt: featuredMeta.alt,
  }
})

const goToObjectDetail = () => {
  if (!featuredObject.value) return

  if (featuredObject.value.slug) {
    const collection = getCollectionByObjectSlug(featuredObject.value.slug)

    if (collection) {
      router.push({
        name: 'collectionObject',
        params: {
          collectionSlug: collection.slug,
          objectSlug: featuredObject.value.slug,
        },
      })
      return
    }
  }

  router.push({ name: 'collections' })
}

const goToContact = () => {
  router.push({ name: 'contact' })
}
</script>

<style scoped>
.home {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  background: #f8f6f6;
}

.home-logo-section {
  grid-row: 1;
  display: flex;
  align-items: flex-start;
  padding: 0;
}

.home-brand {
  display: flex;
  justify-content: flex-start;
  width: fit-content;
  max-width: 900px;
}

.home-brand img {
  display: block;
  width: 100%;
  max-width: 900px;
  height: auto;
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1180px) minmax(380px, 540px);
  width: min(100%, 1850px);
  column-gap: 1.75rem;
  padding: 3rem 4rem 1rem;
  margin: 0 auto;
  align-items: stretch;
}

.home-main-area {
  display: grid;
  grid-template-rows: auto 1px 1fr;
  row-gap: 2rem;
  min-width: 0;
  max-width: 1180px;
  height: 100%;
}


.home-left-col {
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
}

.home-divider {
  grid-row: 2;
  height: 1px;
  border: none;
  background: #1d1d1d;
  margin: 0;
  width: 100%;
}


.home-content-row {
  grid-row: 3;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.15fr);
  column-gap: 0.5rem;
  padding-top: 1rem;
  min-height: 0;
  height: 100%;
  align-items: stretch;
}


.home-caption {
  margin: 0 0 1.25rem;
  font-size: 2.4rem;
  line-height: 1.12;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.home-caption span {
  display: block;
}

.line-1 {
  font-size: 2.4rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
}

.line-2 {
  font-size: 1.35rem;
  line-height: 1.3;
  font-weight: 400;
}

.home-intro-text {
  margin: 0 0 1.6rem;
  font-size: 0.95rem;
  line-height: 1.65;
  font-weight: 400;
  white-space: pre-line;
  max-width: 34ch;
}

.home-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-top: clamp(2rem, 5vh, 4.5rem);
  padding-top: 0;
}

.home-explore {
  border: none;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 0;
  text-transform: uppercase;
  font-family: var(--font-body);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  font-weight: 600;
  font-size: 0.82rem;
  letter-spacing: 0.05em;
}

.home-explore-text {
  font-size: 0.8rem;
  line-height: 1;
}

.home-explore-arrow {
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  line-height: 1;
}

.home-inquiry {
  border: none;
  background: var(--color-accent);
  color: var(--color-text);
  cursor: pointer;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 0.82rem;
  padding: 0.95rem 2.6rem;
  min-width: 250px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.home-explore:hover,
.home-inquiry:hover {
  background: var(--color-text);
  color: var(--color-accent);
}

.home-inquiry:hover {
  background: var(--color-text);
}


.home-center-col {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  min-width: 0;
  padding: 0;
}

.home-object-link {
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: flex-start;
  justify-content: center;
}

.home-object-link:focus-visible {
  outline: 1px solid var(--color-text);
  outline-offset: 6px;
}

.home-object-link:hover .home-object-image {
  transform: translateY(-4px);
}

.home-object-image {
  width: 100%;
  max-width: 720px;
  height: auto;
  object-fit: contain;
  display: block;
  transition: transform 0.25s ease;
}

.home-intro-card {
  width: 100%;
  max-width: 540px;
  display: flex;
  align-items: stretch;
  min-height: unset;
  background: transparent;
  justify-self: end;
  height: 100%;
}

.home-intro-card img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}


@media (min-width: 1600px) {
  .home-actions {
    margin-top: auto;
    padding-top: 2rem;
  }
}

@media (max-width: 1599px) and (min-width: 1025px) {
  .home-actions {
    margin-top: clamp(2rem, 5vh, 4.5rem);
    padding-top: 0;
  }
}

@media (min-width: 1025px) {
  .home-hero {
    align-items: stretch;
  }

  .home-main-area {
    grid-template-rows: auto 1px 1fr;
    height: 100%;
  }

  .home-content-row {
    height: 100%;
    align-items: stretch;
  }

  .home-left-col {
    height: 100%;
  }

  .home-actions {
    margin-top: auto;
    padding-top: 2rem;
    padding-bottom: 19px;
  }
}

@media (max-width: 1450px) and (min-width: 1025px) {
  .home-hero {
    grid-template-columns: minmax(0, 1.15fr) minmax(320px, 430px);
    column-gap: 1.5rem;
  }

  .home-intro-card {
    max-width: 430px;
  }

  .home-content-row {
    grid-template-columns: minmax(320px, 1.1fr) minmax(240px, 0.9fr);
    column-gap: 1rem;
  }

  .home-object-image {
    max-width: 560px;
  }
    .home-brand {
    max-width: 650px;
  }

  .home-brand img {
    max-width: 650px;
  }
}

@media (max-width: 1200px) {

  .home-hero {
    grid-template-columns: minmax(0, 2fr) minmax(300px, 0.9fr);
    padding: 4rem 2rem;
    column-gap: 2rem;
    row-gap: 3rem;
  }

  .home-caption {
    font-size: 1.75rem;
    max-width: 11ch;
  }

  .line-1 {
    font-size: 1.75rem;
  }

  .line-2 {
    font-size: 1.05rem;
  }

  .home-intro-text {
    font-size: 0.85rem;
  }

  .home-intro-card {
    min-height: unset;
  }
}

@media (max-width: 1024px) {
  .home-logo-section {
    grid-column: 1;
    grid-row: 1;
    width: 100%;
    padding: 0;
  }

  .home-hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1px auto auto auto;
    padding: 2rem 1.5rem 0;
    gap: 2rem;
  }


  .home-left-col {
    grid-column: 1;
    grid-row: 3;
    padding-top: 0;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #1d1d1d;
  }

  .home-center-col {
    grid-column: 1;
    grid-row: 4;
  }

  .home-intro-card {
    grid-column: 1;
    grid-row: 5;
    min-height: 300px;
  }

  .home-caption {
    font-size: 1.1rem;
  }

  .line-1 {
    font-size: 1.1rem;
  }

  .line-2 {
    font-size: 0.85rem;
  }

  .home-intro-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .home {
    padding-bottom: 2rem;
  }

  .home-logo-section {
    width: 100%;
    padding: 0;
  }

  .home-hero {
    padding: 2rem 1rem 0;
    gap: 1.5rem;
  }

  .home-caption {
    font-size: 1rem;
  }

  .line-1 {
    font-size: 1rem;
    margin-bottom: 0.15rem;
  }

  .line-2 {
    font-size: 0.8rem;
  }

  .home-intro-text {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .home-explore {
    font-size: 0.75rem;
    gap: 12px;
  }

  .home-explore-text {
    font-size: 0.75rem;
  }

  .home-explore-arrow {
    font-size: 0.8rem;
  }

  .home-inquiry {
    font-size: 0.7rem;
    padding: 0.35rem 1.8rem;
  }

  .home-intro-card {
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  .home-logo-section {
    width: 100%;
    padding: 0;
  }

  .home-hero {
    padding: 1.5rem 0.75rem 0;
    gap: 1.2rem;
  }

  .home-left-col {
    gap: 1rem;
  }

  .home-caption {
    font-size: 0.9rem;
  }

  .line-1 {
    font-size: 0.9rem;
  }

  .line-2 {
    font-size: 0.75rem;
  }

  .home-intro-text {
    font-size: 0.7rem;
    line-height: 1.4;
  }

  .home-actions {
    gap: 0.8rem;
    margin-top: 0.5rem;
  }

  .home-explore {
    font-size: 0.65rem;
    gap: 10px;
  }

  .home-inquiry {
    font-size: 0.65rem;
    padding: 0.3rem 1.5rem;
  }

  .home-intro-card {
    min-height: 200px;
  }
}
</style>
