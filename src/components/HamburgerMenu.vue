<template>
  <transition name="andrea-menu-fade">
    <div v-if="menuOpen" class="andrea-menu-overlay" @click.self="close">
      <div class="andrea-menu">
        <div class="andrea-menu-inner" data-scroll-lock-allow>
          <!-- Header -->
          <header class="andrea-menu-header">
            <div class="andrea-menu-lang-wrapper">
              <button class="lang-toggle" type="button" @click="langOpen = !langOpen">
                <span>{{ currentLocaleLabel }}</span>
                <span class="dropdown-arrow">▼</span>
              </button>

              <ul v-if="langOpen" class="lang-list">
                <li
                  v-for="lang in languages"
                  :key="lang"
                  :class="{ active: lang === locale }"
                  @click="setLang(lang)"
                >
                  {{ lang.toUpperCase() }}
                </li>
              </ul>
            </div>

            <button
              class="menu-close"
              type="button"
              :aria-label="t('header.closeMenuAria')"
              @click="close"
            >
              <span class="menu-close-line menu-close-line-first" aria-hidden="true"></span>
              <span class="menu-close-line menu-close-line-second" aria-hidden="true"></span>
            </button>
          </header>

          <!-- Navigation -->
          <nav class="andrea-menu-nav">
            <button
              v-for="item in items"
              :key="item.key"
              class="nav-link"
              type="button"
              @click="go(item)"
            >
              {{ t(item.labelKey) }}
            </button>
          </nav>

          <!-- Social -->
          <footer class="andrea-menu-footer">
            <a
              href="https://www.instagram.com/andrea_dea_jones"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
            >
              {{ t('common.social.instagram') }}
            </a>
            <a
              href="https://www.tiktok.com/@andrea.dea.jones"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
            >
              {{ t('common.social.tiktok') }}
            </a>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const menuOpen = defineModel<boolean>()

const router = useRouter()
const { t, locale } = useI18n()

const langOpen = ref(false)

const languages = ['en', 'fr', 'pt']

const items = [
  { key: 'home', labelKey: 'nav.home', to: '/' },
  { key: 'objects', labelKey: 'nav.objects', to: '/object' },
  { key: 'about', labelKey: 'nav.about', to: '/about' },
  { key: 'editions', labelKey: 'nav.editions', to: '/edition' },
  { key: 'contact', labelKey: 'nav.contact', to: '/contact' },
]

const currentLocaleLabel = computed(() => locale.value.toUpperCase())

const close = () => {
  langOpen.value = false
  menuOpen.value = false
}

const setLang = (lang: string) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
  langOpen.value = false
}

const go = (item: { to?: string }) => {
  if (item.to) router.push(item.to)
  close()
}

onMounted(() => {
  const saved = localStorage.getItem('lang')
  if (saved) {
    locale.value = saved
  }
})
</script>

<style scoped>
/* Overlay */
.andrea-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0;
  background: rgba(29, 29, 29, 0.18);
}

/* Menu card */
.andrea-menu {
  background: var(--color-background);
  border-left: 1px solid var(--color-border);
  width: min(88vw, 360px);
  height: 100%;
  margin-top: 0;

  pointer-events: auto;
}

@media (max-width: 768px) {
  .andrea-menu-overlay {
    padding: 0;
    justify-content: stretch;
    align-items: stretch;
  }

  .andrea-menu {
    width: 100%;
    height: 100%;
    border-radius: 0;
    margin-top: 0;
    display: flex;
    flex-direction: column;
  }

  .andrea-menu-inner {
    padding: 2rem 2rem 1.7rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .andrea-menu-nav {
    flex: 1;
  }

  .andrea-menu-footer {
    margin-top: auto;
  }
}

.andrea-menu-inner {
  padding: 1.9rem 1.6rem 1.7rem;
  color: var(--color-text);
}

/* Fade animation */
.andrea-menu-fade-enter-active,
.andrea-menu-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.andrea-menu-fade-enter-from,
.andrea-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Header */
.andrea-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.lang-toggle,
.menu-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  font-size: 1rem;
  font-family: var(--font-body);
  text-transform: uppercase;
}

.menu-close {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
}

.menu-close-line {
  position: absolute;
  width: 1.5rem;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

.menu-close-line-first {
  transform: rotate(45deg);
}

.menu-close-line-second {
  transform: rotate(-45deg);
}

/* Lang dropdown */
.andrea-menu-lang-wrapper {
  position: relative;
}

.lang-list {
  position: absolute;
  top: 130%;
  background: var(--color-background);
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--color-border);
}

.lang-list li {
  padding: 0.2rem 0.45rem;
  cursor: pointer;
}

.lang-list li.active,
.lang-list li:hover {
  background: rgba(0, 0, 0, 0.06);
}

/* Nav links */
.andrea-menu-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.5rem;
}

.nav-link {
  background: transparent;
  border: none;
  text-align: center;
  font-size: 1.2rem;
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  padding: 0.1rem 0;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.nav-link:hover {
  color: var(--color-accent);
}

/* Footer */
.andrea-menu-footer {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  line-height: 1;
}

.social-link:hover {
  color: var(--color-accent);
}

@media (max-width: 390px) {
  .social-link {
    font-size: 1.45rem;
  }
}

/* Lang dropdown */
.andrea-menu-lang-wrapper {
  position: relative;
}

.lang-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.7rem;
  border-radius: 12px;
}

.dropdown-arrow {
  font-size: 0.8rem;
  line-height: 1;
}

.lang-toggle:hover {
  background: rgba(0, 0, 0, 0.06);
}

/* the dropdown panel */
.lang-list {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  z-index: 5;

  min-width: 84px;
  padding: 0.35rem;
  margin: 0;

  list-style: none;
  border: 1px solid var(--color-border);
  background: var(--color-background);
}

/* items */
.lang-list li {
  padding: 0.45rem 0.7rem;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
}

.lang-list li:hover {
  background: rgba(0, 0, 0, 0.06);
}

.lang-list li.active {
  background: rgba(0, 0, 0, 0.1);
  font-weight: 600;
}
</style>
