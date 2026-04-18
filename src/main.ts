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
type GtagCommand = [string, ...unknown[]]

declare global {
  interface Window {
    dataLayer: GtagCommand[]
    gtag: (...args: GtagCommand) => void
  }
}

const loadGoogleAnalytics = () => {
  const googleAnalyticsSrc = ''
  const measurementId = ''

  const script = document.createElement('script')
  script.async = true
  if (googleAnalyticsSrc) {
    script.src = googleAnalyticsSrc
    document.head.appendChild(script)
  }

  window.dataLayer = window.dataLayer || []
  function gtag(...args: GtagCommand) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  if (measurementId) {
    gtag('config', measurementId)
  }
}

loadGoogleAnalytics()

// Track page views on route changes
router.afterEach((to) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: to.path,
      page_title: document.title,
    })
  }
})

app.mount('#app')
