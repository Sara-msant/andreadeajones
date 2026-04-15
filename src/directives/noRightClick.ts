type RightClickElement = HTMLElement & { __noRightClickHandler__?: (e: Event) => void }

export default {
  mounted(el: RightClickElement) {
    el.__noRightClickHandler__ = (e: Event) => {
      e.preventDefault()
    }
    el.addEventListener('contextmenu', el.__noRightClickHandler__)
  },
  unmounted(el: RightClickElement) {
    if (el.__noRightClickHandler__) {
      el.removeEventListener('contextmenu', el.__noRightClickHandler__)
      delete el.__noRightClickHandler__
    }
  },
} as const
