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
  grid-column: 1 / 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
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
  grid-template-rows: auto 1fr auto;
  column-gap: 0.5rem;
  padding-top: 1rem;
  min-height: 0;
  height: 100%;
  align-items: start;
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
  grid-column: 1 / 2;
  grid-row: 3;
  align-self: end;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 0;
  padding-top: 2rem;
  padding-bottom: 19px;
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
  grid-column: 2 / 3;
  grid-row: 1 / 4;
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

/* Large laptops — MacBook 15/16, around 1461px–1650px */
@media (max-width: 1650px) and (min-width: 1461px) {
  .home-hero {
    grid-template-columns: minmax(0, 1fr) minmax(340px, 450px);
    width: min(100%, 1580px);
    column-gap: 1.5rem;
    padding: 2.5rem 3.5rem 1rem;
  }

  .home-main-area {
    max-width: none;
    row-gap: 1.6rem;
  }

  .home-brand,
  .home-brand img {
    max-width: 740px;
  }

  .home-intro-card {
    max-width: 450px;
  }

  .home-content-row {
    grid-template-columns: minmax(300px, 0.82fr) minmax(400px, 1.18fr);
    column-gap: 1rem;
    padding-top: 0.85rem;
  }

  .home-caption {
    font-size: clamp(2.05rem, 2.7vw, 2.35rem);
    max-width: 13ch;
  }

  .line-1 {
    font-size: inherit;
    margin-bottom: 1rem;
  }

  .line-2 {
    font-size: 1.2rem;
  }

  .home-intro-text {
    font-size: 0.9rem;
    line-height: 1.55;
    max-width: 32ch;
  }

  .home-center-col {
    justify-content: center;
    overflow: visible;
  }

  .home-object-link {
    width: 100%;
    overflow: visible;
  }

  .home-object-image {
    max-width: 660px;
    transform: scale(1.12);
    transform-origin: top center;
  }

  .home-object-link:hover .home-object-image {
    transform: translateY(-4px) scale(1.12);
  }

  .home-actions {
    padding-bottom: 0;
  }
}

/* Smaller laptops — around 1201px–1460px */
@media (max-width: 1460px) and (min-width: 1201px) {
  .home-hero {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 430px);
    width: min(100%, 1400px);
    column-gap: 1.4rem;
    padding: 2.5rem 2.75rem 1rem;
  }

  .home-main-area {
    max-width: none;
    row-gap: 1.5rem;
  }

  .home-brand,
  .home-brand img {
    max-width: 650px;
  }

  .home-intro-card {
    max-width: 430px;
  }

  .home-content-row {
    grid-template-columns: minmax(290px, 0.88fr) minmax(340px, 1.12fr);
    column-gap: 1rem;
    padding-top: 0.85rem;
  }

  .home-caption {
    font-size: 1.95rem;
    max-width: 13ch;
  }

  .line-1 {
    font-size: inherit;
    margin-bottom: 0.9rem;
  }

  .line-2 {
    font-size: 1.08rem;
  }

  .home-intro-text {
    font-size: 0.86rem;
    line-height: 1.55;
    max-width: 31ch;
  }

  .home-center-col {
    justify-content: center;
    overflow: visible;
  }

  .home-object-image {
    max-width: 600px;
    transform: scale(1.08);
    transform-origin: top center;
  }

  .home-object-link:hover .home-object-image {
    transform: translateY(-4px) scale(1.08);
  }

  .home-actions {
    padding-bottom: 0;
  }
}

/* Tablet landscape / very small laptops — 1025px–1200px */
@media (max-width: 1200px) and (min-width: 1025px) {
  .home-hero {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
    padding: 2.5rem 2rem 1rem;
    column-gap: 1.5rem;
  }

  .home-brand,
  .home-brand img {
    max-width: 560px;
  }

  .home-intro-card {
    max-width: 360px;
  }

  .home-content-row {
    grid-template-columns: minmax(260px, 0.95fr) minmax(300px, 1.05fr);
    column-gap: 1rem;
  }

  .home-caption {
    font-size: 1.65rem;
    max-width: 13ch;
  }

  .line-1 {
    font-size: inherit;
    margin-bottom: 0.8rem;
  }

  .line-2 {
    font-size: 0.98rem;
  }

  .home-intro-text {
    font-size: 0.8rem;
    line-height: 1.5;
    max-width: 30ch;
  }

  .home-center-col {
    justify-content: center;
  }

  .home-object-image {
    max-width: 500px;
    transform: scale(1.04);
    transform-origin: top center;
  }

  .home-object-link:hover .home-object-image {
    transform: translateY(-4px) scale(1.04);
  }

  .home-actions {
    padding-bottom: 0;
  }

  .home-center-col {
    justify-content: center;
    overflow: visible;
  }

  .home-object-link {
    width: 100%;
    overflow: visible;
  }
}

