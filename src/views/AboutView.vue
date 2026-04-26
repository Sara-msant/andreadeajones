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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(10rem, 4vw, 4rem) 0 2rem;
}

.about-portrait {
  /* photo autoportrait*/
  width: min(100%, 430px);
  height: auto;
  display: block;
  margin-bottom: clamp(2rem, 1vw, 4rem);
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

.about-portrait-wrapper {
  position: relative;
  width: min(100%, 430px);
  margin-bottom: clamp(10rem, 5vw, 4rem);
}

.about-portrait {
  width: 100%;
  height: auto;
  display: block;
}

.about-portrait-title {
  /* ANDREA DEA JONES subtitle*/
  text-align: right;
  margin-top: 0.1rem;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .about-page {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .about-portrait-wrapper {
    width: min(100%, 340px);
  }

  .about-portrait {
    width: 100%;
  }

  .about-copy {
    font-size: 0.78rem;
    line-height: 1.45;
    letter-spacing: 0.01em;
  }
}

@media (max-width: 390px) {
  .about-page {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .about-portrait-wrapper {
    width: min(100%, 300px);
  }
}
</style>
