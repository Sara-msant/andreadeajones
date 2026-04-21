export type ScrollLockHandle = string

export type ScrollLockOptions = {
  handle?: ScrollLockHandle
  allowTouchMoveSelectors?: string[]
}

type LockEntry = {
  count: number
  allowTouchMoveSelectors: string[]
}

type ScrollLockConfig = {
  lockClass: string
  allowTouchMoveSelectors: string[]
}

const config: ScrollLockConfig = {
  lockClass: 'is-scroll-locked',
  allowTouchMoveSelectors: ['[data-scroll-lock-allow]', '.andrea-menu', '.andrea-menu-inner'],
}

const lockEntries = new Map<ScrollLockHandle, LockEntry>()
const defaultAllowTouchMoveSelectors = [...config.allowTouchMoveSelectors]

let nextHandleId = 0
let savedScrollX = 0
let savedScrollY = 0
let touchStartY = 0
let listenersAttached = false
let bodyStyleSnapshot: Partial<CSSStyleDeclaration> | null = null
let cleanupAttached = false

const createHandle = (): ScrollLockHandle => {
  nextHandleId += 1
  return `scroll-lock-${nextHandleId}`
}

const normalizeSelectors = (selectors?: string[]): string[] => {
  const merged = selectors && selectors.length > 0 ? selectors : config.allowTouchMoveSelectors
  return Array.from(new Set(merged)).filter(Boolean)
}

const isLocked = (): boolean => lockEntries.size > 0

const getAllowedScrollableAncestors = (
  target: EventTarget | null,
  selectors: string[],
): HTMLElement[] => {
  if (!(target instanceof Element)) return []

  const scrollables: HTMLElement[] = []
  for (const selector of selectors) {
    let current: Element | null = target
    while (current) {
      if (current.matches(selector)) {
        scrollables.push(current as HTMLElement)
      }
      current = current.parentElement
    }
  }

  return Array.from(new Set(scrollables))
}

const canScrollForDelta = (element: HTMLElement, deltaY: number): boolean => {
  if (element.scrollHeight <= element.clientHeight) return false

  if (deltaY < 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight
  }

  if (deltaY > 0) {
    return element.scrollTop > 0
  }

  return true
}

const shouldAllowTouchMove = (event: TouchEvent): boolean => {
  const selectors = Array.from(
    new Set(Array.from(lockEntries.values()).flatMap((entry) => entry.allowTouchMoveSelectors)),
  )

  if (selectors.length === 0) return false

  const currentY = event.touches[0]?.clientY ?? touchStartY
  const deltaY = currentY - touchStartY
  const candidates = getAllowedScrollableAncestors(event.target, selectors)

  return candidates.some((element) => canScrollForDelta(element, deltaY))
}

const onTouchStart = (event: TouchEvent) => {
  if (!isLocked()) return
  touchStartY = event.touches[0]?.clientY ?? 0
}

const onTouchMove = (event: TouchEvent) => {
  if (!isLocked()) return

  if (shouldAllowTouchMove(event)) {
    return
  }

  event.preventDefault()
}

const attachListeners = () => {
  if (listenersAttached) return
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  listenersAttached = true
}

const detachListeners = () => {
  if (!listenersAttached) return
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchmove', onTouchMove)
  listenersAttached = false
}

const attachCleanup = () => {
  if (cleanupAttached) return

  window.addEventListener('pagehide', clearScrollLocks)
  cleanupAttached = true
}

const applyDomLock = () => {
  const root = document.documentElement
  const body = document.body

  savedScrollX = window.scrollX
  savedScrollY = window.scrollY

  bodyStyleSnapshot = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
  }

  root.classList.add(config.lockClass)
  body.classList.add(config.lockClass)

  body.style.position = 'fixed'
  body.style.top = `-${savedScrollY}px`
  body.style.left = `-${savedScrollX}px`
  body.style.right = '0'
  body.style.width = '100%'
  body.style.overflow = 'hidden'

  attachListeners()
}

const releaseDomLock = () => {
  const root = document.documentElement
  const body = document.body

  root.classList.remove(config.lockClass)
  body.classList.remove(config.lockClass)

  body.style.position = bodyStyleSnapshot?.position ?? ''
  body.style.top = bodyStyleSnapshot?.top ?? ''
  body.style.left = bodyStyleSnapshot?.left ?? ''
  body.style.right = bodyStyleSnapshot?.right ?? ''
  body.style.width = bodyStyleSnapshot?.width ?? ''
  body.style.overflow = bodyStyleSnapshot?.overflow ?? ''

  bodyStyleSnapshot = null
  detachListeners()

  window.scrollTo(savedScrollX, savedScrollY)
}

export const enableScrollLock = (options: ScrollLockOptions = {}): ScrollLockHandle => {
  attachCleanup()

  const handle = options.handle ?? createHandle()
  const entry = lockEntries.get(handle)

  if (entry) {
    entry.count += 1
    entry.allowTouchMoveSelectors = normalizeSelectors(options.allowTouchMoveSelectors)
    lockEntries.set(handle, entry)
    return handle
  }

  const wasUnlocked = !isLocked()
  lockEntries.set(handle, {
    count: 1,
    allowTouchMoveSelectors: normalizeSelectors(options.allowTouchMoveSelectors),
  })

  if (wasUnlocked) {
    applyDomLock()
  }

  return handle
}

export const disableScrollLock = (handle: ScrollLockHandle): void => {
  const entry = lockEntries.get(handle)
  if (!entry) return

  if (entry.count > 1) {
    entry.count -= 1
    lockEntries.set(handle, entry)
    return
  }

  lockEntries.delete(handle)

  if (!isLocked()) {
    releaseDomLock()
  }
}

export const clearScrollLocks = (): void => {
  if (!isLocked()) return
  lockEntries.clear()
  releaseDomLock()
}

export const configureScrollLock = (nextConfig: Partial<ScrollLockConfig>): void => {
  if (nextConfig.lockClass) {
    config.lockClass = nextConfig.lockClass
  }

  if (nextConfig.allowTouchMoveSelectors) {
    config.allowTouchMoveSelectors = normalizeSelectors(nextConfig.allowTouchMoveSelectors)
  }
}

export const resetScrollLockDefaults = (): void => {
  config.allowTouchMoveSelectors = [...defaultAllowTouchMoveSelectors]
}

export const isScrollLockActive = (): boolean => isLocked()
