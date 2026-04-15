<template>
  <PageWrapper>
    <section class="editions-page" :aria-label="t('editions.title')">
      <article class="editions-block editions-block--intro">
        <h1>{{ t('editions.objectEdition.title') }}</h1>
        <p>{{ t('editions.objectEdition.description') }}</p>
      </article>

      <div class="editions-columns">
        <article class="editions-block editions-block--side editions-block--left">
          <h2>{{ t('editions.studio.title') }}</h2>
          <p>{{ t('editions.studio.description') }}</p>
        </article>

        <article class="editions-block editions-block--side editions-block--right">
          <h2>{{ t('editions.gallery.title') }}</h2>
          <p>{{ t('editions.gallery.description') }}</p>
        </article>
      </div>

      <article class="editions-block editions-block--outro">
        <p>{{ t('editions.note') }}</p>
      </article>
    </section>
  </PageWrapper>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageWrapper from '@/components/PageWrapper.vue'

const { t } = useI18n()
</script>

<style scoped>
.editions-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(5.5rem, 12vh, 8.5rem);
  padding: clamp(3rem, 9vh, 6rem) 0 clamp(2.5rem, 9vh, 6rem);
}

.editions-block {
  width: 100%;
}

.editions-block h1,
.editions-block h2 {
  margin: 0;
  text-transform: uppercase;
  font-size: clamp(1rem, 1.2vw, 1.18rem);
  letter-spacing: 0.08em;
  font-weight: 700;
  line-height: 1.2;
}

.editions-block p {
  margin: 0;
  font-size: clamp(0.78rem, 0.95vw, 1.08rem);
  line-height: 1.35;
  letter-spacing: 0.02em;
}

.editions-block--intro,
.editions-block--outro {
  max-width: 980px;
  margin: 0 auto;
  text-align: center;
}

.editions-block--intro p {
  margin: 2rem auto 0;
  max-width: 690px;
}

.editions-columns {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 6vw, 10rem);
  align-items: start;
}

.editions-block--side {
  max-width: 510px;
}

.editions-block--left {
  justify-self: start;
  text-align: left;
}

.editions-block--right {
  justify-self: end;
  text-align: right;
}

.editions-block--side p {
  margin-top: 1.6rem;
}

.editions-block--outro p {
  margin: 0 auto;
  max-width: 820px;
}

@media (max-width: 900px) {
  .editions-page {
    gap: 4rem;
    padding-top: 2.5rem;
  }

  .editions-columns {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .editions-block--left,
  .editions-block--right {
    justify-self: center;
    text-align: center;
  }

  .editions-block--intro p,
  .editions-block--side p,
  .editions-block--outro p {
    margin-top: 1.25rem;
  }
}
</style>
