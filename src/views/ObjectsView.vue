<template>
  <PageWrapper>
    <div class="portfolio-grid-wrapper">
      <section class="objects-intro" :aria-label="t('objects.introAria')">
        <p>
          {{ t('objects.intro') }}
        </p>
      </section>

      <div
        class="portfolio-grid"
        :class="{ 'single-object': objects.length === 1 }"
      >
        <article
          v-for="item in objects"
          :key="item.slug"
          class="portfolio-card"
          @click="goToObject(item)"
        >
          <div class="portfolio-card-image">
            <img v-no-right-click :src="item.cover" :alt="item.title" draggable="false" />
          </div>

          <div class="portfolio-card-info">
            <p class="portfolio-card-title">{{ item.title }}</p>
            <div v-if="item.dimensions || item.weight" class="portfolio-card-specs">
              <p v-if="item.dimensions">{{ t('objects.dimensions') }} {{ item.dimensions }}</p>
              <p v-if="item.weight">{{ t('objects.weight') }} {{ item.weight }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PageWrapper from '@/components/PageWrapper.vue'
import { useObjects, type ObjectItem } from '@/composables/useObjects'

const { t } = useI18n()
const { objects } = useObjects()
const router = useRouter()

const goToObject = (item: ObjectItem) => {
  router.push({ name: 'object', params: { slug: item.slug } })
}
</script>

<style scoped>
.portfolio-grid-wrapper {
  width: 100%;
  padding: 1rem 0 0;
}

.objects-intro {
  max-width: 760px;
  margin: 0 auto 2.75rem;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
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

.portfolio-card-image {
  width: 100%;
  aspect-ratio: 4 / 5;
  border: 1px solid #868686;
  background: #e8e8e8;
  overflow: hidden;
}

.portfolio-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
  -webkit-user-select: none;
}

.portfolio-card-info {
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
  .objects-intro {
    margin-bottom: 1.5rem;
    font-size: 0.8rem;
    line-height: 1.45;
    padding: 0 0.25rem;
  }

  .portfolio-grid {
    gap: 0.75rem;
  }

  .portfolio-grid.single-object {
    grid-template-columns: minmax(220px, 1fr);
  }
}
</style>
