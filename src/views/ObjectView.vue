<template>
  <PageWrapper>
    <section v-if="objectItem" class="object-page">
      <section class="object-hero">
        <figure v-if="heroImage" class="object-hero-image">
          <img
            v-no-right-click
            :src="heroImage"
            :alt="t('object.heroAlt', { title: objectItem.title })"
            draggable="false"
          />
        </figure>

        <aside class="object-specs" v-if="objectItem.dimensions || objectItem.weight">
          <p class="spec-title">{{ objectItem.title }}.</p>
          <p class="spec-subtitle">{{ t('object.dimensions') }}</p>
          <p v-if="objectItem.dimensions" class="spec-line">{{ objectItem.dimensions }}</p>
          <p v-if="objectItem.weight" class="spec-line">
            {{ t('object.weight') }} {{ objectItem.weight }}
          </p>
        </aside>
      </section>

      <p v-if="descriptionBlocks[0]" class="object-paragraph">{{ descriptionBlocks[0] }}</p>

      <section
        v-for="(paragraph, index) in descriptionBlocks.slice(1)"
        :key="`paragraph-${index + 1}`"
        class="object-block"
      >
        <figure v-if="imageForParagraph(index + 1)" class="object-image">
          <img
            v-no-right-click
            :src="imageForParagraph(index + 1)"
            :alt="t('object.imageAlt', { title: objectItem.title, index: index + 2 })"
            draggable="false"
          />
        </figure>

        <p class="object-paragraph">{{ paragraph }}</p>
      </section>
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

const heroImage = computed(() => objectItem.value?.gallery[0] ?? null)
const descriptionBlocks = computed(() => objectItem.value?.description ?? [])

const imageForParagraph = (paragraphIndex: number): string | undefined => {
  return objectItem.value?.gallery[paragraphIndex]
}
</script>

<style scoped>
.object-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 9.5rem;
  padding: 5rem 0 8rem;
}

.object-hero {
  width: min(100%, 980px);
  margin: 0 auto;
}

.object-hero-image {
  width: 100%;
}

.object-hero-image img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.object-specs {
  margin-top: 0.9rem;
  margin-left: auto;
  width: max-content;
  text-align: right;
  text-transform: uppercase;
  font-size: 0.95rem;
  line-height: 1.2;
}

.spec-title {
  letter-spacing: 0.06em;
  margin-bottom: 0.6rem;
}

.spec-subtitle {
  text-decoration: underline;
  margin-bottom: 0.5rem;
}

.spec-line {
  margin-bottom: 0.2rem;
}

.object-block {
  width: min(100%, 980px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

.object-paragraph {
  width: min(100%, 980px);
  margin: 0 auto;
  text-align: center;
  font-size: 1.02rem;
  line-height: 1.45;
}

.object-not-found {
  width: 100%;
  padding: 3rem 0;
  text-align: center;
}

@media (max-width: 768px) {
  .object-page {
    gap: 5.5rem;
    padding: 2.5rem 0 4.5rem;
  }

  .object-paragraph,
  .object-block,
  .object-hero {
    width: 100%;
  }

  .object-specs {
    width: 100%;
    text-align: left;
    margin-top: 1rem;
  }

  .object-paragraph {
    font-size: 0.95rem;
  }
}
</style>
