<template>
  <PageWrapper>
    <div v-if="objectItem" class="object-floating-actions">
      <button type="button" class="object-inquiry" @click="goToContact">
        {{ t('home.purchaseInquiry') }}
      </button>
    </div>

    <section v-if="objectItem" class="object-page">
      <section
        v-for="(section, index) in sections"
        :key="`section-${index + 1}`"
        class="object-block"
      >
        <figure v-if="section.image || section.videoEmbedUrl" class="object-image">
          <img
            v-if="section.image"
            v-no-right-click
            :src="section.image"
            :alt="t('object.imageAlt', { title: objectItem.title, index: index + 1 })"
            draggable="false"
          />

          <div v-else-if="section.videoEmbedUrl" class="object-video-wrap">
            <iframe
              :src="section.videoEmbedUrl"
              :title="`${objectItem.title} video ${index + 1}`"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </figure>

        <p
          v-if="section.caption"
          class="object-image-caption"
          v-html="formatRichText(section.caption)"
        ></p>

        <p class="object-paragraph" v-html="formatRichText(section.text)"></p>
      </section>

      <section
        v-if="objectDetails?.items?.length"
        class="object-details-section"
        aria-labelledby="object-details-title"
      >
        <p id="object-details-title" class="object-section-label">
          {{ objectDetails.title }}
        </p>

        <dl class="object-details-list">
          <div v-for="detail in objectDetails.items" :key="detail.label">
            <dt>{{ detail.label }}</dt>
            <dd>{{ detail.value }}</dd>
          </div>
        </dl>
      </section>

     <section
        v-if="objectFinalCta?.title || objectFinalCta?.text || objectFinalCta?.buttonLabel"
        class="object-final-cta"
        :aria-labelledby="objectFinalCta?.title ? 'object-final-cta-title' : undefined"
      >
        <p
          v-if="objectFinalCta.title"
          id="object-final-cta-title"
          class="object-final-cta-title"
        >
          {{ objectFinalCta.title }}
        </p>

        <p v-if="objectFinalCta.text" class="object-final-cta-text">
          {{ objectFinalCta.text }}
        </p>

        <button type="button" class="object-final-cta-button" @click="goToContact">
          {{ objectFinalCta.buttonLabel || t('home.purchaseInquiry') }}
        </button>
      </section>

      <button
        type="button"
        class="scroll-top-button"
        :aria-label="t('object.scrollToTop')"
        @click="scrollToTop"
      >
        ↑
      </button>
    </section>

    <section v-else class="object-not-found">
      <p>{{ t('object.notFound') }}</p>
    </section>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useCollections } from '@/composables/useCollections'
import PageWrapper from '@/components/PageWrapper.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { getCollectionObjectBySlugs } = useCollections()

const collectionSlug = computed(() =>
  typeof route.params.collectionSlug === 'string' ? route.params.collectionSlug : '',
)
const objectSlug = computed(() =>
  typeof route.params.objectSlug === 'string' ? route.params.objectSlug : '',
)
const objectItem = computed(() => {
  if (collectionSlug.value && objectSlug.value) {
    return getCollectionObjectBySlugs(collectionSlug.value, objectSlug.value) ?? null
  }

  return null
})
const sections = computed(() => objectItem.value?.sections ?? [])

const objectDetails = computed(() => objectItem.value?.details ?? null)

const objectFinalCta = computed(() => objectItem.value?.finalCta ?? null)

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const formatRichText = (value: string): string => {
  const escaped = escapeHtml(value)
  const withUnderline = escaped.replace(/__([^_\n]+)__/g, '<span class="rich-underline">$1</span>')
  const withItalic = withUnderline.replace(/_([^_\n]+)_/g, '<span class="rich-italic">$1</span>')
  return withItalic.replace(/\n/g, '<br />')
}

const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToContact = () => {
  router.push({ name: 'contact' })
}


</script>

<style scoped>
.object-floating-actions {
  position: fixed;
  top: 122px;
  right: 2.5rem;
  z-index: 30;
}

.object-inquiry {
  border: none;
  background: var(--color-accent);
  color: var(--color-text);
  cursor: pointer;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 1rem;
  letter-spacing: 0.03em;
  padding: 0.48rem 1.8rem;
}

.object-inquiry:hover {
  background: var(--color-text);
  color: var(--color-accent);
}

.object-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(5.5rem, 9vh, 8rem);
  padding: 1rem 0 6rem;
}

