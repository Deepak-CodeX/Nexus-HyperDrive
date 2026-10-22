import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import { scrollStore, SECTIONS, PAINT_COLORS } from './lib/scrollStore'
import './styles/app.css'

// Technical concept specifications
const SPECIFICATIONS = [
  {
    key: 'aero',
    label: 'AERODYNAMICS',
    value: '94%',
    sub: 'Active Morphing Panels',
    stat: '94',
    unit: '%',
    desc: 'Active carbon aerodynamic surfaces continuously reshape in real time. Dual electro-mechanical canards, active underbody venturi, and morphing wing elements articulate 200 times per second to maintain laminar air attachment.',
    specs: [
      { label: 'DOWNFORCE', val: '1,420 KG @ 300 KM/H' },
      { label: 'ACTUATION TIME', val: '12 MS' },
      { label: 'SURFACE MATERIAL', val: 'SHAPE-MEMORY CARBON' },
    ],
  },
  {
    key: 'drag',
    label: 'DRAG COEFFICIENT',
    value: '0.18 Cd',
    sub: 'Plasma Boundary Control',
    stat: '0.18',
    unit: 'Cd',
    desc: 'Ultra-low 0.18 drag coefficient achieved through active floor venturi channels, sealed directional turbine wheels, and electrostatic plasma boundary-layer control reducing surface air friction.',
    specs: [
      { label: 'LAMINAR EFFICIENCY', val: '99.2%' },
      { label: 'FRONTAL AREA', val: '1.74 M²' },
      { label: 'WHEEL TURBINE', val: 'DIRECTIONAL INWARD' },
    ],
  },
  {
    key: 'power',
    label: 'POWER CORE',
    value: '1.6 MW',
    sub: 'Solid-State Quantum Core',
    stat: '98',
    unit: '%',
    desc: 'Solid-state quantum power core with cryo-cooled flux stabilizers. Generates 1,600 kW (2,175 hp) instantaneous continuous output with dual rotating electromagnetic containment rings.',
    specs: [
      { label: 'PEAK OUTPUT', val: '2,175 HP (1,600 KW)' },
      { label: 'CORE STABILIZED TEMP', val: '38°C' },
      { label: 'FLUX CONVERSION', val: '98.7% EFFICIENCY' },
    ],
  },
  {
    key: 'battery',
    label: 'BATTERY MATRIX',
    value: '142 kWh',
    sub: 'Graphene-Silicon Structural Pack',
    stat: '87',
    unit: '%',
    desc: 'Structural graphene-silicon energy pack integrated directly into the carbon monocoque chassis. Enables ultra-rapid 800 kW photonic charging from 10% to 80% in 7.8 minutes.',
    specs: [
      { label: 'ENERGY DENSITY', val: '460 WH/KG' },
      { label: 'RAPID CHARGE', val: '800 KW PHOTONIC' },
      { label: 'CELL VOLTAGE', val: '920 V NOMINAL' },
    ],
  },
  {
    key: 'torque',
    label: 'TORQUE VECTOR',
    value: '1,240 Nm',
    sub: 'Quad Axial-Flux Motors',
    stat: '1,240',
    unit: 'Nm',
    desc: 'Four bespoke axial-flux permanent magnet electric motors powering each wheel independently with sub-millisecond dynamic torque vectoring. 0–100 km/h in 1.72 seconds.',
    specs: [
      { label: '0–100 KM/H', val: '1.72 SECONDS' },
      { label: 'MOTOR LIMIT', val: '26,000 RPM' },
      { label: 'VECTOR LATENCY', val: '0.4 MS' },
    ],
  },
  {
    key: 'range',
    label: 'PREDICTIVE RANGE',
    value: '842 KM',
    sub: 'Neural Energy Optimization',
    stat: '842',
    unit: 'KM',
    desc: 'Intelligent range prediction model continuously calculating atmospheric elevation, air temperature, road inclination, and driver neural response for real-world hyper-efficiency.',
    specs: [
      { label: 'WLTP RATING', val: '842 KM' },
      { label: 'REGEN BRAKING', val: 'UP TO 450 KW' },
      { label: 'PARASITIC LOSS', val: '< 1.4%' },
    ],
  },
  {
    key: 'intelligence',
    label: 'NEURAL FABRIC',
    value: '240 TOPS',
    sub: 'Distributed AI Compute',
    stat: '99',
    unit: '%',
    desc: 'Ten optical and electromagnetic nodes spanning the cockpit, power core, steering actuators, and aero surfaces. 240 TOPS per controller ensure the hypercar reacts before human reflex.',
    specs: [
      { label: 'COMPUTE POWER', val: '240 TOPS / NODE' },
      { label: 'SENSOR BUS', val: 'PHOTONIC OPTICAL' },
      { label: 'REACTION TIME', val: '< 0.2 MS' },
    ],
  },
]

