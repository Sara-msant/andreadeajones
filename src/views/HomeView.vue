<template>
  <PageWrapper>
    <section v-if="featuredProject" class="home">
      <section class="home-hero">
        <div class="home-brand">
          <img v-no-right-click :src="fatLogo" alt="Andrea Dea Jones" draggable="false" />
        </div>

        <article class="home-intro-card">
          <div class="home-intro-photos">
            <img
              v-no-right-click
              :src="portraitImage"
              :alt="t('home.portraitAlt')"
              draggable="false"
            />
          </div>

          <div class="home-intro-copy">
            <p class="intro-yo">{{ t('home.intro.yo') }}</p>
            <div class="intro-spacer" aria-hidden="true"></div>

            <div class="intro-im-row">
              <div aria-hidden="true"></div>
              <p class="intro-im">{{ t('home.intro.im') }}</p>
            </div>

            <div class="intro-spacer" aria-hidden="true"></div>
            <p class="intro-and">{{ t('home.intro.andIDid') }}</p>
            <p class="intro-this">{{ t('home.intro.this') }}</p>
          </div>
        </article>
      </section>

      <p class="home-caption">{{ t('home.caption') }}</p>

      <img
        v-no-right-click
        class="home-object-image"
        :src="featuredProject.cover"
        :alt="featuredProject.title"
        draggable="false"
      />

      <section class="home-actions">
        <button class="home-explore" type="button" @click="goToObjectDetail">
          <span class="home-explore-name">{{ featuredProject.title }}.</span>
          <span class="home-explore-link">{{ t('home.explore') }} &nbsp;→</span>
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
import { useObjects } from '@/composables/useObjects'
import portraitImage from '@/assets/home/rachel.png'
import fatLogo from '@/assets/home/fat-logo.png'

const router = useRouter()
const { t } = useI18n()
const { objects } = useObjects()

// Keep home hero object in sync with the first object shown on the Objects page.
const featuredProject = computed(() => objects.value[0] ?? null)

const goToObjectDetail = () => {
  if (!featuredProject.value) return
  router.push({ name: 'object', params: { slug: featuredProject.value.slug } })
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
  padding-top: 1.4rem;
}

.home-brand {
  display: flex;
  justify-content: center;
  padding-top: 0.25rem;
}

.home-brand img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}

.home-intro-card {
  width: 400px;
  margin-top: 1.8rem;
  margin-left: auto;
  background: var(--color-accent);
}

.home-intro-photos {
  display: block;
}

.home-intro-photos img {
  width: 100%;
  height: 265px;
  object-fit: cover;
  filter: grayscale(100%);
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-bottom: none;
}

.home-intro-copy {
  padding: 1.1rem 1.05rem 1.3rem;
  text-transform: uppercase;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 52px auto 60px auto auto;
  row-gap: 0;
}

.intro-yo {
  font-size: clamp(3.2rem, 4vw, 4.2rem);
  line-height: 1;
  font-weight: 700;
  white-space: nowrap;
}

.intro-im {
  margin: 0;
  font-size: clamp(2.2rem, 2.8vw, 3.2rem);
  line-height: 1.1;
}

.intro-im-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
}

.intro-spacer {
  width: 100%;
}

.intro-and {
  margin-top: 0;
  font-size: clamp(2.9rem, 3.7vw, 4rem);
  line-height: 1;
  font-weight: 700;
  white-space: nowrap;
}

.intro-this {
  margin-top: 0.25rem;
  font-size: clamp(2.55rem, 3vw, 3.4rem);
  line-height: 1;
}

.home-caption {
  margin-top: 10rem;
  text-align: center;
  font-size: clamp(1.05rem, 1.2vw, 1.95rem);
}

.home-object-image {
  margin: 3.2rem auto 0;
  width: min(100%, 820px);
  height: auto;
  object-fit: contain;
}

.home-actions {
  margin: 2.4rem auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.home-explore {
  border: none;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-transform: uppercase;
  font-family: var(--font-body);
}

.home-explore-name,
.home-explore-link {
  font-size: 2rem;
  line-height: 1;
}

.home-inquiry {
  border: none;
  background: var(--color-accent);
  color: var(--color-text);
  cursor: pointer;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 1.45rem;
  padding: 0.55rem 1rem;
}

.home-explore:hover,
.home-inquiry:hover {
  background: var(--color-text);
  color: var(--color-accent);
}

.home-inquiry:hover {
  background: var(--color-text);
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
  .home-hero {
    padding-top: 0.2rem;
  }

  .home-intro-card {
    margin-left: 0;
    width: min(100%, 400px);
  }

  .home-brand {
    width: 100%;
  }

  .home-intro-photos img {
    height: 145px;
  }

  .intro-yo {
    font-size: 3.15rem;
  }

  .intro-im {
    font-size: 2.25rem;
  }

  .home-intro-copy {
    grid-template-rows: auto 36px auto 44px auto auto;
  }

  .intro-and {
    font-size: 2.95rem;
  }

  .intro-this {
    margin-top: 0.3rem;
    font-size: 2.15rem;
  }

  .home-caption {
    font-size: 1.8rem;
    margin-top: 3.3rem;
  }

  .home-explore-name,
  .home-explore-link {
    font-size: 1.3rem;
  }

  .home-inquiry {
    font-size: 1.05rem;
  }

}
</style>
