import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// import EditionsView from '@/views/EditionsView.vue'
import CollectionsView from '@/views/CollectionsView.vue'
import CollectionObjectView from '@/views/CollectionObjectView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'

const globalScrollLockAllowSelectors = [
  '[data-scroll-lock-allow]',
  '.andrea-menu',
  '.andrea-menu-inner',
] as const

const globalRouteMeta = {
  scrollLockAllowSelectors: globalScrollLockAllowSelectors,
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: 0,
        behavior: 'smooth',
      }
    }

    return { top: 0, left: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: globalRouteMeta,
    },
    {
      path: '/collections',
      name: 'collections',
      component: CollectionsView,
      meta: globalRouteMeta,
    },
    {
      path: '/collections/:collectionSlug/:objectSlug',
      name: 'collectionObject',
      component: CollectionObjectView,
      meta: globalRouteMeta,
    },
    // {
    //   path: '/edition',
    //   name: 'editions',
    //   component: EditionsView,
    //   meta: globalRouteMeta,
    // },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: globalRouteMeta,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: globalRouteMeta,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
