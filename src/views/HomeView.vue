<template>
  <PageWrapper>
    <section v-if="featuredProject" class="home">
      <section class="home-hero">
        <div class="home-brand">
          <span>Andrea</span>
          <span>Dea</span>
          <span>Jones.</span>
        </div>

        <article class="home-intro-card">
          <div class="home-intro-photos">
            <img v-no-right-click :src="portraitImage" alt="Andrea portrait" draggable="false" />
          </div>

          <div class="home-intro-copy">
            <p class="intro-yo">Yo,</p>
            <div class="intro-spacer" aria-hidden="true"></div>

            <div class="intro-im-row">
              <div aria-hidden="true"></div>
              <p class="intro-im">I'm Andrea.</p>
            </div>

            <div class="intro-spacer" aria-hidden="true"></div>
            <p class="intro-and">And I did</p>
            <p class="intro-this">this.</p>
          </div>
        </article>
      </section>

      <p class="home-caption">An object with structure and attitude.</p>

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
          <span class="home-explore-link">Explore &nbsp;→</span>
        </button>

        <button class="home-inquiry" type="button" @click="goToContact">Purshase // Inquiry</button>
      </section>

      <footer class="home-footer">
        <div class="home-socials">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
            >Instagram</a
          >
          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">TikTok</a>
        </div>

        <p class="home-copyright">© Andrea Dea Jones. All rights reserved.</p>

        <form class="home-subscribe" @submit.prevent>
          <label class="home-subscribe-title" for="home-email">Subscribe</label>
          <div class="home-subscribe-row">
            <input id="home-email" type="email" placeholder="E-Mail *" />
            <button type="submit">Subscribe</button>
          </div>
        </form>
      </footer>
    </section>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PageWrapper from '@/components/PageWrapper.vue'
import { useObjects } from '@/composables/useObjects'
import portraitImage from '@/assets/home/rachel.png'

const router = useRouter()
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
  font-family: 'Sedgwick Ave Display', cursive;
  font-size: clamp(6rem, 10.6vw, 12rem);
  line-height: 0.92;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  padding-top: 0.25rem;
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

.home-footer {
  margin-top: 12rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 1.8rem;
}

.home-socials {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.home-socials a {
  text-decoration: none;
  color: var(--color-text);
  text-transform: uppercase;
  font-size: clamp(2.2rem, 4.1vw, 5.3rem);
  line-height: 0.95;
  font-weight: 700;
}

.home-copyright {
  font-size: 0.92rem;
  white-space: nowrap;
}

.home-subscribe {
  justify-self: end;
  width: 430px;
  padding: 0.75rem 0.95rem;
  background: var(--color-accent);
}

.home-subscribe-title {
  text-transform: uppercase;
  font-size: 2.05rem;
  font-weight: 700;
}

.home-subscribe-row {
  margin-top: 0.55rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.home-subscribe-row input {
  flex: 1;
  border: none;
  border-bottom: 2px solid var(--color-text);
  background: transparent;
  padding: 0.2rem 0;
  font-family: var(--font-body);
  font-size: 1.2rem;
}

.home-subscribe-row input:focus {
  outline: none;
}

.home-subscribe-row button {
  border: 2px solid var(--color-text);
  border-radius: 10px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 1.1rem;
  padding: 0.2rem 0.75rem;
}

.home-explore:hover,
.home-inquiry:hover,
.home-socials a:hover,
.home-subscribe-row button:hover {
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

  .home-footer {
    margin-top: 5rem;
    grid-template-columns: 1fr;
    gap: 1.3rem;
  }

  .home-copyright {
    white-space: normal;
  }

  .home-subscribe {
    justify-self: start;
    width: min(100%, 430px);
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
    font-size: 5.5rem;
    line-height: 0.95;
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

  .home-socials a {
    font-size: 3.8rem;
  }

  .home-subscribe {
    width: 100%;
  }

  .home-subscribe-title {
    font-size: 1.2rem;
  }
}
</style>