@media (max-width: 1024px) {
  .home-hero {
    display: flex;
    flex-direction: column;
    padding: 2rem 1.5rem 0;
    gap: 1.5rem;
    align-items: stretch;
  }

  .home-main-area,
  .home-content-row {
    display: contents;
  }

  .home-logo-section {
    order: 1;
    width: 100%;
    padding: 0;
  }

  .home-brand {
    width: 100%;
    max-width: 620px;
  }

  .home-brand img {
    width: 100%;
    max-width: 100%;
    height: auto;
  }

  .home-divider {
    order: 2;
    width: 100%;
  }

  .home-intro-card {
    order: 3;
    width: 100%;
    max-width: min(100%, 420px);
    justify-self: auto;
    align-self: center;
    height: auto;
    min-height: unset;
    margin-bottom: 1.5rem;
  }

  .home-intro-card img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  .home-left-col {
    order: 4;
    width: 100%;
    padding: 0;
    border-bottom: none;
    align-items: center;
    text-align: center;
  }

  .home-center-col {
    order: 5;
    width: 100%;
    justify-content: center;
  }

  .home-object-link {
    width: 100%;
    justify-content: center;
  }

  .home-object-image {
    max-width: min(78vw, 420px);
  }

  .home-actions {
    order: 6;
    width: 100%;
    margin-top: 0;
    padding-top: 0;
    padding-bottom: 0;
    gap: 0.9rem;
  }

  .home-caption {
    font-size: clamp(1.45rem, 5vw, 2rem);
    line-height: 1.15;
    max-width: 18ch;
    margin: 0 0 1rem;
    text-align: center;
  }

  .line-1 {
    font-size: inherit;
    margin-bottom: 0.7rem;
  }

  .line-2 {
    font-size: clamp(0.95rem, 3.3vw, 1.1rem);
    line-height: 1.3;
  }

  .home-intro-text {
    font-size: 0.85rem;
    line-height: 1.55;
    max-width: 30ch;
    margin: 0;
    text-align: center;
  }

  .home-actions {
    align-items: center;
  }

  .home-explore {
    font-size: 0.75rem;
    gap: 10px;
  }

  .home-explore-text {
    font-size: 0.75rem;
  }

  .home-explore-arrow {
    font-size: 0.8rem;
  }


  .home-inquiry {
    min-width: 0;
    width: 100%;
    max-width: 260px;
    font-size: 0.72rem;
    padding: 0.75rem 1.4rem;
  }
}

@media (max-width: 768px) {
  .home {
    padding-bottom: 2rem;
  }

  .home-hero {
    padding: 1.5rem 1rem 0;
    gap: 1.5rem;
  }

  .home-brand {
    max-width: 460px;
  }

  .home-object-image {
    max-width: min(78vw, 360px);
  }

  .home-intro-card {
    max-width: min(100%, 360px);
  }

  .home-caption {
    font-size: clamp(1.35rem, 6vw, 1.75rem);
  }

  .line-2 {
    font-size: 0.9rem;
  }

  .home-intro-text {
    font-size: 0.8rem;
    line-height: 1.55;
  }
}

@media (max-width: 480px) {
  .home-hero {
    padding: 1.25rem 0.75rem 0;
    gap: 1.25rem;
  }

  .home-brand {
    max-width: 340px;
  }

  .home-caption {
    font-size: 1.35rem;
    max-width: 18ch;
  }

  .line-1 {
    font-size: inherit;
    margin-bottom: 0.55rem;
  }

  .line-2 {
    font-size: 0.85rem;
  }

  .home-intro-text {
    font-size: 0.75rem;
    line-height: 1.5;
    max-width: 32ch;
  }

  .home-actions {
    gap: 0.75rem;
  }

  .home-object-image {
    max-width: min(82vw, 300px);
  }

  .home-intro-card {
    max-width: min(100%, 320px);
    margin-bottom: 1.25rem;
  }

  .home-inquiry {
    max-width: 240px;
    font-size: 0.65rem;
    padding: 0.55rem 1.2rem;
  }
}
</style>
