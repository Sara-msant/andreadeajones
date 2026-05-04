<template>
  <PageWrapper>
    <section class="about-page">
      <div class="about-portrait-wrapper">
        <img class="about-portrait" :src="rachelImage" :alt="t('about.portraitAlt')" />

        <div class="about-portrait-title">{{ t('about.portraitCaption') }}</div>
      </div>

      <div class="about-copy">
        <p>{{ t('about.paragraphs.p1') }}</p>

        <p>{{ t('about.paragraphs.p2') }}</p>

        <p>{{ t('about.paragraphs.p3') }}</p>

        <p>{{ t('about.paragraphs.p4') }}</p>

        <p>{{ t('about.paragraphs.p5') }}</p>

        <p>{{ t('about.paragraphs.p6') }}</p>

        <p>
          {{ t('about.agencyIntro') }}
          <a href="https://www.jora-studio.com/" target="_blank" rel="noopener noreferrer">
            {{ t('about.agencyLink') }} </a
          >.
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(1.25rem, 2.5vh, 2rem) 1rem 1.5rem;
}

.about-portrait-wrapper {
  width: 100%;
  max-width: 360px;
  margin: 0 auto clamp(1.75rem, 3vh, 2.5rem);
}


.about-portrait {
  width: 100%;
  height: auto;
  display: block;
}

.about-portrait-title {
  text-align: right;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  opacity: 0.8;
}

.about-copy {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
  font-size: clamp(0.78rem, 0.82vw, 0.88rem);
  line-height: 1.42;
  letter-spacing: 0.02em;
}

.about-copy p {
  margin: 0;
}

.about-copy p + p {
  margin-top: 0.75rem;
}

.about-copy a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

@media (max-width: 768px) {
  .about-page {
    padding: 4rem 1rem 4rem;
  }

  .about-portrait-wrapper {
    width: min(340px, 100%);
    margin-bottom: 3rem;
  }

  .about-copy {
    width: min(36ch, 100%);
    font-size: 0.82rem;
    line-height: 1.5;
    letter-spacing: 0.01em;
  }

  .about-copy p + p {
    margin-top: 1rem;
  }
}

@media (max-width: 390px) {
  .about-page {
    padding-top: 3.5rem;
    padding-bottom: 3.5rem;
  }

  .about-portrait-wrapper {
    width: min(300px, 100%);
    margin-bottom: 2.5rem;
  }
}
</style>
