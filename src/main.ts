import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/main.css'

import i18n from './i18n'
import vuetify from './plugins/vuetify'
import noRightClick from './directives/noRightClick'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)
app.directive('no-right-click', noRightClick)

// Google Analytics setup
declare global {
  interface Window {
    dataLayer: any[]
    gtag: any
  }
}

const loadGoogleAnalytics = () => {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-67LH0LX1WS'
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', 'G-67LH0LX1WS')
}

loadGoogleAnalytics()

// Track page views on route changes
router.afterEach((to) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: to.path,
      page_title: document.title
    })
  }
})

app.mount('#app')
