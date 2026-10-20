// High-performance scroll and camera state coordinator
// Avoids React re-renders for 60fps WebGL rendering

class ScrollStore {
  constructor() {
    this.progress = 0
    this.targetProgress = 0
    this.velocity = 0
    this.focusedKey = null
    this.focusProgress = 0 // 0 = following timeline, 1 = focused on component
    this.listeners = new Set()
    this.initialized = false
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return
    this.initialized = true

    const onScroll = () => {
      const scrollEl = document.getElementById('scroll-root')
      if (!scrollEl) {
        const total = document.documentElement.scrollHeight - window.innerHeight
        this.targetProgress = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0
      } else {
        const rect = scrollEl.getBoundingClientRect()
        const total = scrollEl.scrollHeight - window.innerHeight
        const top = -rect.top
        this.targetProgress = total > 0 ? Math.min(Math.max(top / total, 0), 1) : 0
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768
      onScroll()
    }, { passive: true })
    
    onScroll()
  }

  update(delta = 0.016) {
    const prev = this.progress
    // Smooth damping for buttery cinematic camera feel
    const factor = this.isMobile ? 0.08 : 0.06
    this.progress += (this.targetProgress - this.progress) * factor
    this.velocity = Math.abs(this.progress - prev) / Math.max(delta, 0.001)

    // Handle smooth transition to/from focused inspect view
    const targetFocus = this.focusedKey ? 1 : 0
    this.focusProgress += (targetFocus - this.focusProgress) * 0.08

    return {
      progress: this.progress,
      velocity: this.velocity,
      focusedKey: this.focusedKey,
      focusProgress: this.focusProgress
    }
  }

  setFocus(key) {
    this.focusedKey = key
    this.notify()
  }

  clearFocus() {
    this.focusedKey = null
    this.notify()
  }

  scrollToScene(p) {
    const total = document.documentElement.scrollHeight - window.innerHeight
    const top = p * total
    window.scrollTo({ top, behavior: 'smooth' })
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    for (const l of this.listeners) l(this)
  }
}

export const scrollStore = new ScrollStore()
