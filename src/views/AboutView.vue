<template>
  <PageWrapper>
    <section class="about-page">
      <img class="about-portrait" :src="rachelImage" :alt="t('about.portraitAlt')" />

      <div class="about-copy">
        <p>{{ t('about.paragraphs.p1') }}</p>

        <p>{{ t('about.paragraphs.p2') }}</p>

        <p>{{ t('about.paragraphs.p3') }}</p>

        <p>{{ t('about.paragraphs.p4') }}</p>

        <p>{{ t('about.paragraphs.p5') }}</p>

        <p>{{ t('about.paragraphs.p6') }}</p>

        <p>
          {{ t('about.agencyIntro') }}
          <a href="https://www.andrea-studio.com/" target="_blank" rel="noopener noreferrer">
            {{ t('about.agencyLink') }}
          </a>.
        </p>
      </div>
    </section>
  </PageWrapper>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageWrapper from '@/components/PageWrapper.vue'
import rachelImage from '@/assets/about/rachel.png'

const { t } = useI18n()
</script>

<style scoped>
.about-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(2.25rem, 4vw, 4rem) 0 2rem;
}

.about-portrait {
  width: min(100%, 430px);
  height: auto;
  display: block;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.about-copy {
  width: min(100%, 980px);
  text-align: center;
  font-size: clamp(0.72rem, 0.85vw, 0.82rem);
  line-height: 1.35;
  letter-spacing: 0.02em;
}

.about-copy p + p {
  margin-top: clamp(1.15rem, 2vw, 1.75rem);
}

.about-copy a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

@media (max-width: 768px) {
  .about-page {
    padding-top: 1.25rem;
  }

  .about-portrait {
    width: min(100%, 340px);
    margin-bottom: 2rem;
  }

  .about-copy {
    font-size: 0.78rem;
    line-height: 1.45;
    letter-spacing: 0.01em;
  }
}
</style>

