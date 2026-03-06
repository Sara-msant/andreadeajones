import type { DirectiveBinding } from 'vue'

export default {
  mounted(el: HTMLElement) {
    el.addEventListener('contextmenu', (e: Event) => {
      e.preventDefault()
    })
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('contextmenu', (e: Event) => {
      e.preventDefault()
    })
  },
} as const
