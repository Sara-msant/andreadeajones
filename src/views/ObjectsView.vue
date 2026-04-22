<template>
  <PageWrapper>
    <div class="portfolio-grid-wrapper">
      <section class="objects-intro" :aria-label="t('objects.introAria')">
        <p>
          {{ t('objects.intro') }}
        </p>
      </section>

      <div class="portfolio-grid" :class="{ 'single-object': displayObjects.length === 1 }">
        <article
          v-for="item in displayObjects"
          :key="item.slug ?? 'coming-soon'"
          class="portfolio-card"
          :class="{ 'portfolio-card--placeholder': item.isPlaceholder }"
          @click="goToObject(item)"
        >
          <div class="portfolio-card-image">
            <img
              v-no-right-click
              :src="item.cover"
              :alt="item.title"
              class="portfolio-card-image-base"
              :class="{ 'portfolio-card-image--blurred': item.isPlaceholder }"
              draggable="false"
            />
            <img
              v-if="item.hoverCover && !item.isPlaceholder"
              v-no-right-click
              :src="item.hoverCover"
              :alt="item.title"
              class="portfolio-card-image-hover"
              draggable="false"
            />
          </div>

          <div class="portfolio-card-info">
            <p class="portfolio-card-title">{{ item.title }}</p>
            <div v-if="item.dimensions || item.weight" class="portfolio-card-specs"></div>
          </div>
        </article>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PageWrapper from '@/components/PageWrapper.vue'
import { useObjects, type ObjectItem } from '@/composables/useObjects'

const { t } = useI18n()
const { objects } = useObjects()
const router = useRouter()

type ObjectsGridItem = ObjectItem & { isPlaceholder?: boolean }

// Put your blurred placeholder image in /public and update this path if needed.
const comingSoonCover = '/images/objects-coming-soon.jpg'

const comingSoonItem: ObjectsGridItem = {
  slug: '',
  title:'',
  sections: [],
  cover: comingSoonCover,
  gallery: [],
  isPlaceholder: true,
}

const displayObjects = computed<ObjectsGridItem[]>(() => [...objects.value, comingSoonItem])

const goToObject = (item: ObjectsGridItem) => {
  if (item.isPlaceholder || !item.slug) {
    return
  }

  router.push({ name: 'object', params: { slug: item.slug } })
}
</script>

<style scoped>
.portfolio-grid-wrapper {
  width: 100%;
  padding: 10rem 0 0; /* espace entre header et texte d intro */
}

.objects-intro {
  max-width: 760px;
  margin: 0 auto 10rem; /* espace entre texte d intro et cards */
  text-align: center;
  font-size: 0.88rem;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

.objects-intro p {
  margin: 0;
}

.objects-intro p + p {
  margin-top: 0.35rem;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 430px));
  gap: 1.5rem; /* espace entre les 2 cardsds */
  justify-content: center;
  width: 100%;
}

.portfolio-grid.single-object {
  grid-template-columns: minmax(280px, 50%);
  justify-content: center;
}

.portfolio-card {
  width: 100%;
  max-width: 430px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  justify-self: center;
}

.portfolio-card--placeholder {
  cursor: default;
  pointer-events: none;
}

.portfolio-card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background: #e8e8e8;
  overflow: hidden;
}

.portfolio-card-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
  -webkit-user-select: none;
  transition: opacity 220ms ease;
}

.portfolio-card-image-base {
  opacity: 1;
}

.portfolio-card-image-hover {
  opacity: 0;
}

.portfolio-card:hover .portfolio-card-image-base {
  opacity: 0;
}

.portfolio-card:hover .portfolio-card-image-hover {
  opacity: 1;
}

.portfolio-card-image--blurred {
  filter: blur(0px);
  transform: scale(1.12);
}

.portfolio-card-info {
  /*espace entre card et sous titre */
  margin-top: 1rem;
}

.portfolio-card-title {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.portfolio-card-specs {
  margin-top: 0.5rem;
  font-size: 0.82rem;
  line-height: 1.4;
  color: #2f2f2f;
}

.portfolio-card-specs p {
  margin: 0;
}

/* ===== Mobile (< 600px) ===== */
@media (max-width: 600px) {
  .portfolio-grid-wrapper {
    padding: 5rem 0;
  }

  .objects-intro {
    margin-bottom: 5rem;
    font-size: 0.8rem;
    line-height: 1.45;
    padding: 0 0.25rem;
  }

  .portfolio-grid {
    grid-template-columns: minmax(220px, 1fr);
    gap: 0.75rem;
  }

  .portfolio-grid.single-object {
    grid-template-columns: minmax(220px, 1fr);
  }
}
</style>
