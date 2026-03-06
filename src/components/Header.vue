<template>
  <header class="jora-header" :class="{ 'jora-white': isWhite }">
    <button class="jora-favicon" type="button" aria-label="Go to home" @click="goHome">
      <img src="/favicon.ico" alt="Andrea Dea Jones" />
    </button>

    <nav class="jora-nav" aria-label="Main navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="jora-nav-link"
        :class="{ 'is-active': route.name === item.name }"
      >
        {{ t(item.labelKey) }}
      </RouterLink>
    </nav>

    <button class="jora-menu" type="button" aria-label="Open menu" @click="isMenuOpen = true">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <HamburgerMenu v-model="isMenuOpen" />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import HamburgerMenu from '@/components/HamburgerMenu.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    isWhite?: boolean
  }>(),
  {
    isWhite: false,
  },
)

const isMenuOpen = ref(false)

const navItems = [
  { name: 'objects', labelKey: 'nav.objects' },
  { name: 'about', labelKey: 'nav.about' },
  { name: 'editions', labelKey: 'nav.editions' },
  { name: 'contact', labelKey: 'nav.contact' },
]

const goHome = () => {
  router.push({ name: 'home' })
  isMenuOpen.value = false
}
</script>

<style scoped>
.jora-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 9999;
  color: var(--color-text);
  background: var(--color-background);
  height: 110px;
  margin: 0;
  padding: 0 2.5rem 0 1.4rem;
}

.jora-favicon {
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jora-favicon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.jora-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: clamp(2rem, 7vw, 9rem);
  width: max-content;
}

.jora-nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
}

.jora-nav-link:hover,
.jora-nav-link.is-active {
  color: var(--color-accent);
}

.jora-menu span {
  display: block;
  height: 2px;
  width: 100%;
  border-radius: 999px;
  background-color: var(--color-text);
}

.jora-menu {
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  cursor: pointer;
}

.jora-header.jora-white {
  color: white !important;
}

.jora-header.jora-white .jora-menu span {
  background-color: white !important;
}

@media (max-width: 768px) {
  .jora-header {
    height: 82px;
    padding: 0 1.5rem;
  }

  .jora-nav {
    display: none;
  }

  .jora-menu {
    display: flex;
  }
}
</style>
