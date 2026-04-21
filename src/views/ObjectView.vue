<template>
  <PageWrapper>
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
import { useRoute } from 'vue-router'
import { useObjects } from '@/composables/useObjects'
import PageWrapper from '@/components/PageWrapper.vue'

const route = useRoute()
const { t } = useI18n()
const { getObjectBySlug } = useObjects()

const slug = computed(() => route.params.slug as string)
const objectItem = computed(() => getObjectBySlug(slug.value) ?? null)
const sections = computed(() => objectItem.value?.sections ?? [])

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
</script>

<style scoped>
.object-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15rem; /* espace entre dessus de la photo et texte du desssus*/
  padding: 1rem 0 8rem; /* espace entre header et photo du tabouret 1*/
}

.object-block {
  width: min(100%, 980px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem; /*espace entre photos et sous-titre */
}

.object-image {
  width: 100%;
}

.object-image img {
  display: block;
  width: 100%;
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
  width: 100%;
  margin-top: 0.7rem;
  text-align: right;
  text-transform: uppercase;
  white-space: pre-line;
  font-size: 0.9rem;
  line-height: 1.2;
}

.object-paragraph {
  width: min(100%, 980px);
  margin: 0 auto;
  padding-top: 150px; /*espace entre le haut du text et le sous titre */
  text-align: center;
  font-size: 1.02rem;
  line-height: 1.45;
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
  margin-top: -1.5rem;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 5rem;
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

@media (max-width: 768px) {
  .object-page {
    gap: 5rem;
    padding: 5rem 0 5rem;
  }

  .object-paragraph,
  .object-block {
    width: 100%;
  }

  .object-image-caption {
    text-align: right;
  }

  .object-paragraph {
    padding-top: 5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 390px) {
  .object-page {
    gap: 4rem;
    padding: 4rem 0;
  }

  .object-paragraph {
    padding-top: 4rem;
  }
}
</style>
