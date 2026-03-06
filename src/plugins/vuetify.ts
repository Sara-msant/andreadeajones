import 'vuetify/styles'
import '@fortawesome/fontawesome-free/css/all.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, fa } from 'vuetify/iconsets/fa'
import { en, fr, pt } from 'vuetify/locale'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: {
      en,
      fr,
      pt,
    },
  },
})
