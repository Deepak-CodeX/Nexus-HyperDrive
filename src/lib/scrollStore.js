// High-performance scroll, camera, and automotive configurator coordinator
// Single-source-of-truth frame updates with delta-independent dampening

export const SECTIONS = [
  { id: 'scene-hero', label: 'OVERVIEW', p: 0.0 },
  { id: 'scene-form', label: 'DESIGN', p: 0.22 },
  { id: 'scene-aero', label: 'AERODYNAMICS', p: 0.44 },
  { id: 'scene-power', label: 'QUANTUM CORE', p: 0.65 },
  { id: 'scene-intelligence', label: 'NEURAL AI', p: 0.82 },
  { id: 'scene-showcase', label: 'SHOWCASE', p: 0.98 },
]

export const PAINT_COLORS = [
  { id: 'graphite', name: 'Obsidian Graphite', hex: '#0c131a', metalness: 0.94, roughness: 0.18, clearcoat: 1.0 },
  { id: 'cyan', name: 'Hyper Cyan', hex: '#00384d', metalness: 0.92, roughness: 0.16, clearcoat: 1.0 },
  { id: 'silver', name: 'Liquid Titanium', hex: '#8a99a8', metalness: 0.96, roughness: 0.14, clearcoat: 1.0 },
  { id: 'stealth', name: 'Stealth Carbon', hex: '#060709', metalness: 0.4, roughness: 0.45, clearcoat: 0.3 },
]

class ScrollStore {
  constructor() {
    this.progress = 0
    this.targetProgress = 0
    this.velocity = 0
    this.focusedKey = null
    this.focusProgress = 0
    this.activeSection = 0
    this.activeColor = PAINT_COLORS[0]
    this.cameraPreset = null // null = timeline driven, or 'hero' | 'front' | 'side' | 'wing' | 'core' | 'top'
    this.listeners = new Set()
    this.initialized = false
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    this.reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.scrollEl = null
    this.lastFrameTime = 0
    this.frameUpdated = false
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return
    this.initialized = true

    this.onScroll = () => {
      const scrollEl = document.getElementById('scroll-root') || document.documentElement
      const total = scrollEl.scrollHeight - window.innerHeight
      if (total <= 0) {
        this.targetProgress = 0
        return
      }
      const scrollY = window.scrollY || window.pageYOffset || 0
      this.targetProgress = Math.min(Math.max(scrollY / total, 0), 1)

      // Determine active section
      let currentIdx = 0
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        if (this.targetProgress >= SECTIONS[i].p - 0.06) {
          currentIdx = i
          break
        }
      }
      if (this.activeSection !== currentIdx) {
        this.activeSection = currentIdx
        this.notify()
      }
    }

    this.onResize = () => {
      this.isMobile = window.innerWidth < 768
      this.onScroll()
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.onMotionChange = (e) => {
      this.reducedMotion = e.matches
    }
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', this.onMotionChange)
    }

    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
    
    this.onScroll()
  }

  destroy() {
    if (!this.initialized || typeof window === 'undefined') return
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.removeEventListener) {
      motionQuery.removeEventListener('change', this.onMotionChange)
    }
    this.initialized = false
    this.listeners.clear()
  }

  // Called strictly ONCE per frame from Scene
  update(delta = 0.016) {
    const clampedDelta = Math.min(Math.max(delta, 0.001), 0.1)
    const prev = this.progress

    if (this.reducedMotion) {
      this.progress = this.targetProgress
      this.velocity = 0
    } else {
      // Frame-rate independent exponential decay:
      // factor = 1 - Math.exp(-speed * delta)
      const speed = this.isMobile ? 12 : 9
      const decay = 1 - Math.exp(-speed * clampedDelta)
      this.progress += (this.targetProgress - this.progress) * decay
      this.velocity = Math.abs(this.progress - prev) / clampedDelta
    }

    // Smooth transition into/out of component focus
    const targetFocus = this.focusedKey || this.cameraPreset ? 1 : 0
    const focusSpeed = 10
    const focusDecay = 1 - Math.exp(-focusSpeed * clampedDelta)
    this.focusProgress += (targetFocus - this.focusProgress) * focusDecay

    return {
      progress: this.progress,
      targetProgress: this.targetProgress,
      velocity: this.velocity,
      focusedKey: this.focusedKey,
      focusProgress: this.focusProgress,
      activeSection: this.activeSection,
      activeColor: this.activeColor,
      cameraPreset: this.cameraPreset,
      isMobile: this.isMobile,
      reducedMotion: this.reducedMotion,
    }
  }

  // Get current snapshot without advancing physics (read-only)
  getState() {
    return {
      progress: this.progress,
      targetProgress: this.targetProgress,
      velocity: this.velocity,
      focusedKey: this.focusedKey,
      focusProgress: this.focusProgress,
      activeSection: this.activeSection,
      activeColor: this.activeColor,
      cameraPreset: this.cameraPreset,
      isMobile: this.isMobile,
      reducedMotion: this.reducedMotion,
    }
  }

  setFocus(key) {
    this.focusedKey = key
    this.cameraPreset = null
    this.notify()
  }

  clearFocus() {
    this.focusedKey = null
    this.notify()
  }

  setCameraPreset(preset) {
    this.cameraPreset = preset
    this.focusedKey = null
    this.notify()
  }

  clearCameraPreset() {
    this.cameraPreset = null
    this.notify()
  }

  setColor(colorObj) {
    this.activeColor = colorObj
    this.notify()
  }

  scrollToSection(index) {
    if (index < 0 || index >= SECTIONS.length) return
    const targetP = SECTIONS[index].p
    this.scrollToProgress(targetP)
  }

  scrollToProgress(p) {
    const scrollEl = document.getElementById('scroll-root') || document.documentElement
    const total = scrollEl.scrollHeight - window.innerHeight
    if (total <= 0) return
    const top = p * total
    window.scrollTo({
      top,
      behavior: this.reducedMotion ? 'auto' : 'smooth',
    })
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    for (const l of this.listeners) {
      try {
        l(this.getState())
      } catch (err) {
        console.error('ScrollStore listener error:', err)
      }
    }
  }
}

export const scrollStore = new ScrollStore()
