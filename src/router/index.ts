import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import EditionsView from '@/views/EditionsView.vue'
import ObjectsView from '@/views/ObjectsView.vue'
import ObjectView from '@/views/ObjectView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'

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
    },
    {
      path: '/object',
      name: 'objects',
      component: ObjectsView,
    },
    {
      path: '/object/:slug',
      name: 'object',
      component: ObjectView,
      props: true,
    },
    {
      path: '/edition',
      name: 'editions',
      component: EditionsView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
