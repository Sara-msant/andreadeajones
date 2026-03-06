<template>
  <PageWrapper>
    <div class="portfolio-grid-wrapper">
      <Carousel
        :key="isMobile ? 'mobile' : 'desktop'"
        class="portfolio-carousel"
        v-bind="carouselConfig"
      >
        <Slide v-for="item in objects" :key="item.slug">
          <article class="portfolio-card" @click="goToObject(item)">
            <img v-no-right-click :src="item.cover" :alt="item.title" draggable="false" />

            <div class="portfolio-card-overlay">
              <div class="portfolio-card-overlay-content">
                <div class="portfolio-card-title">{{ item.title }}</div>
                <div v-if="item.dimensions || item.weight" class="portfolio-card-specs">
                  <p v-if="item.dimensions">Dimensions: {{ item.dimensions }}</p>
                  <p v-if="item.weight">Weight: {{ item.weight }}</p>
                </div>
              </div>
            </div>
          </article>
        </Slide>

        <template #addons>
          <Navigation />
        </template>
      </Carousel>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageWrapper from '@/components/PageWrapper.vue'
import { useObjects, type ObjectItem } from '@/composables/useObjects'

import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

const { objects } = useObjects()
const router = useRouter()
const isMobile = ref(window.innerWidth < 600)

const goToObject = (item: ObjectItem) => {
  router.push({ name: 'object', params: { slug: item.slug } })
}

// Breakpoints are min-width based
const baseConfig = {
  wrapAround: false,
  mouseDrag: true,
  touchDrag: true,
  transition: 450,
  snapAlign: 'start',
} as const

const carouselConfig = computed(() => {
  if (isMobile.value) {
    // Mobile: show one object card at a time
    return {
      ...baseConfig,
      dir: 'ltr' as const,
      itemsToShow: 1,
      height: '100%',
    }
  }

  // Desktop: max 2 objects visible at a time
  return {
    ...baseConfig,
    dir: 'ltr' as const,
    height: '100%',
    itemsToShow: Math.min(2, objects.value.length || 1),
  }
})

// Listen for window resize to update orientation
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 600
  })
}
</script>

<style scoped>
/* Fill viewport minus fixed header.
   box-sizing keeps padding inside the height. */
.portfolio-grid-wrapper {
  flex: 1;
  min-height: 0;
  height: calc(100vh - var(--header-h) - 8rem);
  position: relative;
  overflow: hidden;
}

.portfolio-carousel,
.portfolio-carousel :deep(.carousel__viewport),
.portfolio-carousel :deep(.carousel__track),
.portfolio-carousel :deep(.carousel__slide) {
  height: 100%;
  cursor: pointer;
  width: 100%;
}

.portfolio-carousel :deep(.carousel__viewport) {
  overflow: hidden;
}

/* Track: minimal padding (desktop only) */
@media (min-width: 601px) {
  .portfolio-carousel :deep(.carousel__track) {
    padding: 0.25rem 0;
  }

  .portfolio-carousel :deep(.carousel__slide) {
    padding: 0 0.75rem;
    box-sizing: border-box;
  }
}

/* Mobile: no padding on slides/track for clean vertical scrolling */
@media (max-width: 600px) {
  .portfolio-carousel :deep(.carousel__track) {
    padding: 0;
  }

  .portfolio-carousel :deep(.carousel__slide) {
    padding: 1.5rem 0;
  }
}

.portfolio-card {
  position: relative;
  height: calc(100vh - var(--header-h) - 10rem);
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
}

.portfolio-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-select: none;
}

.portfolio-card-overlay {
  position: absolute;
  inset: 0;
  background: #262a36;
  opacity: 0;
  transition: opacity 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* click still goes through */
  border-radius: 18px;
}

.portfolio-card-overlay-content {
  color: #fff;
  padding: 1rem;
  transform: translateY(6px);
  opacity: 0;
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.portfolio-card-title {
  font-size: 1.5rem;
  line-height: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.portfolio-card-specs {
  margin-top: 0.75rem;
  font-size: 0.82rem;
  line-height: 1.45;
  opacity: 0.95;
}

.portfolio-card-specs p {
  margin: 0;
}

@media (hover: hover) {
  .portfolio-card:hover .portfolio-card-overlay {
    opacity: 1;
  }

  .portfolio-card:hover .portfolio-card-overlay-content {
    opacity: 1;
    transform: translateY(0);
  }
}

.portfolio-carousel :deep(.carousel__prev),
.portfolio-carousel :deep(.carousel__next) {
  background: transparent;
  color: #323542;
  border: none;
  font-size: 2.5rem;
}

/* ===== Mobile (< 600px) ===== */
@media (max-width: 600px) {
  /* Carousel Track - let carousel handle scrolling naturally */
  .portfolio-carousel :deep(.carousel__track) {
    padding: 0;
  }

  .portfolio-card {
    height: calc(100vh - var(--header-h) - 6rem);
  }

  /* Overlay */
  .portfolio-card-overlay {
    background: transparent;
    opacity: 1;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .portfolio-card-overlay-content {
    opacity: 1;
    transform: translateY(0);
    padding: 1rem;
  }

  /* Navigation */
  .portfolio-carousel :deep(.carousel__prev) {
    order: -1;
  }

  .portfolio-carousel :deep(.carousel__next) {
    order: 1;
  }

  /* Maintain padding while sliding or dragging */
  .portfolio-carousel.is-sliding :deep(.carousel__slide),
  .portfolio-carousel.is-dragging :deep(.carousel__slide) {
    padding: 1.5rem 0 !important;
  }
}
</style>