// -------------------------------------------------------------
// Sleek Minimalist Loading Screen
// -------------------------------------------------------------
function LoadingScreen({ onComplete }) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let p = 0
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 12) + 8
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setPercent(100)
        setTimeout(onComplete, 300)
      } else {
        setPercent(p)
      }
    }, 40)

    const failsafe = setTimeout(() => {
      clearInterval(interval)
      onComplete()
    }, 1200)

    return () => {
      clearInterval(interval)
      clearTimeout(failsafe)
    }
  }, [onComplete])

  return (
    <div className="loading-screen" aria-label="System Initializing">
      <div className="loading-grid-bg" />
      <div className="loading-container">
        <div className="loading-header">
          <span className="mono-label">NEXUS SYSTEM ARCHITECTURE</span>
          <span className="mono-label glow-cyan">INITIALIZING // 2035</span>
        </div>

        <div className="loading-core-visual">
          <div className="core-ring core-ring-outer" />
          <div className="core-ring core-ring-inner" />
          <div className="core-symbol">N</div>
        </div>

        <div className="loading-bar-track">
          <div className="loading-bar-fill" style={{ width: `${percent}%` }} />
        </div>

        <div className="loading-footer">
          <span className="mono-sub">OPTICAL TELEMETRY ACTIVE</span>
          <span className="mono-sub glow-cyan">{percent}% SYNCHRONIZED</span>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// Interactive Holographic Diagnostic Modal
// -------------------------------------------------------------
function SpecHoloModal({ spec, onClose, onFocusComponent }) {
  if (!spec) return null

  return (
    <div
      className="spec-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="spec-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="spec-modal-header">
          <div className="spec-modal-tag">
            <span className="pulse-indicator" />
            <span id="modal-title">TELEMETRY DIAGNOSTICS // {spec.label}</span>
          </div>
          <button
            className="spec-close-btn"
            onClick={onClose}
            aria-label="Close specification modal"
          >
            ✕
          </button>
        </div>

        <div className="spec-modal-body">
          <div className="spec-headline">
            <span className="spec-value-large">{spec.value}</span>
            <span className="spec-sub-title">{spec.sub}</span>
          </div>

          <p className="spec-desc-text">{spec.desc}</p>

          <div className="spec-metrics-grid">
            {spec.specs.map((item, i) => (
              <div key={i} className="spec-metric-cell">
                <span className="metric-cell-label">{item.label}</span>
                <span className="metric-cell-val">{item.val}</span>
              </div>
            ))}
          </div>

          <div className="spec-disclaimer-notice">
            * Fictional concept specification engineered for the NEXUS HYPERDRIVE autonomous vehicle study.
          </div>
        </div>

        <div className="spec-modal-footer">
          <button
            className="spec-focus-action-btn"
            onClick={() => onFocusComponent(spec.key)}
          >
            <span>FOCUS CAMERA ON COMPONENT</span>
            <span className="btn-arrow">→</span>
          </button>
          <span className="spec-status-ok">STATUS: OPTIMAL</span>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// Bespoke Commission Inquiry Modal
// -------------------------------------------------------------
function CommissionModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false)
  if (!isOpen) return null

  return (
    <div
      className="spec-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="spec-modal-card commission-card" onClick={(e) => e.stopPropagation()}>
        <div className="spec-modal-header">
          <div className="spec-modal-tag">
            <span className="pulse-indicator" />
            <span>BESPOKE ALLOCATION // LAB 07 GENEVA</span>
          </div>
          <button className="spec-close-btn" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>

        <div className="spec-modal-body">
          {!submitted ? (
            <>
              <h3 className="commission-title">Commission Allocation Protocol</h3>
              <p className="commission-desc">
                Production is limited to 77 individually authenticated units. Each chassis is tailored to the driver's neural biometric profile and aerodynamic requirements.
              </p>
              <form
                className="commission-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
              >
                <div className="form-group">
                  <label htmlFor="comm-name">CLIENT DESIGNATION / NAME</label>
                  <input id="comm-name" type="text" required placeholder="e.g. Elena Rostova" />
                </div>
                <div className="form-group">
                  <label htmlFor="comm-email">SECURE TELEMETRY CHANNEL / EMAIL</label>
                  <input id="comm-email" type="email" required placeholder="client@domain.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="comm-region">DELIVERY SANCTUARY REGION</label>
                  <select id="comm-region" defaultValue="geneva">
                    <option value="geneva">Geneva / Western Europe</option>
                    <option value="tokyo">Tokyo / East Asia</option>
                    <option value="dubai">Dubai / Middle East</option>
                    <option value="monaco">Monaco / Mediterranean</option>
                    <option value="california">Monterey / North America</option>
                  </select>
                </div>
                <button type="submit" className="commission-submit-btn">
                  <span>TRANSMIT ALLOCATION INQUIRY</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>
              <div className="spec-disclaimer-notice">
                * Concept prototype demonstration. Submissions are processed as interactive simulator inquiries.
              </div>
            </>
          ) : (
            <div className="commission-success">
              <span className="success-icon">✓</span>
              <h4>TRANSMISSION ACKNOWLEDGED</h4>
              <p>Your allocation inquiry has been recorded in the Lab 07 Geneva allocation registry.</p>
              <button className="commission-submit-btn" onClick={onClose}>
                <span>RETURN TO SHOWROOM</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// Main Application Component
// -------------------------------------------------------------
export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSpec, setActiveSpec] = useState(null)
  const [activeSection, setActiveSection] = useState(0)
  const [activeColor, setActiveColor] = useState(PAINT_COLORS[0])
  const [cameraPreset, setCameraPreset] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commissionOpen, setCommissionOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)

  const progressLineRef = useRef(null)
  const progressBadgeRef = useRef(null)
  const audioCtxRef = useRef(null)

  // Sync state from scrollStore
  useEffect(() => {
    scrollStore.init()

    const unsubscribe = scrollStore.subscribe((state) => {
      setActiveSection(state.activeSection)
      setActiveColor(state.activeColor)
      setCameraPreset(state.cameraPreset)
    })

    let rafId
    const updateUI = () => {
      const p = scrollStore.progress
      if (progressLineRef.current) {
        progressLineRef.current.style.transform = `scaleX(${p})`
      }
      if (progressBadgeRef.current) {
        const pct = Math.floor(p * 100)
        progressBadgeRef.current.textContent = `${pct.toString().padStart(3, '0')}%`
      }
      rafId = requestAnimationFrame(updateUI)
    }

    rafId = requestAnimationFrame(updateUI)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveSpec(null)
        setCommissionOpen(false)
        setMobileMenuOpen(false)
        scrollStore.clearFocus()
        scrollStore.clearCameraPreset()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('keydown', onKeyDown)
      unsubscribe()
      scrollStore.destroy()
    }
  }, [])

  // Web Audio acoustic feedback synthesizer
  const playCyberChirp = useCallback(
    (freq = 880, dur = 0.08) => {
      if (!audioEnabled) return
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        }
        const ctx = audioCtxRef.current
        if (ctx.state === 'suspended') ctx.resume()

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + dur)

        gain.gain.setValueAtTime(0.06, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + dur)
      } catch {
        // audio failsafe
      }
    },
    [audioEnabled]
  )

  const handleOpenSpec = (spec) => {
    playCyberChirp(960, 0.1)
    setActiveSpec(spec)
    scrollStore.setFocus(spec.key)
  }

  const handleCloseSpec = () => {
    playCyberChirp(640, 0.08)
    setActiveSpec(null)
    scrollStore.clearFocus()
  }

  const handleNavClick = (index) => {
    playCyberChirp(720, 0.08)
    setMobileMenuOpen(false)
    scrollStore.scrollToSection(index)
  }

  const handleColorSelect = (colorObj) => {
    playCyberChirp(820, 0.08)
    scrollStore.setColor(colorObj)
  }

  const handleCameraPreset = (presetKey) => {
    playCyberChirp(900, 0.08)
    if (cameraPreset === presetKey) {
      scrollStore.clearCameraPreset()
    } else {
      scrollStore.setCameraPreset(presetKey)
    }
  }

  return (
    <div className="nexus-application">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Atmospheric Film Grain Overlay */}
      <div className="ambient-grain" aria-hidden="true" />

      {/* Fixed Fullscreen 3D WebGL Canvas */}
      <div className="webgl-canvas-container" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.8)]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
            stencil: false,
            depth: true,
          }}
          camera={{ fov: 36, position: [1.8, 0.52, 2.8] }}
        >
          <Scene />
        </Canvas>
        <div className="viewport-vignette" />
      </div>

      {/* Top Header Navigation */}
      <header className="header-nav">
        <div className="brand-group" onClick={() => handleNavClick(0)} role="button" tabIndex={0}>
          <span className="brand-name">NEXUS</span>
          <span className="brand-slash">//</span>
          <span className="brand-model">HYPERDRIVE</span>
          <span className="brand-pulse-dot" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links" aria-label="Main Navigation">
          {SECTIONS.map((sec, idx) => (
            <button
              key={sec.id}
              className={`nav-link-btn ${activeSection === idx ? 'nav-link-active' : ''}`}
              onClick={() => handleNavClick(idx)}
            >
              <span className="nav-index">0{idx + 1}</span>
              <span className="nav-title">{sec.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Header Controls */}
        <div className="nav-controls-right">
          <button
            className={`audio-toggle-btn ${audioEnabled ? 'audio-on' : ''}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
            aria-label="Toggle Acoustic Telemetry"
          >
            {audioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}
          </button>

          <button
            className="reserve-cta-btn"
            onClick={() => setCommissionOpen(true)}
          >
            <span>INQUIRE</span>
            <span className="btn-arrow">→</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`bar ${mobileMenuOpen ? 'bar-open-1' : ''}`} />
            <span className={`bar ${mobileMenuOpen ? 'bar-open-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
          <div className="mobile-drawer-header">
            <span className="mono-label">INDEX NAVIGATION</span>
            <button className="spec-close-btn" onClick={() => setMobileMenuOpen(false)}>✕</button>
          </div>
          <div className="mobile-drawer-links">
            {SECTIONS.map((sec, idx) => (
              <button
                key={sec.id}
                className={`mobile-nav-item ${activeSection === idx ? 'mobile-active' : ''}`}
                onClick={() => handleNavClick(idx)}
              >
                <span className="mobile-num">0{idx + 1} //</span>
                <span className="mobile-text">{sec.label}</span>
              </button>
            ))}
          </div>
          <div className="mobile-drawer-footer">
            <button
              className="commission-submit-btn"
              onClick={() => {
                setMobileMenuOpen(false)
                setCommissionOpen(true)
              }}
            >
              COMMISSION ALLOCATION
            </button>
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD Bar */}
      <aside className="bottom-telemetry-dock" aria-label="Vehicle Status Telemetry">
        <div className="telemetry-inner">
          <div className="telemetry-col">
            <span className="telem-label">PROTOTYPE</span>
            <span className="telem-val">NEXUS-01 / GENEVA</span>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-col">
            <span className="telem-label">PROPULSION</span>
            <span className="telem-val cyan-text">1.6 MW SOLID-STATE</span>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-col">
            <span className="telem-label">AERODYNAMICS</span>
            <span className="telem-val">0.18 Cd ACTIVE</span>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-col">
            <span className="telem-label">TIMELINE PROGRESS</span>
            <span ref={progressBadgeRef} className="telem-val cyan-text">000%</span>
          </div>
        </div>
      </aside>

      {/* ========================================================
          CINEMATIC SCROLL TIMELINE CONTENT (6 SCENES)
          ======================================================== */}
      <main id="scroll-root" className="scroll-timeline">
        {/* SCENE 01 — HERO / AWAKEN */}
        <section className="timeline-scene hero-scene" id="scene-hero">
          <div className="scene-content hero-content">
            <div className="hero-eyebrow-tag">
              <span className="glow-bullet" />
              <span>LAB 07 GENEVA // 2035 CONCEPT STUDY</span>
            </div>

            <h1 className="hero-headline">
              <span className="headline-prefix">THE DEFINITIVE HYPERCAR</span>
              <span className="headline-nexus">NEXUS HYPERDRIVE</span>
            </h1>

            <p className="hero-subtext">
              Where autonomous intelligence merges with laminar aerodynamics and solid-state quantum propulsion.
            </p>

            <div className="hero-actions-row">
              <button
                className="cta-primary-large"
                onClick={() => handleNavClick(1)}
              >
                <span>EXPLORE DESIGN</span>
                <span className="btn-icon">→</span>
              </button>
              <button
                className="cta-secondary-large"
                onClick={() => handleNavClick(5)}
              >
                <span>INTERACTIVE SHOWCASE</span>
              </button>
            </div>

            <div className="scroll-indicator-wrap">
              <div className="mouse-wheel-icon">
                <div className="mouse-wheel-dot" />
              </div>
              <span className="scroll-indicator-text">SCROLL TO COMMENCE REVEAL</span>
            </div>
          </div>
        </section>

        {/* SCENE 02 — DESIGN & SCULPTED FORM */}
        <section className="timeline-scene scene-side-left" id="scene-form">
          <div className="scene-content scene-card-floating">
            <div className="scene-kicker">
              <span className="kicker-num">02</span>
              <span className="kicker-title">SCULPTED FORM</span>
            </div>
            <h2 className="scene-heading">Born from Pure<br />Velocity.</h2>
            <p className="scene-paragraph">
              1.23 meters tall, 4.53 meters long. A carbon monocoque shell engineered around a polarized
              glass cockpit canopy. An aggressive stance sculpted for extreme ground-effect adhesion.
            </p>
            <div className="scene-spec-highlights">
              <div className="spec-pill">
                <span className="pill-title">CHASSIS</span>
                <span className="pill-val">CARBON MONOCOQUE</span>
              </div>
              <div className="spec-pill">
                <span className="pill-title">WHEELS</span>
                <span className="pill-val">22″ DIRECTIONAL TURBINE</span>
              </div>
              <div className="spec-pill">
                <span className="pill-title">COCKPIT</span>
                <span className="pill-val">POLARIZED ACTIVE CANOPY</span>
              </div>
            </div>
          </div>
        </section>

        {/* SCENE 03 — AERODYNAMICS */}
        <section className="timeline-scene scene-side-right" id="scene-aero">
          <div className="scene-content scene-card-floating">
            <div className="scene-kicker">
              <span className="kicker-num">03</span>
              <span className="kicker-title">AERODYNAMICS</span>
            </div>
            <h2 className="scene-heading">Laminar Wind<br />Architecture.</h2>
            <p className="scene-paragraph">
              Active carbon surfaces continuously adjust pitch and downforce in real time.
              Venturi tunnels and an active morphing rear wing produce 1,420 kg of downforce at 300 km/h with zero parasitic penalty.
            </p>
            <div className="scene-inline-action">
              <button
                className="inline-spec-trigger"
                onClick={() => handleOpenSpec(SPECIFICATIONS[0])}
              >
                <span>INSPECT ACTIVE AERO MATRIX</span>
                <span className="btn-arrow">→</span>
              </button>
              <button
                className="inline-spec-trigger secondary"
                onClick={() => handleOpenSpec(SPECIFICATIONS[1])}
              >
                <span>DRAG COEFFICIENT DIAGNOSTICS</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* SCENE 04 — QUANTUM CORE & PROPULSION */}
        <section className="timeline-scene scene-side-left" id="scene-power">
          <div className="scene-content scene-card-floating">
            <div className="scene-kicker">
              <span className="kicker-num">04</span>
              <span className="kicker-title">PROPULSION</span>
            </div>
            <h2 className="scene-heading">1.6 MW Solid-State<br />Quantum Core.</h2>
            <p className="scene-paragraph">
              Dual concentric electromagnetic flux rings generate 2,175 peak horsepower across quad
              axial-flux wheel motors. Sub-millisecond torque vectoring delivers 0–100 km/h in 1.72 seconds.
            </p>
            <div className="specs-card-row">
              {SPECIFICATIONS.slice(2, 5).map((s) => (
                <button
                  key={s.key}
                  className="spec-row-button"
                  onClick={() => handleOpenSpec(s)}
                >
                  <span className="row-btn-label">{s.label}</span>
                  <span className="row-btn-val">{s.value}</span>
                  <span className="row-btn-inspect">VIEW →</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SCENE 05 — NEURAL INTELLIGENCE */}
        <section className="timeline-scene scene-side-right" id="scene-intelligence">
          <div className="scene-content scene-card-floating">
            <div className="scene-kicker">
              <span className="kicker-num">05</span>
              <span className="kicker-title">INTELLIGENCE</span>
            </div>
            <h2 className="scene-heading">Distributed AI<br />Neural Mesh.</h2>
            <p className="scene-paragraph">
              Ten optical and electromagnetic nodes span the cockpit, power core, steering actuators,
              and aero surfaces. 240 TOPS per controller ensure the hypercar reacts before human reflex.
            </p>
            <div className="neural-connection-preview">
              <div className="neural-pulse-dot" />
              <span className="neural-preview-label">AUTONOMOUS NEURAL FABRIC: SYNCHRONIZED</span>
            </div>
            <div className="scene-inline-action" style={{ marginTop: '16px' }}>
              <button
                className="inline-spec-trigger"
                onClick={() => handleOpenSpec(SPECIFICATIONS[6])}
              >
                <span>OPEN NEURAL DIAGNOSTICS</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* SCENE 06 — INTERACTIVE SHOWCASE & CONFIGURATOR */}
        <section className="timeline-scene showcase-scene" id="scene-showcase">
          <div className="scene-content showcase-content">
            <div className="scene-kicker centered">
              <span className="kicker-num">06</span>
              <span className="kicker-title">INTERACTIVE SHOWCASE</span>
            </div>
            <h2 className="showcase-title">Configure Your Machine.</h2>
            <p className="showcase-subtext">
              Inspect exterior body finishes, explore camera viewpoints, and review telemetry diagnostics.
            </p>

            {/* Interactive Vehicle Paint Configurator */}
            <div className="configurator-panel">
              <span className="config-label">BESPOKE EXTERIOR FINISH</span>
              <div className="color-swatches-row">
                {PAINT_COLORS.map((col) => (
                  <button
                    key={col.id}
                    className={`color-swatch-btn ${activeColor.id === col.id ? 'swatch-active' : ''}`}
                    onClick={() => handleColorSelect(col)}
                    aria-label={`Select ${col.name}`}
                  >
                    <span className="swatch-circle" style={{ backgroundColor: col.hex }} />
                    <span className="swatch-name">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Camera Viewpoint Presets */}
            <div className="configurator-panel">
              <span className="config-label">CAMERA VIEWPOINT PRESETS</span>
              <div className="camera-presets-row">
                {[
                  { key: 'front', label: 'FRONT 3/4' },
                  { key: 'profile', label: 'SIDE PROFILE' },
                  { key: 'rear', label: 'REAR DECK' },
                  { key: 'wing', label: 'ACTIVE WING' },
                  { key: 'core', label: 'QUANTUM CORE' },
                  { key: 'top', label: 'TOP VIEW' },
                ].map((preset) => (
                  <button
                    key={preset.key}
                    className={`preset-btn ${cameraPreset === preset.key ? 'preset-active' : ''}`}
                    onClick={() => handleCameraPreset(preset.key)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Telemetry Inspection Grid */}
            <div className="specs-full-grid">
              {SPECIFICATIONS.map((s) => (
                <button
                  key={s.key}
                  className="spec-grid-card"
                  onClick={() => handleOpenSpec(s)}
                >
                  <div className="grid-card-header">
                    <span className="grid-card-label">{s.label}</span>
                    <span className="grid-card-tag">INSPECT</span>
                  </div>
                  <div className="grid-card-val">{s.value}</div>
                  <div className="grid-card-sub">{s.sub}</div>
                </button>
              ))}
            </div>

            {/* Commission Call to Action */}
            <div className="showcase-commission-box">
              <div className="commission-meta">
                <span className="commission-tag">LIMITED TO 77 BESPOKE UNITS</span>
                <span className="commission-sanctuary">LAB 07 GENEVA RESEARCH FACILITY</span>
              </div>
              <button
                className="cta-primary-large"
                onClick={() => setCommissionOpen(true)}
              >
                <span>COMMISSION ALLOCATION</span>
                <span className="btn-icon">→</span>
              </button>
            </div>

            {/* Application Footer */}
            <footer className="experience-footer">
              <div className="footer-line">
                <span>© 2035 NEXUS AUTOMOTIVE RESEARCH &amp; DYNAMICS</span>
                <span>NEURAL PROTOCOL VERIFIED // ALL SYSTEMS NOMINAL</span>
              </div>
              <div className="footer-disclaimer">
                NEXUS HYPERDRIVE is an autonomous concept study. All numerical performance figures are simulated engineering projections.
                Base 3D vehicle geometry by vicent091036 (CC-BY 4.0).
              </div>
            </footer>
          </div>
        </section>
      </main>

      {/* Global Scroll Progress Bar at Bottom */}
      <div className="timeline-progress-track" aria-hidden="true">
        <div ref={progressLineRef} className="timeline-progress-bar" />
      </div>

      {/* Holographic Diagnostic Modal */}
      <SpecHoloModal
        spec={activeSpec}
        onClose={handleCloseSpec}
        onFocusComponent={(k) => {
          scrollStore.setFocus(k)
        }}
      />

      {/* Commission Inquiry Modal */}
      <CommissionModal
        isOpen={commissionOpen}
        onClose={() => setCommissionOpen(false)}
      />
    </div>
  )
}
