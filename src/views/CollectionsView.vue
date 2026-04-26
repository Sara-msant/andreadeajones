<template>
  <PageWrapper>
    <div class="collections-page">
      <section class="collections-intro" :aria-label="t('collections.introAria')">
        <p>{{ t('collections.introLine1') }}</p>
        <p>{{ t('collections.introLine2') }}</p>
      </section>

      <section
        v-for="collection in collections"
        :key="collection.slug"
        class="collection-section"
        :aria-labelledby="`collection-${collection.slug}`"
      >
        <header class="collection-header">
          <h1 :id="`collection-${collection.slug}`" class="collection-title">
            {{ collection.title }}
          </h1>
          <p class="collection-description">{{ collection.description }}</p>
        </header>

        <div
          class="collection-grid"
          :class="{ 'collection-grid--single': collection.items.length === 1 }"
        >
          <article
            v-for="item in collection.items"
            :key="item.kind === 'object' ? item.slug : item.id"
            class="collection-card"
            :class="[
              item.kind === 'object' ? 'collection-card--object' : '',
              item.kind === 'placeholder' ? 'collection-card--placeholder' : '',
            ]"
            @click="goToCollectionObject(collection.slug, item)"
          >
            <template v-if="item.kind === 'object'">
              <div class="collection-card-image">
                <img
                  v-no-right-click
                  :src="item.cover"
                  :alt="item.title"
                  class="collection-card-image-main"
                  draggable="false"
                />
              </div>
            </template>
            <div
              v-else
              class="collection-card-placeholder-space"
              :class="[
                item.variant === 'solid' ? 'collection-card-placeholder-space--solid' : '',
                item.variant === 'outline' ? 'collection-card-placeholder-space--outline' : '',
              ]"
            ></div>

            <div class="collection-card-info">
              <p class="collection-card-title">
                {{ item.kind === 'object' ? item.displayTitle : item.title }}
              </p>
              <p class="collection-card-summary">{{ item.summary }}</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PageWrapper from '@/components/PageWrapper.vue'
import { useCollections, type CollectionGridItem } from '@/composables/useCollections'

const { t } = useI18n()
const router = useRouter()
const { collections } = useCollections()

const goToCollectionObject = (collectionSlug: string, item: CollectionGridItem) => {
  if (item.kind !== 'object') {
    return
  }

  router.push({
    name: 'collectionObject',
    params: {
      collectionSlug,
      objectSlug: item.slug,
    },
  })
}
</script>

<style scoped>
.collections-page {
  width: 100%;
  padding: 8rem 0 0;
}

.collections-intro {
  max-width: 880px;
  margin: 0 auto 7rem;
  text-align: center;
  font-size: 0.88rem;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

.collections-intro p {
  margin: 0;
}

.collections-intro p + p {
  margin-top: 0.35rem;
}

.collection-section + .collection-section {
  margin-top: 8rem;
}

.collection-header {
  width: min(100%, calc((430px * 3) + (1.5rem * 2)));
  margin: 0 auto 1.8rem;
}

.collection-title {
  margin: 0;
  font-size: clamp(2.15rem, 4.4vw, 3.5rem);
  line-height: 0.95;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.collection-description {
  margin: 0.9rem 0 0;
  font-size: 0.94rem;
  line-height: 1.45;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 430px));
  gap: 1.5rem;
  align-items: stretch;
  width: min(100%, calc((430px * 3) + (1.5rem * 2)));
  margin: 0 auto;
}

.collection-grid--single {
  grid-template-columns: minmax(240px, 430px);
  width: min(100%, 430px);
}

.collection-card {
  width: 100%;
  max-width: 430px;
  min-height: 28rem;
  display: flex;
  flex-direction: column;
  justify-self: center;
  cursor: pointer;
}

.collection-card--placeholder {
  cursor: default;
}

.collection-card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background: #f3f3f0;
  overflow: hidden;
}

.collection-card-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
  -webkit-user-select: none;
  transition: filter 180ms ease;
}

.collection-card-image-main {
  opacity: 1;
}

.collection-card--object:hover .collection-card-image-main {
  filter: grayscale(16%) brightness(0.93);
}

.collection-card-placeholder-space {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
}

.collection-card-placeholder-space--solid {
  background: #67ff00;
}

.collection-card-placeholder-space--outline {
  border: 1px solid rgba(0, 0, 0, 0.4);
}

.collection-card-info {
  margin-top: 1rem;
}

.collection-card-title {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.3;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.collection-card-summary {
  margin: 0.7rem 0 0;
  font-size: 0.88rem;
  line-height: 1.45;
}

@media (max-width: 980px) {
  .collections-page {
    padding-top: 6rem;
  }

  .collection-header {
    width: min(100%, calc((430px * 2) + 1.5rem));
  }

  .collection-grid,
  .collection-grid--single {
    grid-template-columns: repeat(2, minmax(240px, 430px));
    width: min(100%, calc((430px * 2) + 1.5rem));
  }

  .collection-grid--single {
    grid-template-columns: minmax(240px, 430px);
    width: min(100%, 430px);
  }
}

@media (max-width: 600px) {
  .collections-page {
    padding-top: 5rem;
  }

  .collections-intro {
    margin-bottom: 5rem;
    font-size: 0.8rem;
    line-height: 1.45;
  }

  .collection-section + .collection-section {
    margin-top: 5rem;
  }

  .collection-grid,
  .collection-grid--single {
    grid-template-columns: minmax(220px, 1fr);
    width: 100%;
  }

  .collection-header {
    width: 100%;
  }

  .collection-card {
    min-height: 24rem;
  }

  .collection-card-placeholder-space {
    min-height: 18rem;
  }
}
</style>
