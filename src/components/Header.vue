<template>
  <header class="andrea-header" :class="{ 'andrea-white': isWhite }">
    <button class="andrea-favicon" type="button" :aria-label="t('header.goHomeAria')" @click="goHome">
      <img src="/header-logo.png" :alt="t('header.logoAlt')" />
    </button>

    <nav class="andrea-nav" :aria-label="t('header.mainNavigationAria')">
      <template v-for="(item, index) in navItems" :key="item.name">
        <RouterLink
          :to="{ name: item.name }"
          class="andrea-nav-link"
          :class="{ 'is-active': route.name === item.name }"
        >
          {{ t(item.labelKey) }}
        </RouterLink>
        <span v-if="index < navItems.length - 1" class="andrea-nav-sep" aria-hidden="true">▪</span>
      </template>
    </nav>

    <div class="andrea-header-actions">
      <div class="andrea-lang-wrapper">
        <button
          class="andrea-lang-toggle"
          type="button"
          :aria-label="t('header.languageAria')"
          @click="langOpen = !langOpen"
        >
          <span>{{ locale.toUpperCase() }}</span>
          <span class="andrea-lang-arrow" aria-hidden="true">▼</span>
        </button>

        <ul v-if="langOpen" class="andrea-lang-list">
          <li
            v-for="lang in languages"
            :key="lang"
            :class="{ 'is-active': lang === locale }"
            @click="setLang(lang)"
          >
            {{ lang.toUpperCase() }}
          </li>
        </ul>
      </div>

      <button
        class="andrea-menu"
        type="button"
        :aria-label="t('header.openMenuAria')"
        @click="isMenuOpen = true"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <HamburgerMenu v-model="isMenuOpen" />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import HamburgerMenu from '@/components/HamburgerMenu.vue'

defineOptions({
  name: 'SiteHeader',
})

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

withDefaults(
  defineProps<{
    isWhite?: boolean
  }>(),
  {
    isWhite: false,
  },
)

const isMenuOpen = ref(false)
const langOpen = ref(false)
const languages = ['en', 'fr', 'pt'] as const

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

const setLang = (lang: (typeof languages)[number]) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
  langOpen.value = false
}
</script>

<style scoped>
.andrea-header {
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

.andrea-favicon {
  height: 42px;
  width: auto;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.andrea-favicon img {
  height: 100%;
  width: auto;
  display: block;
  object-fit: contain;
}

.andrea-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: clamp(1.2rem, 3vw, 2.6rem);
  width: max-content;
}

.andrea-nav-sep {
  font-size: 1rem;
  line-height: 1;
  color: var(--color-text);
}

.andrea-header-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.andrea-lang-wrapper {
  position: relative;
}

.andrea-lang-toggle {
  border: none;
  background: transparent;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 2.2rem;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  cursor: pointer;
}

.andrea-lang-arrow {
  font-size: 0.7em;
  line-height: 1;
  transform: translateY(-0.03em);
}

.andrea-lang-list {
  position: absolute;
  top: calc(100% + 0.3rem);
  right: 0;
  list-style: none;
  margin: 0;
  padding: 0.28rem;
  min-width: 70px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  z-index: 30;
}

.andrea-lang-list li {
  padding: 0.36rem 0.48rem;
  cursor: pointer;
  font-size: 0.78rem;
}

.andrea-lang-list li:hover,
.andrea-lang-list li.is-active {
  background: rgba(0, 0, 0, 0.07);
}

.andrea-nav-link {
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 0.16em;
  font-family: var(--font-body);
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
}

.andrea-nav-link:hover,
.andrea-nav-link.is-active {
  color: var(--color-text);
  text-decoration-color: currentColor;
}

.andrea-menu span {
  display: block;
  height: 2px;
  width: 100%;
  border-radius: 999px;
  background-color: var(--color-text);
}

.andrea-menu {
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

.andrea-header.andrea-white {
  color: white !important;
}

.andrea-header.andrea-white .andrea-menu span {
  background-color: white !important;
}

@media (max-width: 768px) {
  .andrea-header {
    height: 82px;
    padding: 0 1.5rem;
  }

  .andrea-favicon {
    height: 34px;
  }

  .andrea-nav {
    display: none;
  }

  .andrea-nav-sep {
    display: none;
  }

  .andrea-lang-wrapper {
    display: none;
  }

  .andrea-header-actions {
    gap: 0;
  }

  .andrea-menu {
    display: flex;
  }
}
</style>


