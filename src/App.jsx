import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import { scrollStore } from './lib/scrollStore'
import './styles/app.css'

// Technical specifications
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
      { label: 'SURFACE MATERIAL', val: 'SHAPE-MEMORY COMPOSITE' },
    ],
  },
  {
    key: 'drag',
    label: 'DRAG COEFFICIENT',
    value: '0.18 Cd',
    sub: 'Plasma Boundary Control',
    stat: '0.18',
    unit: 'Cd',
    desc: 'Ultra-low 0.18 drag coefficient achieved through active floor venturi channels, sealed directional turbine wheels, and electrostatic plasma boundary-layer control reducing surface friction.',
    specs: [
      { label: 'EFFICIENCY', val: '99.2% LAMINAR' },
      { label: 'FRONTIER AREA', val: '1.74 M²' },
      { label: 'WHEEL TURBINE', val: 'INWARD REVERSION' },
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
      { label: 'CORE TEMP', val: '38°C STABILIZED' },
      { label: 'FLUX EFFICIENCY', val: '98.7%' },
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
      { label: 'FAST CHARGE', val: '800 KW PHOTONIC' },
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
      { label: 'MAX RPM', val: '26,000 RPM' },
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
      { label: 'THERMAL LOSS', val: '< 1.4%' },
    ],
  },
]

// Cinematic Boot Sequence
function LoadingScreen({ onComplete }) {
  const [percent, setPercent] = useState(0)
  const [bootSteps, setBootSteps] = useState([
    { name: 'OPTICAL SYSTEM', status: 'STANDBY' },
    { name: 'AERODYNAMICS', status: 'STANDBY' },
    { name: 'POWER CORE', status: 'STANDBY' },
    { name: 'NEURAL SYSTEM', status: 'STANDBY' },
  ])

  useEffect(() => {
    let p = 0
    const stepThresholds = [25, 50, 75, 95]

    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 8) + 4
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setPercent(100)
        setBootSteps([
          { name: 'OPTICAL SYSTEM', status: 'ONLINE' },
          { name: 'AERODYNAMICS', status: 'ONLINE' },
          { name: 'POWER CORE', status: 'ONLINE' },
          { name: 'NEURAL SYSTEM', status: 'ONLINE' },
        ])
        setTimeout(onComplete, 450)
      } else {
        setPercent(p)
        setBootSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: p >= stepThresholds[idx] ? 'ONLINE' : 'INITIALIZING...',
          }))
        )
      }
    }, 60)

    // Failsafe auto-completion timeout (never gets stuck)
    const failsafe = setTimeout(() => {
      clearInterval(interval)
      onComplete()
    }, 2800)

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
          <span className="mono-label glow-cyan">INITIALIZING... // 2035</span>
        </div>

        <div className="loading-core-visual">
          <div className="core-ring core-ring-outer" />
          <div className="core-ring core-ring-inner" />
          <div className="core-symbol">N</div>
        </div>

        <div className="loading-bar-track">
          <div className="loading-bar-fill" style={{ width: `${percent}%` }} />
        </div>

        <div className="loading-steps-list">
          {bootSteps.map((s, idx) => (
            <div key={idx} className="boot-step-item">
              <span className="step-name">{s.name}</span>
              <span className="step-dots">...................................</span>
              <span className={`step-status ${s.status === 'ONLINE' ? 'step-online' : ''}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>

        <div className="loading-footer">
          <span className="mono-sub">SYSTEM ONLINE // 2035</span>
          <span className="mono-sub">{percent}% SYNCHRONIZED</span>
        </div>
      </div>
    </div>
  )
}

// Futuristic Cursor with Magnetic Lag
function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let rafId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`
      }
    }

    const render = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
      }
      rafId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(render)

    const addHover = () => ringRef.current?.classList.add('cursor-hover')
    const removeHover = () => ringRef.current?.classList.remove('cursor-hover')

    const interactives = document.querySelectorAll('button, a, [data-interactive]')
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  )
}