.object-block {
  width: min(100%, 980px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.object-image {
  width: 100%;
  display: flex;
  justify-content: center;
}

.object-image img {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: min(78vh, 860px);
  height: auto;
  object-fit: contain;
}

.object-video-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}

.object-video-wrap iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.object-image-caption {
  width: min(100%, 980px);
  margin: 0.65rem auto 0;
  text-align: right;
  text-transform: uppercase;
  white-space: pre-line;
  font-size: 0.82rem;
  line-height: 1.25;
  letter-spacing: 0.02em;
}

.object-paragraph {
  width: min(100%, 58ch);
  margin: 0 auto;
  padding-top: clamp(3rem, 6vh, 5.5rem);
  text-align: center;
  font-size: 1.08rem;
  line-height: 1.55;
}

.object-image-caption :deep(.rich-italic),
.object-paragraph :deep(.rich-italic) {
  font-style: italic;
}

.object-image-caption :deep(.rich-underline),
.object-paragraph :deep(.rich-underline) {
  text-decoration: underline;
  text-underline-offset: 0.12em;
}

.object-not-found {
  width: 100%;
  padding: 3rem 0;
  text-align: center;
}

.scroll-top-button {
  align-self: center;
  margin-top: -1rem;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 2.4rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.6rem;
}

.scroll-top-button:hover {
  opacity: 0.7;
}

.scroll-top-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.object-details-section {
  width: min(100%, 600px);
  margin: 0 auto;
  padding-top: 2.5rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.object-section-label {
  margin: 0 0 2rem;
  text-transform: uppercase;
  font-size: 0.82rem;
  line-height: 1.2;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.object-details-list {
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.object-details-list div {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 1.5rem;
  align-items: baseline;
}

.object-details-list dt,
.object-details-list dd {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.45;
}

.object-details-list dt {
  text-align: right;
  text-transform: uppercase;
  text-decoration: underline;
  text-underline-offset: 0.12em;
  font-weight: 600;
}

.object-details-list dd {
  text-align: left;
}

.object-final-cta {
  width: min(100%, 620px);
  margin: 0 auto;
  text-align: center;
}

.object-final-cta-title {
  margin: 0 0 1.2rem;
  text-transform: uppercase;
  font-size: 1.15rem;
  line-height: 1.2;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.object-final-cta-text {
  width: min(100%, 44ch);
  margin: 0 auto 2rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.object-final-cta-button {
  border: none;
  background: var(--color-accent);
  color: var(--color-text);
  cursor: pointer;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 0.86rem;
  padding: 1rem 2.9rem;
  min-width: 280px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.object-final-cta-button:hover {
  background: var(--color-text);
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .object-floating-actions {
    position: fixed;
    top: 82px;
    right: 1rem;
    bottom: auto;
    z-index: 40;
  }

  .object-inquiry {
    font-size: 0.72rem;
    padding: 0.45rem 0.95rem;
  }

  .object-page {
    gap: 4.5rem;
    padding: 4rem 1rem 5rem;
  }


  .object-block {
    width: 100%;
  }

  .object-image img {
    max-width: 100%;
    max-height: none;
  }

   .object-paragraph {
    width: min(100%, 36ch);
    padding-top: 2.75rem;
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .object-image-caption {
    font-size: 0.76rem;
    line-height: 1.25;
  }

  .object-details-section {
    width: min(100%, 36ch);
    padding-top: 2rem;
  }


  .object-section-label {
    margin-bottom: 1.5rem;
  }

  .object-details-list {
    gap: 1rem;
  }

  .object-details-list div {
    grid-template-columns: 0.9fr 1.35fr;
    gap: 1.8rem;
  }

  .object-details-list dt {
    text-align: right;
    font-size: 0.72rem;
  }

  .object-details-list dd {
    text-align: left;
    font-size: 0.78rem;
  }

  .object-final-cta {
    width: min(100%, 34ch);
  }

  .object-final-cta-title {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  .object-final-cta-text {
    width: min(100%, 32ch);
    font-size: 0.85rem;
    line-height: 1.55;
  }

  .object-final-cta-button {
    min-width: 0;
    width: 100%;
    max-width: 260px;
    font-size: 0.72rem;
    padding: 0.75rem 1.4rem;
  }
}

@media (max-width: 390px) {
   .object-floating-actions {
    top: 74px;
    right: 1rem;
    bottom: auto;
  }

  .object-inquiry {
    font-size: 0.7rem;
    padding: 0.36rem 0.9rem;
  }

  .object-page {
    gap: 4rem;
    padding: 4rem 1rem 5rem;
  }

  .object-paragraph {
    padding-top: 3rem;
  }
}

@media (max-width: 360px) {
  .object-details-list div {
    grid-template-columns: 1fr;
    gap: 0.15rem;
  }

  .object-details-list dt,
  .object-details-list dd {
    text-align: center;
  }
}


</style>
