<template>
  <PageWrapper>
    <section v-if="featuredObject" class="home">
      <section class="home-hero">
        <div class="home-brand">
          <img v-no-right-click :src="fatLogo" alt="Andrea Dea Jones" draggable="false" />
        </div>

        <article class="home-intro-card">
          <img v-no-right-click :src="introCopyImage" alt="I did this" draggable="false" />
        </article>
      </section>

      <p class="home-caption">
        <span class="line-1">{{ t('home.caption.line1') }}</span>
        <span class="line-2">{{ t('home.caption.line2') }}</span>
      </p>

      <img
        v-no-right-click
        class="home-object-image"
        :src="featuredObject.cover"
        :alt="featuredObject.alt || featuredObject.title"
        draggable="false"
      />

      <section class="home-actions">
        <button class="home-explore" type="button" @click="goToObjectDetail">
          <span class="home-explore-text">{{ featuredObject.title }}</span>
          <span class="home-explore-arrow" aria-hidden="true">→</span>
        </button>

        <button class="home-inquiry" type="button" @click="goToContact">
          {{ t('home.purchaseInquiry') }}
        </button>
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

type FeaturedMeta = {
  slug?: string
  title?: string
  cover?: string
  alt?: string
}

const router = useRouter()
const { t } = useI18n()
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
    router.push({ name: 'object', params: { slug: featuredObject.value.slug } })
    return
  }

  router.push({ name: 'objects' })
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
  padding: 0 0 2.5rem;
  background: #fff;
}

.home-hero {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  padding-top: 10rem;
}

.home-brand {
  display: flex;
  justify-content: center;
  padding-top: 0.25rem;
}

.home-brand img {
  display: block;
  width: 50%;
  max-width: 100%;
  height: auto;
}

.home-intro-card {
  width: 400px;
  margin-top: 13rem;
  margin-left: auto;
}

.home-intro-card img {
  display: block;
  width: 100%;
  height: auto;
}

.home-caption {
  margin-top: 11rem;
  text-align: center;
  font-size: clamp(1.05rem, 1.2vw, 1.95rem);
}

.home-object-image {
  /* ← image stool */
  margin: 15rem auto 0;
  width: min(100%, 820px);
  height: auto;
  object-fit: contain;
}

.home-actions {
  margin: 5rem auto 0; /* ← changer espace entre stool image et texte "yomartins explore" */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; /* ← espace entre  YOMARTINS EXPLORE et button Purshase */
}

.home-explore {
  border: none;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  padding: 0.25rem 1rem;
  text-transform: uppercase;
  font-family: var(--font-body);
}

.home-explore-text {
  font-size: 2rem;
  line-height: 1;
}

.home-explore-arrow {
  display: inline-flex;
  align-items: center;
  font-size: 2rem;
  line-height: 1;
  transform: translateY(-0.11em);
}

.home-inquiry {
  border: none;
  background: var(--color-accent);
  color: var(--color-text);
  cursor: pointer;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 1.45rem;
  padding: 0.55rem 5rem;
}

.home-explore:hover,
.home-inquiry:hover {
  background: var(--color-text);
  color: var(--color-accent);
}

.home-inquiry:hover {
  background: var(--color-text);
}

.home-caption span {
  display: block;
}

.line-1 {
  font-size: 1.8rem; /* ou ta taille actuelle */
}

.line-2 {
  font-size: 1.2rem; /* plus petit */
}

@media (max-width: 1200px) {
  .home-hero {
    padding-top: 0.5rem;
  }

  .home-intro-card {
    margin-top: 2rem;
    width: min(100%, 400px);
  }

  .home-caption {
    margin-top: 4rem;
  }
}

@media (max-width: 768px) {
  .home {
    padding-bottom: 5rem;
  }

  .home-hero {
    padding-top: 5rem;
    gap: 5rem;
  }

  .home-intro-card {
    margin-top: 0;
    margin-left: 0;
    width: min(100%, 400px);
  }

  .home-brand {
    width: 100%;
  }

  .home-caption {
    font-size: 1.8rem;
    margin-top: 5rem;
  }

  .home-object-image {
    margin-top: 5rem;
  }

  .home-actions {
    margin-top: 5rem;
  }

  .home-explore-text {
    font-size: 1.3rem;
  }

  .home-explore-arrow {
    font-size: 1.3rem;
  }

  .home-inquiry {
    font-size: 1.05rem;
  }
}

@media (max-width: 390px) {
  .home {
    padding-bottom: 4rem;
  }

  .home-hero {
    padding-top: 4rem;
    gap: 4rem;
  }

  .home-caption {
    margin-top: 4rem;
    font-size: 1.4rem;
  }

  .home-object-image,
  .home-actions {
    margin-top: 4rem;
  }
}
</style>
