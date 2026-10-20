import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// 6-Scene Cinematic Camera Director
// Controls camera position, lookAt target, FOV, and velocity shake across scroll timeline

export default function CinemaCamera({ scrollStoreRef, focusedKey }) {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const currentCamPos = useRef(new THREE.Vector3(0.52, 0.28, 1.25))
  const currentLookAt = useRef(new THREE.Vector3(0.25, 0.22, 1.85))

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
  const timelineKeyframes = useMemo(
    () => [
      // SCENE 01 — AWAKEN (0.00 - 0.16)
      // Macro close-up on front laser headlight lens
      {
        p: 0.0,
        cam: [0.58, 0.26, 2.38],
        tgt: [0.65, 0.22, 2.05],
        fov: 30,
      },
      {
        p: 0.14,
        cam: [0.85, 0.32, 2.65],
        tgt: [0.45, 0.22, 1.75],
        fov: 34,
      },

      // SCENE 02 — FORM (0.16 - 0.35)
      // Sweeping orbit across front 3/4, front wheel, hood curvature, and cockpit
      {
        p: 0.22,
        cam: [1.65, 0.42, 2.15],
        tgt: [0.25, 0.20, 0.45],
        fov: 38,
      },
      {
        p: 0.32,
        cam: [2.35, 0.55, 1.15],
        tgt: [0.0, 0.22, 0.15],
        fov: 42,
      },

      // SCENE 03 — AERODYNAMICS (0.35 - 0.52)
      // Side profile tracking active splitter and rear morphing wing
      {
        p: 0.42,
        cam: [2.45, 0.62, -0.45],
        tgt: [0.0, 0.25, -0.15],
        fov: 46,
      },
      {
        p: 0.50,
        cam: [1.95, 0.72, -1.55],
        tgt: [-0.15, 0.28, -0.65],
        fov: 48,
      },

      // SCENE 04 — POWER (0.52 - 0.70)
      // Low angle looking toward central underbody quantum energy core and rear diffuser
      {
        p: 0.58,
        cam: [1.25, 0.42, -1.95],
        tgt: [0.0, 0.22, -0.25],
        fov: 44,
      },
      {
        p: 0.68,
        cam: [-0.75, 0.48, -2.45],
        tgt: [0.0, 0.24, -0.85],
        fov: 46,
      },

      // SCENE 05 — INTELLIGENCE (0.70 - 0.86)
      // Elevated dynamic 3/4 orbit revealing entire neural network mesh
      {
        p: 0.76,
        cam: [-1.95, 0.88, -1.15],
        tgt: [0.0, 0.26, 0.0],
        fov: 48,
      },
      {
        p: 0.84,
        cam: [-1.65, 0.95, 1.35],
        tgt: [0.0, 0.24, 0.15],
        fov: 46,
      },

      // SCENE 06 — ASCENSION (0.86 - 1.00)
      // Monumental hero composition pulling back to wide cinematic silhouette
      {
        p: 0.94,
        cam: [-0.55, 0.92, 3.45],
        tgt: [0.0, 0.24, 0.0],
        fov: 40,
      },
      {
        p: 1.0,
        cam: [0.0, 0.82, 3.85],
        tgt: [0.0, 0.22, 0.0],
        fov: 38,
      },
    ],
    []
  )

  // Interactive component inspection focus viewpoints
  const focusTargets = useMemo(
    () => ({
      aero: { cam: [1.15, 0.35, 2.25], tgt: [0.45, 0.18, 1.85], fov: 32 },
      drag: { cam: [2.15, 0.48, 0.35], tgt: [0.0, 0.22, 0.15], fov: 36 },
      power: { cam: [0.85, 0.38, -0.95], tgt: [0.0, 0.22, -0.15], fov: 34 },
      battery: { cam: [1.45, 0.32, 0.65], tgt: [0.15, 0.18, 0.25], fov: 34 },
      torque: { cam: [1.25, 0.35, -1.65], tgt: [0.45, 0.18, -1.25], fov: 32 },
      range: { cam: [1.35, 0.65, 1.15], tgt: [0.0, 0.35, 0.25], fov: 36 },
      intelligence: { cam: [0.95, 0.85, 0.85], tgt: [0.0, 0.35, 0.2], fov: 40 },
    }),
    []
  )

  // Interpolation helper with cubic smoothstep easing
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
    // Cubic smoothstep easing for cinema-grade motion
    const ease = normalized * normalized * (3 - 2 * normalized)

    const cam = [
      THREE.MathUtils.lerp(k0.cam[0], k1.cam[0], ease),
      THREE.MathUtils.lerp(k0.cam[1], k1.cam[1], ease),
      THREE.MathUtils.lerp(k0.cam[2], k1.cam[2], ease),
    ]

    const tgt = [
      THREE.MathUtils.lerp(k0.tgt[0], k1.tgt[0], ease),
      THREE.MathUtils.lerp(k0.tgt[1], k1.tgt[1], ease),
      THREE.MathUtils.lerp(k0.tgt[2], k1.tgt[2], ease),
    ]

    const fov = THREE.MathUtils.lerp(k0.fov, k1.fov, ease)

    return { cam, tgt, fov }
  }

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const data = scrollStoreRef.current?.update(delta) || {
      progress: 0,
      velocity: 0,
      focusedKey: null,
      focusProgress: 0,
    }

    const { cam: baseCam, tgt: baseTgt, fov: baseFov } = evaluateTimeline(data.progress)

    // Blend into focused component target if user clicked a specification
    let finalCam = [...baseCam]
    let finalTgt = [...baseTgt]
    let finalFov = baseFov

    const fKey = data.focusedKey
    if (fKey && focusTargets[fKey]) {
      const fTarget = focusTargets[fKey]
      const fWeight = THREE.MathUtils.clamp(data.focusProgress, 0, 1)
      finalCam[0] = THREE.MathUtils.lerp(finalCam[0], fTarget.cam[0], fWeight)
      finalCam[1] = THREE.MathUtils.lerp(finalCam[1], fTarget.cam[1], fWeight)
      finalCam[2] = THREE.MathUtils.lerp(finalCam[2], fTarget.cam[2], fWeight)

      finalTgt[0] = THREE.MathUtils.lerp(finalTgt[0], fTarget.tgt[0], fWeight)
      finalTgt[1] = THREE.MathUtils.lerp(finalTgt[1], fTarget.tgt[1], fWeight)
      finalTgt[2] = THREE.MathUtils.lerp(finalTgt[2], fTarget.tgt[2], fWeight)

      finalFov = THREE.MathUtils.lerp(finalFov, fTarget.fov, fWeight)
    }

    // Smooth mouse parallax
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05
    const parallaxX = mouseRef.current.x * 0.08
    const parallaxY = mouseRef.current.y * 0.05

    // Velocity-proportional cinematic camera shake
    const shakeIntensity = THREE.MathUtils.clamp(data.velocity * 0.012, 0, 0.04)
    const shakeX = Math.sin(t * 22) * shakeIntensity
    const shakeY = Math.cos(t * 28) * shakeIntensity

    // Subtle gentle camera breathing (handheld studio feel)
    const breathX = Math.sin(t * 0.7) * 0.005
    const breathY = Math.cos(t * 0.9) * 0.004

    // Target vectors
    const targetCamVec = new THREE.Vector3(
      finalCam[0] + parallaxX + shakeX + breathX,
      finalCam[1] + parallaxY + shakeY + breathY,
      finalCam[2]
    )
    const targetLookVec = new THREE.Vector3(finalTgt[0], finalTgt[1], finalTgt[2])

    // Failsafe validation against NaN
    if (!Number.isNaN(targetCamVec.x) && !Number.isNaN(targetCamVec.y) && !Number.isNaN(targetCamVec.z)) {
      currentCamPos.current.lerp(targetCamVec, 0.08)
      camera.position.copy(currentCamPos.current)
    }

    if (!Number.isNaN(targetLookVec.x) && !Number.isNaN(targetLookVec.y) && !Number.isNaN(targetLookVec.z)) {
      currentLookAt.current.lerp(targetLookVec, 0.08)
      camera.lookAt(currentLookAt.current)
    }

    if (!Number.isNaN(finalFov)) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, finalFov, 0.06)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
