<template>
  <header
    ref="headerRef"
    class="andrea-header"
    :class="{ 'andrea-white': isWhite, 'is-compact': isCompact }"
  >
    <button
      ref="faviconRef"
      class="andrea-favicon"
      type="button"
      :aria-label="t('header.goHomeAria')"
      @click="goHome"
    >
      <img src="/header-logo.png" :alt="t('header.logoAlt')" />
    </button>

    <nav
      ref="navRef"
      class="andrea-nav"
      :aria-label="t('header.mainNavigationAria')"
      :inert="isCompact"
    >
      <template v-for="(item, index) in navItems" :key="item.name">
        <div class="andrea-nav-item">
          <RouterLink
            :to="{ name: item.name }"
            class="andrea-nav-link"
            :class="{ 'is-active': route.name === item.name }"
          >
            {{ t(item.labelKey) }}
          </RouterLink>
          <span
            v-if="item.name === 'objects' && currentObjectTitle"
            class="andrea-nav-subroute"
            aria-current="page"
          >
            <span class="andrea-nav-subroute-connector" aria-hidden="true">└</span
            ><span class="andrea-nav-subroute-title">{{ currentObjectTitle }}</span>
          </span>
        </div>
        <span v-if="index < navItems.length - 1" class="andrea-nav-sep" aria-hidden="true">▪</span>
      </template>
    </nav>

    <span v-if="isCompact && compactRouteLabel" class="andrea-compact-route" aria-current="page">
      {{ compactRouteLabel }}
    </span>

    <div ref="actionsRef" class="andrea-header-actions">
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
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import { useObjects } from '@/composables/useObjects'

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

const { getObjectBySlug } = useObjects()

const currentObjectTitle = computed(() => {
  if (route.name !== 'object') return null
  const slug = route.params.slug
  if (typeof slug !== 'string') return null
  return getObjectBySlug(slug)?.title ?? null
})

const isMenuOpen = ref(false)
const langOpen = ref(false)
const isCompact = ref(false)
const headerRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const faviconRef = ref<HTMLElement | null>(null)
const actionsRef = ref<HTMLElement | null>(null)

const checkFit = () => {
  const header = headerRef.value
  const nav = navRef.value
  const favicon = faviconRef.value
  const actions = actionsRef.value
  if (!header || !nav || !favicon || !actions) return

  const headerW = header.offsetWidth
  const style = getComputedStyle(header)
  const paddingLeft = parseFloat(style.paddingLeft)
  const paddingRight = parseFloat(style.paddingRight)
  const logoRight = paddingLeft + favicon.offsetWidth
  const actionsLeft = headerW - paddingRight - actions.offsetWidth
  const navW = nav.scrollWidth
  const centerX = headerW / 2
  const navLeft = centerX - navW / 2
  const navRight = centerX + navW / 2
  const BUFFER = 24

  isCompact.value = navLeft < logoRight + BUFFER || navRight > actionsLeft - BUFFER
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  resizeObserver = new ResizeObserver(checkFit)
  if (headerRef.value) resizeObserver.observe(headerRef.value)
  nextTick(checkFit)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

const languages = ['en', 'fr', 'pt'] as const

const navItems = [
  { name: 'objects', labelKey: 'nav.objects' },
  { name: 'about', labelKey: 'nav.about' },
  { name: 'editions', labelKey: 'nav.editions' },
  { name: 'contact', labelKey: 'nav.contact' },
]

const compactRouteLabel = computed(() => {
  if (route.name === 'object') {
    return currentObjectTitle.value
  }

  const activeNavItem = navItems.find((item) => item.name === route.name)
  if (!activeNavItem) return null

  return t(activeNavItem.labelKey)
})

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
  align-items: flex-start;
  position: sticky;
  top: 0;
  z-index: 9999;
  color: var(--color-text);
  background: var(--color-background);
  height: 110px;
  margin: 0;
  padding: 34px 2.5rem 0 1.4rem;
}

.andrea-favicon {
  /* logo back button*/
  height: 25px;
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
  align-items: flex-start;
  gap: clamp(1.2rem, 3vw, 2.6rem);
  width: max-content;
}

.andrea-nav-sep {
  font-size: 1rem;
  padding-top: calc((2.2rem - 1rem) / 2);
  line-height: 1;
  color: var(--color-text);
}

.andrea-header-actions {
  margin-left: auto;
  display: flex;
  align-items: flex-start;
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

.andrea-nav-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1em;
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

.andrea-nav-subroute {
  display: flex;
  align-items: baseline;
  gap: 0.2em;
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
  color: var(--color-text);
  pointer-events: none;
  user-select: none;
}

.andrea-nav-subroute-connector {
  line-height: 1;
}

.andrea-nav-subroute-title {
  text-decoration: underline;
  text-underline-offset: 0.16em;
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

.andrea-header.is-compact .andrea-nav {
  visibility: hidden;
  pointer-events: none;
}

.andrea-compact-route {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 34px;
  height: 42px;
  display: flex;
  align-items: center;
  max-width: min(56vw, 340px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-color: currentColor;
  text-underline-offset: 0.16em;
  font-family: var(--font-body);
  font-size: clamp(1rem, 4vw, 1.35rem);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
}

.andrea-header.is-compact .andrea-lang-wrapper {
  display: none;
}

.andrea-header.is-compact .andrea-menu {
  display: flex;
}

@media (max-width: 768px) {
  .andrea-header {
    height: 74px;
    padding: 0 1.25rem;
    align-items: center;
  }

  .andrea-favicon {
    height: 20px;
  }

  .andrea-compact-route {
    top: 50%;
    height: auto;
    display: block;
    max-width: min(52vw, 240px);
    transform: translate(-50%, -50%);
    font-size: clamp(0.92rem, 3.9vw, 1.08rem);
  }
}

@media (max-width: 390px) {
  .andrea-header {
    height: 68px;
    padding: 0 1rem;
  }

  .andrea-favicon {
    height: 18px;
  }

  .andrea-compact-route {
    max-width: min(56vw, 200px);
    font-size: clamp(0.86rem, 3.5vw, 0.98rem);
  }
}
</style>