// Holographic Specification Modal
function SpecHoloModal({ spec, onClose, onFocusComponent }) {
  if (!spec) return null

  return (
    <div className="spec-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="spec-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="spec-modal-header">
          <div className="spec-modal-tag">
            <span className="pulse-indicator" />
            <span>HOLOGRAPHIC DIAGNOSTICS // {spec.label}</span>
          </div>
          <button className="spec-close-btn" onClick={onClose} aria-label="Close specification modal">
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
        </div>

        <div className="spec-modal-footer">
          <button className="spec-focus-action-btn" onClick={() => onFocusComponent(spec.key)}>
            <span>RE-ALIGN CAMERA FOCUS</span>
            <span className="btn-arrow">→</span>
          </button>
          <span className="spec-status-ok">TELEMETRY: OPTIMAL</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSpec, setActiveSpec] = useState(null)
  const [focusedKey, setFocusedKey] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const progressLineRef = useRef(null)
  const progressBadgeRef = useRef(null)
  const audioCtxRef = useRef(null)

  // Initialize high-performance scroll coordination
  useEffect(() => {
    scrollStore.init()

    let rafId
    const updateUI = () => {
      const p = scrollStore.targetProgress
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
        setFocusedKey(null)
        scrollStore.clearFocus()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Web Audio cyber synthesizer for clicks
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
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + dur)

        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + dur)
      } catch (err) {
        // audio failsafe
      }
    },
    [audioEnabled]
  )

  // Interactive component specification inspection
  const handleOpenSpec = (spec) => {
    playCyberChirp(960, 0.1)
    setActiveSpec(spec)
    setFocusedKey(spec.key)
    scrollStore.setFocus(spec.key)
  }

  const handleCloseSpec = () => {
    playCyberChirp(640, 0.08)
    setActiveSpec(null)
    setFocusedKey(null)
    scrollStore.clearFocus()
  }

  // Smooth jump to scene
  const handleJumpToScene = (sceneProgress) => {
    playCyberChirp(720, 0.1)
    scrollStore.scrollToScene(sceneProgress)
  }

  return (
    <div className="nexus-application">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <CustomCursor />

      {/* Atmospheric Film Grain Overlay */}
      <div className="ambient-grain" aria-hidden="true" />

      {/* Fixed Fullscreen 3D WebGL Canvas */}
      <div className="webgl-canvas-container" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, 1.8]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
            stencil: false,
            depth: true,
          }}
          camera={{ fov: 42, position: [0.55, 0.28, 2.3] }}
        >
          <Scene focusedKey={focusedKey} />
        </Canvas>
        <div className="viewport-vignette" />
        <div className="viewport-scanlines" />
      </div>

      {/* Top Futuristic Navigation Bar */}
      <header className="header-nav">
        <div className="brand-group" onClick={() => handleJumpToScene(0)}>
          <span className="brand-name">NEXUS</span>
          <span className="brand-slash">//</span>
          <span className="brand-model">HYPERDRIVE</span>
          <span className="brand-pulse-dot" />
        </div>

        <div className="nav-controls-right">
          <div className="system-status-chip">
            <span className="status-blip" />
            <span>SYSTEM ONLINE // 2035</span>
          </div>

          <button
            className={`audio-toggle-btn ${audioEnabled ? 'audio-on' : ''}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
            aria-label="Toggle Acoustic Telemetry"
          >
            {audioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}
          </button>

          <button
            className="reserve-cta-btn"
            onClick={() => handleJumpToScene(0.95)}
          >
            <span>DISCOVER</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </header>

      {/* Left Vertical HUD Telemetry Drawer */}
      <aside className="hud-sidebar hud-left">
        <div className="hud-vertical-line" />
        <div className="hud-card-stack">
          {SPECIFICATIONS.slice(0, 3).map((s) => (
            <button
              key={s.key}
              className={`hud-card-item ${focusedKey === s.key ? 'hud-card-active' : ''}`}
              onClick={() => handleOpenSpec(s)}
            >
              <div className="hud-card-top">
                <span className="hud-stat-label">{s.label}</span>
                <span className="hud-inspect-tag">INSPECT</span>
              </div>
              <div className="hud-stat-value">{s.value}</div>
              <div className="hud-stat-bar-track">
                <div
                  className="hud-stat-bar-fill"
                  style={{ width: `${Math.min(parseInt(s.stat, 10) || 85, 100)}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Right Vertical HUD Telemetry Drawer */}
      <aside className="hud-sidebar hud-right">
        <div className="hud-card-stack">
          {SPECIFICATIONS.slice(3).map((s) => (
            <button
              key={s.key}
              className={`hud-card-item ${focusedKey === s.key ? 'hud-card-active' : ''}`}
              onClick={() => handleOpenSpec(s)}
            >
              <div className="hud-card-top">
                <span className="hud-stat-label">{s.label}</span>
                <span className="hud-inspect-tag">INSPECT</span>
              </div>
              <div className="hud-stat-value">{s.value}</div>
              <div className="hud-stat-bar-track">
                <div
                  className="hud-stat-bar-fill"
                  style={{ width: `${Math.min(parseInt(s.stat, 10) || 85, 100)}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        <div className="hud-telemetry-meta">
          <div className="meta-row">
            <span>LAB 07 GENEVA</span>
            <span className="cyan-text">PROTOTYPE #01</span>
          </div>
          <div className="meta-row">
            <span>NEURAL SYNC</span>
            <span ref={progressBadgeRef} className="cyan-text">000%</span>
          </div>
        </div>
      </aside>

      {/* ========================================================
          CINEMATIC SCROLL TIMELINE CONTENT (6 SCENES)
          ======================================================== */}
      <main id="scroll-root" className="scroll-timeline">
        {/* HERO TITLE SEQUENCE */}
        <section className="timeline-scene hero-scene" id="scene-hero">
          <div className="scene-content hero-content">
            <div className="hero-eyebrow-tag">
              <span className="glow-bullet" />
              <span>SYSTEM ONLINE // 2035 — AUTONOMOUS REVEAL</span>
            </div>

            <h1 className="hero-headline">
              <span className="headline-nexus">NEXUS</span>
              <span className="headline-hyperdrive">HYPERDRIVE</span>
            </h1>

            <p className="hero-subtext">
              THE MACHINE<br />BEYOND TOMORROW.
            </p>

            <div className="hero-cta-container">
              <button
                className="cta-primary-large"
                onClick={() => handleJumpToScene(0.18)}
              >
                <span>ENTER THE MACHINE</span>
                <span className="btn-icon">→</span>
              </button>
              <div className="scroll-indicator-wrap">
                <div className="mouse-wheel-icon">
                  <div className="mouse-wheel-dot" />
                </div>
                <span className="scroll-indicator-text">SCROLL TO COMMENCE TIMELINE</span>
              </div>
            </div>
          </div>
        </section>

        {/* SCENE 01 — AWAKEN */}
        <section className="timeline-scene" id="scene-awaken">
          <div className="scene-content">
            <div className="scene-kicker">
              <span className="kicker-num">01</span>
              <span className="kicker-title">AWAKEN</span>
            </div>
            <h2 className="scene-heading">Photonic Laser<br />Ignition.</h2>
            <p className="scene-paragraph">
              Extreme-macro laser blades awaken from silence with an instantaneous 0.04-second rise.
              Dynamic matrix emitters map atmospheric geometry before motion begins.
            </p>
            <div className="scene-metric-strip">
              <div className="strip-item">
                <span className="strip-label">BEAM PRECISION</span>
                <span className="strip-value">0.18 CD/M²</span>
              </div>
              <div className="strip-item">
                <span className="strip-label">REFRACTIVE INDEX</span>
                <span className="strip-value">1.492 CRYSTAL</span>
              </div>
            </div>
          </div>
        </section>

        {/* SCENE 02 — FORM */}
        <section className="timeline-scene" id="scene-form">
          <div className="scene-content">
            <div className="scene-kicker">
              <span className="kicker-num">02</span>
              <span className="kicker-title">FORM</span>
            </div>
            <h2 className="scene-heading">Sculpted By<br />Pure Velocity.</h2>
            <p className="scene-paragraph">
              0.55 meters tall, 4.68 meters long. A carbon monocoque shell engineered around an active glass
              cockpit canopy. Stance engineered for extreme ground-effect adhesion.
            </p>
            <ul className="scene-feature-bullets">
              <li>Active front multi-stage carbon splitter</li>
              <li>22″ directional carbon-fibre turbine wheels</li>
              <li>Integrated structural roll cage and neural cockpit</li>
            </ul>
          </div>
        </section>

        {/* SCENE 03 — AERODYNAMICS */}
        <section className="timeline-scene" id="scene-aero">
          <div className="scene-content">
            <div className="scene-kicker">
              <span className="kicker-num">03</span>
              <span className="kicker-title">AERODYNAMICS</span>
            </div>
            <h2 className="scene-heading">Laminar Wind<br />Architecture.</h2>
            <p className="scene-paragraph">
              Underbody venturi tunnels generate 1,420 kg of downforce without drag penalty.
              The active rear wing continuously alters pitch in response to real-time yaw forces.
            </p>
            <div className="scene-inline-action">
              <button
                className="inline-spec-trigger"
                onClick={() => handleOpenSpec(SPECIFICATIONS[0])}
              >
                <span>INSPECT ACTIVE AERO MATRIX</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* SCENE 04 — POWER */}
        <section className="timeline-scene" id="scene-power">
          <div className="scene-content">
            <div className="scene-kicker">
              <span className="kicker-num">04</span>
              <span className="kicker-title">POWER</span>
            </div>
            <h2 className="scene-heading">1.6 MW Solid-State<br />Quantum Core.</h2>
            <p className="scene-paragraph">
              Dual concentric electromagnetic flux rings channel 2,175 peak horsepower across quad
              axial-flux wheel motors. Instantaneous 1,240 Nm torque vectors each wheel in sub-milliseconds.
            </p>
            <div className="specs-card-grid">
              {SPECIFICATIONS.slice(2, 5).map((s) => (
                <button
                  key={s.key}
                  className="spec-grid-button"
                  onClick={() => handleOpenSpec(s)}
                >
                  <span className="grid-button-label">{s.label}</span>
                  <span className="grid-button-val">{s.value}</span>
                  <span className="grid-button-inspect">VIEW DIAGNOSTIC →</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SCENE 05 — INTELLIGENCE */}
        <section className="timeline-scene" id="scene-intelligence">
          <div className="scene-content">
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
              <span className="neural-preview-label">AUTONOMOUS NEURAL FABRIC: ACTIVE</span>
            </div>
          </div>
        </section>

        {/* SCENE 06 — ASCENSION */}
        <section className="timeline-scene hero-ascension-scene" id="scene-ascension">
          <div className="scene-content final-hero-content">
            <div className="scene-kicker centered">
              <span className="kicker-num">06</span>
              <span className="kicker-title">ASCENSION</span>
            </div>
            <h2 className="final-hero-title">
              NEXUS // HYPERDRIVE<br />
              <span className="cyan-gradient-text">THE FUTURE HAS ARRIVED.</span>
            </h2>
            <p className="final-hero-subtext">
              Engineered beyond tomorrow. The definitive fusion of autonomous artificial intelligence,
              laminar aerodynamic architecture, and solid-state quantum propulsion.
            </p>

            <div className="ascension-cta-box">
              <button
                className="cta-primary-large"
                onClick={() => handleJumpToScene(0)}
              >
                <span>REPLAY REVEAL TIMELINE</span>
                <span className="btn-icon">↺</span>
              </button>
              <span className="limited-run-tag">LIMITED TO 77 BESPOKE UNITS // LAB 07 GENEVA</span>
            </div>

            <footer className="experience-footer">
              <span>© 2035 NEXUS AUTOMOTIVE RESEARCH &amp; DYNAMICS</span>
              <span>NEURAL PROTOCOL VERIFIED // ALL SYSTEMS NOMINAL</span>
            </footer>
          </div>
        </section>
      </main>

      {/* Center Cinematic Reticle */}
      <div className="center-reticle" aria-hidden="true">
        <span className="reticle-h" />
        <span className="reticle-v" />
        <div className="reticle-ring" />
      </div>

      {/* Global Scroll Progress Bar at Bottom */}
      <div className="timeline-progress-track" aria-hidden="true">
        <div ref={progressLineRef} className="timeline-progress-bar" />
      </div>

      {/* Interactive Holographic Specification Dialog */}
      <SpecHoloModal
        spec={activeSpec}
        onClose={handleCloseSpec}
        onFocusComponent={(k) => {
          scrollStore.setFocus(k)
        }}
      />
    </div>
  )
}
