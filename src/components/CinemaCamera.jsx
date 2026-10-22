import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollStore } from '../lib/scrollStore'

// 6-Scene Cinematic Camera Director
// Professional automotive framing with deliberate negative space for editorial typography

export default function CinemaCamera() {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const currentCamPos = useRef(new THREE.Vector3(2.5, 0.75, 3.2))
  const currentLookAt = useRef(new THREE.Vector3(0.0, 0.35, 0.1))

  // Mouse parallax tracker
  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // 6-Scene Timeline Keyframes: [pos, target, fov]
  // Framed so the car is prominent, elegant, and positioned with generous negative space
  const timelineKeyframes = useMemo(
    () => [
      // SCENE 01 — HERO / AWAKEN (0.00 - 0.16)
      // Elevated front 3/4 hero angle, giving full view of car stance and front laser blades
      {
        p: 0.0,
        cam: [2.7, 1.15, 4.0],
        tgt: [0.0, 0.65, 0.1],
        fov: 32,
      },
      {
        p: 0.15,
        cam: [2.8, 0.92, 2.8],
        tgt: [0.1, 0.48, 0.15],
        fov: 33,
      },

      // SCENE 02 — DESIGN & SCULPTED FORM (0.16 - 0.38)
      // Car placed in right half of screen, leaving left half open for the floating glass card
      {
        p: 0.24,
        cam: [3.2, 0.75, 1.4],
        tgt: [-0.4, 0.35, 0.1],
        fov: 36,
      },
      {
        p: 0.36,
        cam: [3.4, 0.85, -0.2],
        tgt: [-0.3, 0.38, -0.1],
        fov: 36,
      },

      // SCENE 03 — AERODYNAMICS & LAMINAR FLOW (0.38 - 0.58)
      // Car placed in left half of screen, leaving right half open for the floating glass card
      {
        p: 0.46,
        cam: [3.2, 0.95, -1.5],
        tgt: [0.4, 0.4, -0.3],
        fov: 37,
      },
      {
        p: 0.56,
        cam: [2.2, 0.8, -2.6],
        tgt: [0.3, 0.36, -0.6],
        fov: 36,
      },

      // SCENE 04 — QUANTUM POWER CORE (0.58 - 0.76)
      // Low rear 3/4 framing the illuminated underbody quantum core and ruby lightbar
      {
        p: 0.64,
        cam: [1.8, 0.48, -2.8],
        tgt: [-0.3, 0.3, -0.4],
        fov: 35,
      },
      {
        p: 0.74,
        cam: [-1.8, 0.65, -2.6],
        tgt: [-0.2, 0.32, -0.4],
        fov: 36,
      },

      // SCENE 05 — NEURAL AI ARCHITECTURE (0.76 - 0.90)
      // Elevated dramatic diagonal overview displaying full distributed AI sensor nodes
      {
        p: 0.80,
        cam: [-2.8, 1.3, -0.6],
        tgt: [0.3, 0.36, 0.0],
        fov: 38,
      },
      {
        p: 0.88,
        cam: [-2.4, 1.15, 1.6],
        tgt: [0.3, 0.35, 0.1],
        fov: 37,
      },

      // SCENE 06 — INTERACTIVE SHOWCASE / ASCENSION (0.90 - 1.00)
      // Monumental cinematic perspective centered above configurator controls
      {
        p: 0.95,
        cam: [0.0, 1.1, 4.4],
        tgt: [0.0, 0.45, 0.0],
        fov: 35,
      },
      {
        p: 1.0,
        cam: [0.0, 1.1, 4.4],
        tgt: [0.0, 0.45, 0.0],
        fov: 35,
      },
    ],
    []
  )

  // Camera viewpoints for component inspection and showcase presets
  const viewpoints = useMemo(
    () => ({
      // Interactive Spec Hotspots
      aero: { cam: [1.6, 0.52, 2.4], tgt: [0.0, 0.28, 1.5], fov: 32 },
      drag: { cam: [3.0, 0.55, 0.4], tgt: [0.0, 0.32, 0.0], fov: 35 },
      power: { cam: [1.6, 0.42, -1.6], tgt: [0.0, 0.26, -0.2], fov: 32 },
      battery: { cam: [2.0, 0.45, 0.6], tgt: [0.0, 0.22, 0.2], fov: 32 },
      torque: { cam: [1.8, 0.42, -2.0], tgt: [0.2, 0.24, -1.2], fov: 32 },
      range: { cam: [1.8, 0.9, 1.2], tgt: [0.0, 0.36, 0.2], fov: 35 },
      intelligence: { cam: [-1.6, 1.1, 1.0], tgt: [0.0, 0.38, 0.1], fov: 36 },

      // Showcase Presets
      front: { cam: [0.0, 0.6, 3.6], tgt: [0.0, 0.34, 0.2], fov: 34 },
      profile: { cam: [3.6, 0.55, 0.0], tgt: [0.0, 0.34, 0.0], fov: 36 },
      rear: { cam: [0.0, 0.7, -3.6], tgt: [0.0, 0.36, -0.2], fov: 34 },
      wing: { cam: [1.4, 0.9, -2.2], tgt: [0.0, 0.54, -1.5], fov: 30 },
      core: { cam: [1.5, 0.38, -0.9], tgt: [0.0, 0.25, -0.1], fov: 30 },
      top: { cam: [0.0, 4.4, 0.1], tgt: [0.0, 0.2, 0.0], fov: 35 },
    }),
    []
  )

  // Smoothstep interpolation helper
  const evaluateTimeline = (p) => {
    const kfs = timelineKeyframes
    let k0 = kfs[0]
    let k1 = kfs[kfs.length - 1]

    for (let i = 0; i < kfs.length - 1; i++) {
      if (p >= kfs[i].p && p <= kfs[i + 1].p) {
        k0 = kfs[i]
        k1 = kfs[i + 1]
        break
      }
    }

    const span = Math.max(k1.p - k0.p, 0.0001)
    const normalized = THREE.MathUtils.clamp((p - k0.p) / span, 0, 1)
    // Cubic smoothstep easing
    const ease = normalized * normalized * (3 - 2 * normalized)

    return {
      cam: [
        THREE.MathUtils.lerp(k0.cam[0], k1.cam[0], ease),
        THREE.MathUtils.lerp(k0.cam[1], k1.cam[1], ease),
        THREE.MathUtils.lerp(k0.cam[2], k1.cam[2], ease),
      ],
      tgt: [
        THREE.MathUtils.lerp(k0.tgt[0], k1.tgt[0], ease),
        THREE.MathUtils.lerp(k0.tgt[1], k1.tgt[1], ease),
        THREE.MathUtils.lerp(k0.tgt[2], k1.tgt[2], ease),
      ],
      fov: THREE.MathUtils.lerp(k0.fov, k1.fov, ease),
    }
  }

  useFrame((state, delta) => {
    // Read the single-source updated frame state directly
    const data = scrollStore.getState()

    const { cam: baseCam, tgt: baseTgt, fov: baseFov } = evaluateTimeline(data.progress)

    let finalCam = [...baseCam]
    let finalTgt = [...baseTgt]
    let finalFov = baseFov

    // Blend into targeted viewpoint (focus hotspot or camera preset)
    const targetKey = data.focusedKey || data.cameraPreset
    if (targetKey && viewpoints[targetKey]) {
      const target = viewpoints[targetKey]
      const weight = THREE.MathUtils.clamp(data.focusProgress, 0, 1)

      finalCam[0] = THREE.MathUtils.lerp(finalCam[0], target.cam[0], weight)
      finalCam[1] = THREE.MathUtils.lerp(finalCam[1], target.cam[1], weight)
      finalCam[2] = THREE.MathUtils.lerp(finalCam[2], target.cam[2], weight)

      finalTgt[0] = THREE.MathUtils.lerp(finalTgt[0], target.tgt[0], weight)
      finalTgt[1] = THREE.MathUtils.lerp(finalTgt[1], target.tgt[1], weight)
      finalTgt[2] = THREE.MathUtils.lerp(finalTgt[2], target.tgt[2], weight)

      finalFov = THREE.MathUtils.lerp(finalFov, target.fov, weight)
    }

    // Parallax & Subtle sway
    let parallaxX = 0
    let parallaxY = 0
    let breathX = 0
    let breathY = 0

    if (!data.reducedMotion) {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05
      parallaxX = mouseRef.current.x * 0.06
      parallaxY = mouseRef.current.y * 0.04

      const t = state.clock.elapsedTime
      breathX = Math.sin(t * 0.6) * 0.004
      breathY = Math.cos(t * 0.8) * 0.003
    }

    const targetCamVec = new THREE.Vector3(
      finalCam[0] + parallaxX + breathX,
      finalCam[1] + parallaxY + breathY,
      finalCam[2]
    )
    const targetLookVec = new THREE.Vector3(finalTgt[0], finalTgt[1], finalTgt[2])

    // Frame-rate independent exponential damping: factor = 1 - Math.exp(-decay * delta)
    const clampedDelta = Math.min(Math.max(delta, 0.001), 0.1)
    const damp = 1 - Math.exp(-9 * clampedDelta)

    if (!Number.isNaN(targetCamVec.x) && !Number.isNaN(targetCamVec.y) && !Number.isNaN(targetCamVec.z)) {
      currentCamPos.current.lerp(targetCamVec, damp)
      camera.position.copy(currentCamPos.current)
    }

    if (!Number.isNaN(targetLookVec.x) && !Number.isNaN(targetLookVec.y) && !Number.isNaN(targetLookVec.z)) {
      currentLookAt.current.lerp(targetLookVec, damp)
      camera.lookAt(currentLookAt.current)
    }

    if (!Number.isNaN(finalFov)) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, finalFov, damp)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
