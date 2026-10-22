import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { scrollStore } from '../lib/scrollStore'

// Preload the local production automotive asset with local Draco decoders
useGLTF.preload('/models/car.glb', '/draco/')

// Component positions for interactive inspection reticle
const COMPONENT_COORDINATES = {
  aero: [0, 0.32, 1.85],
  drag: [1.1, 0.35, 0],
  power: [0, 0.25, -0.2],
  battery: [0, 0.18, 0.3],
  torque: [0, 0.25, -1.2],
  range: [0, 0.55, 0.1],
  intelligence: [0, 0.62, 0.0],
}

// -------------------------------------------------------------
// Realistic Automotive Asset with Bespoke Materials & Cyber Mods
// -------------------------------------------------------------
function RealisticHypercarMesh({ materials, onWheelRefsReady }) {
  const { scene } = useGLTF('/models/car.glb', '/draco/')
  const clonedScene = useMemo(() => scene.clone(true), [scene])
  const wheelRefs = useRef([])

  useEffect(() => {
    const wheels = []
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        const name = child.name.toLowerCase()
        if (name === 'chrome') {
          // Conceal legacy emblem to maintain pure concept branding
          child.visible = false
        } else if (name.includes('centre') || name.includes('center')) {
          // Sleek carbon fiber wheel center caps
          child.material = materials.carbon
        } else if (name.includes('yellow')) {
          child.material = materials.cyanTrim
        } else if (name.includes('body')) {
          child.material = materials.bodyPaint
        } else if (name.includes('rim')) {
          child.material = materials.rim
        } else if (name.includes('tire')) {
          child.material = materials.tire
        } else if (name.includes('glass')) {
          child.material = materials.glass
        } else if (name.includes('carbon') || name.includes('grill') || name.includes('plastic')) {
          child.material = materials.carbon
        } else if (name.includes('lights_red')) {
          child.material = materials.tailLight
        } else if (name.includes('light') || name.includes('led')) {
          child.material = materials.headlight
        } else if (name.includes('brake')) {
          child.material = materials.caliper
        } else if (name.includes('metal')) {
          child.material = materials.chrome
        } else if (name.includes('interior') || name.includes('leather') || name.includes('carpet')) {
          child.material = materials.interior
        }
      }

      // Track wheel objects for dynamic rotation
      if (child.name && child.name.startsWith('wheel_')) {
        wheels.push(child)
      }
    })

    wheelRefs.current = wheels
    if (onWheelRefsReady) onWheelRefsReady(wheels)
  }, [clonedScene, materials, onWheelRefsReady])

  // Rotate 180 degrees so the front (+Z) faces our cinematic camera keyframes
  return (
    <primitive
      object={clonedScene}
      rotation={[0, Math.PI, 0]}
      position={[0, 0, 0]}
    />
  )
}

// -------------------------------------------------------------
// Graceful Procedural Sculpted Fallback Vehicle
// -------------------------------------------------------------
function FallbackHypercarMesh({ materials }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Sleek aerodynamic carbon chassis base */}
      <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[2.0, 0.24, 4.4]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>
      {/* Tapered nose */}
      <mesh castShadow position={[0, 0.2, 1.9]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.75, 0.16, 0.8]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>
      {/* Curved glass canopy */}
      <mesh position={[0, 0.48, 0.1]}>
        <boxGeometry args={[1.0, 0.28, 1.6]} />
        <primitive object={materials.glass} attach="material" />
      </mesh>
      {/* 4 Wheels */}
      {[-0.95, 0.95].map((x, xi) =>
        [-1.25, 1.25].map((z, zi) => (
          <group key={`${xi}-${zi}`} position={[x, 0.32, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.28, 24]} />
              <primitive object={materials.tire} attach="material" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.24, 0.24, 0.285, 20]} />
              <primitive object={materials.rim} attach="material" />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}

function createHypercarMaterials() {
  const bodyPaint = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0c131a'),
    metalness: 0.94,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 1.0,
    envMapIntensity: 2.2,
  })

  const rim = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#cbd7e2'),
    metalness: 0.95,
    roughness: 0.18,
    envMapIntensity: 1.8,
  })

  const tire = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#08090b'),
    roughness: 0.92,
    metalness: 0.05,
  })

  const glass = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#061018'),
    metalness: 0.1,
    roughness: 0.04,
    transmission: 0.72,
    thickness: 0.45,
    transparent: true,
    opacity: 0.9,
    envMapIntensity: 2.5,
  })

  const carbon = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#07090c'),
    roughness: 0.52,
    metalness: 0.42,
  })

  const headlight = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    emissive: new THREE.Color('#00e5ff'),
    emissiveIntensity: 0.2,
    toneMapped: false,
  })

  const tailLight = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ff1a53'),
    emissive: new THREE.Color('#ff1a53'),
    emissiveIntensity: 2.2,
    toneMapped: false,
  })

  const caliper = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00e5ff'),
    emissive: new THREE.Color('#00e5ff'),
    emissiveIntensity: 0.35,
    metalness: 0.85,
    roughness: 0.25,
    toneMapped: false,
  })

  const chrome = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#222933'),
    metalness: 0.92,
    roughness: 0.22,
    envMapIntensity: 2.0,
  })

  const interior = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0b0e13'),
    roughness: 0.85,
    metalness: 0.1,
  })

  const cyanTrim = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00e5ff'),
    emissive: new THREE.Color('#00e5ff'),
    emissiveIntensity: 1.5,
    toneMapped: false,
  })

  const quantumPlasma = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00e5ff'),
    emissive: new THREE.Color('#00e5ff'),
    emissiveIntensity: 2.2,
    toneMapped: false,
  })

  return {
    bodyPaint,
    rim,
    tire,
    glass,
    carbon,
    headlight,
    tailLight,
    caliper,
    chrome,
    interior,
    cyanTrim,
    quantumPlasma,
  }
}

// -------------------------------------------------------------
// Master Procedural Hypercar (Hybrid Realistic + Cyber Dynamics)
// -------------------------------------------------------------
export default function ProceduralHypercar() {
  const rootGroup = useRef()
  const activeWingRef = useRef()
  const frontSplitterEdgeRef = useRef()
  const coreMeshRef = useRef()
  const coreRing1Ref = useRef()
  const coreRing2Ref = useRef()
  const airflowGroupRef = useRef()
  const neuralGroupRef = useRef()
  const focusHighlightRef = useRef()
  const wheelsRef = useRef([])

  const [hasModelError] = useState(false)
  const materials = useMemo(() => createHypercarMaterials(), [])

  // Animation frame loop: lighting wake-up, wing articulation, core pulse, wheels rotation
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const data = scrollStore.getState()
    const p = data.progress
    const clampedDelta = Math.min(Math.max(delta, 0.001), 0.1)

    // Sync active paint color
    if (data.activeColor) {
      materials.bodyPaint.color.set(data.activeColor.hex)
      materials.bodyPaint.metalness = data.activeColor.metalness
      materials.bodyPaint.roughness = data.activeColor.roughness
      materials.bodyPaint.clearcoat = data.activeColor.clearcoat
    }

    // SCENE 01: Headlight wake-up sequence
    const bootStage = THREE.MathUtils.clamp((p - 0.01) * 6.5, 0, 1)
    const flicker = p < 0.15 ? Math.sin(t * 16) * 0.1 * (1 - bootStage) : 0
    const headIntensity = bootStage * 4.2 + flicker + Math.sin(t * 3.5) * 0.12
    materials.headlight.emissiveIntensity = Math.max(headIntensity, 0.2)

    // Tail light pulsing
    materials.tailLight.emissiveIntensity = 1.8 + Math.sin(t * 2.8) * 0.2 + (p > 0.5 ? 0.8 : 0)

    // SCENE 04: Quantum Power Core Plasma Pulse
    const powerZone = p > 0.48 && p < 0.78 ? 1.0 : 0.6
    const corePulse = (1.6 + Math.sin(t * 3.5) * 0.4 + Math.sin(t * 8.0) * 0.15) * powerZone
    materials.quantumPlasma.emissiveIntensity = corePulse

    if (coreMeshRef.current) {
      coreMeshRef.current.scale.setScalar(1 + Math.sin(t * 3.2) * 0.04)
    }
    if (coreRing1Ref.current) {
      coreRing1Ref.current.rotation.z = t * 1.4
      coreRing1Ref.current.rotation.x = Math.sin(t * 0.7) * 0.18
    }
    if (coreRing2Ref.current) {
      coreRing2Ref.current.rotation.z = -t * 1.8
      coreRing2Ref.current.rotation.y = Math.cos(t * 0.8) * 0.22
    }

    // Active Aerodynamic Rear Wing Deployment & Tilt
    if (activeWingRef.current) {
      // Articulates angle of attack with velocity and timeline progress
      const baseAngle = THREE.MathUtils.lerp(0.02, 0.24, THREE.MathUtils.clamp((p - 0.32) * 2.6, 0, 1))
      const dynamicTilt = baseAngle + data.velocity * 0.07 + Math.sin(t * 1.2) * 0.008
      activeWingRef.current.rotation.x = dynamicTilt
      activeWingRef.current.position.y = 0.82 + THREE.MathUtils.clamp((p - 0.32) * 0.08, 0, 0.06)
    }

    // Wheel rotation based on velocity + idle glide
    const spinIncrement = (data.velocity * 32 + (data.reducedMotion ? 0 : 0.45)) * clampedDelta
    if (wheelsRef.current && wheelsRef.current.length > 0) {
      wheelsRef.current.forEach((w) => {
        if (w) w.rotation.x += spinIncrement
      })
    }

    // SCENE 03: Airflow lines visibility
    if (airflowGroupRef.current) {
      const isAeroScene = p > 0.3 && p < 0.6
      airflowGroupRef.current.visible = isAeroScene
      if (isAeroScene) {
        airflowGroupRef.current.children.forEach((mesh, idx) => {
          const speed = 2.0 + idx * 0.3
          const zPos = ((t * speed + idx * 0.8) % 6.0) - 3.0
          mesh.position.z = zPos
          mesh.material.opacity = Math.sin(((zPos + 3.0) / 6.0) * Math.PI) * 0.35
        })
      }
    }

    // SCENE 05: Neural Network Nodes
    if (neuralGroupRef.current) {
      const isNeuralScene = p > 0.68 && p < 0.94
      neuralGroupRef.current.visible = isNeuralScene
      if (isNeuralScene) {
        neuralGroupRef.current.children.forEach((child, i) => {
          if (child.isMesh) {
            child.scale.setScalar(1 + Math.sin(t * 3.8 + i) * 0.12)
          }
        })
      }
    }

    // Component inspection reticle positioning
    if (focusHighlightRef.current) {
      const fKey = data.focusedKey
      if (fKey && COMPONENT_COORDINATES[fKey]) {
        focusHighlightRef.current.visible = true
        const coords = COMPONENT_COORDINATES[fKey]
        focusHighlightRef.current.position.set(coords[0], coords[1], coords[2])
        focusHighlightRef.current.rotation.y = t * 1.8
      } else {
        focusHighlightRef.current.visible = false
      }
    }

    // Subtle chassis idle breathing
    if (rootGroup.current && !data.reducedMotion) {
      rootGroup.current.position.y = Math.sin(t * 0.7) * 0.003
    }
  })

  return (
    <group ref={rootGroup} position={[0, 0, 0]}>
      {/* ========================================================
          1. 3D AUTOMOTIVE VEHICLE (PRODUCTION GLB OR FALLBACK)
          ======================================================== */}
      {!hasModelError ? (
        <Suspense fallback={<FallbackHypercarMesh materials={materials} />}>
          <RealisticHypercarMesh
            materials={materials}
            onWheelRefsReady={(w) => {
              wheelsRef.current = w
            }}
          />
        </Suspense>
      ) : (
        <FallbackHypercarMesh materials={materials} />
      )}

      {/* ========================================================
          2. BESPOKE ACTIVE AERODYNAMIC REAR WING ASSEMBLY
          ======================================================== */}
      <group ref={activeWingRef} position={[0, 0.82, -1.88]}>
        {/* Main curved carbon aerofoil blade */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.86, 0.035, 0.38]} />
          <primitive object={materials.carbon} attach="material" />
        </mesh>
        {/* Twin vertical shape-memory endplates */}
        <mesh position={[-0.94, 0.07, 0]} castShadow>
          <boxGeometry args={[0.025, 0.22, 0.44]} />
          <primitive object={materials.carbon} attach="material" />
        </mesh>
        <mesh position={[0.94, 0.07, 0]} castShadow>
          <boxGeometry args={[0.025, 0.22, 0.44]} />
          <primitive object={materials.carbon} attach="material" />
        </mesh>
        {/* Cyan illuminated edge on endplates */}
        <mesh position={[-0.955, 0.07, 0.2]}>
          <boxGeometry args={[0.008, 0.18, 0.015]} />
          <primitive object={materials.cyanTrim} attach="material" />
        </mesh>
        <mesh position={[0.955, 0.07, 0.2]}>
          <boxGeometry args={[0.008, 0.18, 0.015]} />
          <primitive object={materials.cyanTrim} attach="material" />
        </mesh>
        {/* Dual aerodynamic swan-neck pylons */}
        <mesh position={[-0.42, -0.16, 0.08]} rotation={[-0.22, 0, 0]} castShadow>
          <boxGeometry args={[0.035, 0.32, 0.08]} />
          <primitive object={materials.carbon} attach="material" />
        </mesh>
        <mesh position={[0.42, -0.16, 0.08]} rotation={[-0.22, 0, 0]} castShadow>
          <boxGeometry args={[0.035, 0.32, 0.08]} />
          <primitive object={materials.carbon} attach="material" />
        </mesh>
      </group>

      {/* ========================================================
          3. FRONT ACTIVE CARBON SPLITTER WITH ILLUMINATED CANARDS
          ======================================================== */}
      <group position={[0, 0.1, 2.18]}>
        {/* Low front splitter blade */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.98, 0.025, 0.36]} />
          <primitive object={materials.carbon} attach="material" />
        </mesh>
        {/* Illuminated cyan leading edge */}
        <mesh ref={frontSplitterEdgeRef} position={[0, 0.005, 0.18]}>
          <boxGeometry args={[1.92, 0.01, 0.02]} />
          <primitive object={materials.cyanTrim} attach="material" />
        </mesh>
        {/* Side endplates */}
        <mesh position={[-0.99, 0.05, 0]} castShadow>
          <boxGeometry args={[0.025, 0.12, 0.3]} />
          <primitive object={materials.carbon} attach="material" />
        </mesh>
        <mesh position={[0.99, 0.05, 0]} castShadow>
          <boxGeometry args={[0.025, 0.12, 0.3]} />
          <primitive object={materials.carbon} attach="material" />
        </mesh>
      </group>

      {/* ========================================================
          4. CENTRAL QUANTUM POWER CORE (UNDERBODY REVEAL)
          ======================================================== */}
      <group position={[0, 0.24, -0.18]}>
        {/* Glowing cyan cylindrical plasma reactor */}
        <mesh ref={coreMeshRef}>
          <cylinderGeometry args={[0.22, 0.22, 0.14, 24]} />
          <primitive object={materials.quantumPlasma} attach="material" />
        </mesh>

        {/* Outer electromagnetic rotating rings */}
        <group ref={coreRing1Ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.34, 32]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>
        <group ref={coreRing2Ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.43, 32]} />
            <meshBasicMaterial color="#7c4dff" transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>

        {/* Subtle underbody ground glow */}
        <pointLight position={[0, -0.12, 0]} intensity={2.8} distance={2.5} color="#00e5ff" />
      </group>

      {/* ========================================================
          5. LAMINAR AIRFLOW STREAMLINES (SCENE 03 — AERO)
          ======================================================== */}
      <group ref={airflowGroupRef} position={[0, 0.48, 0]}>
        {[
          { x: -0.65, y: 0.1 },
          { x: -0.32, y: 0.22 },
          { x: 0.0, y: 0.32 },
          { x: 0.32, y: 0.22 },
          { x: 0.65, y: 0.1 },
        ].map((pt, i) => (
          <mesh key={i} position={[pt.x, pt.y, 0]}>
            <boxGeometry args={[0.012, 0.006, 2.4]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#00e5ff' : '#7c4dff'}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          6. DISTRIBUTED NEURAL AI NETWORK SENSOR NODES (SCENE 05)
          ======================================================== */}
      <group ref={neuralGroupRef} position={[0, 0.42, 0]}>
        {[
          [0, 0.24, 1.95],      // Front Lidar / Optical Blade
          [-0.68, 0.15, 1.25],  // Left Steering Node
          [0.68, 0.15, 1.25],   // Right Steering Node
          [0, 0.3, 0.25],       // Central AI Core / Cockpit
          [-0.75, 0.12, -0.1],  // Left Energy Matrix
          [0.75, 0.12, -0.1],   // Right Energy Matrix
          [0, 0.12, -0.18],     // Quantum Flux Stabilizer
          [-0.72, 0.18, -1.25], // Rear Left Axial Flux Motor
          [0.72, 0.18, -1.25],  // Rear Right Axial Flux Motor
          [0, 0.38, -1.85],     // Active Aero Actuator
        ].map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.025, 14, 14]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.85} toneMapped={false} />
          </mesh>
        ))}

        {/* Optical laser neural interconnects */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  0, 0.24, 1.95, -0.68, 0.15, 1.25,
                  0, 0.24, 1.95, 0.68, 0.15, 1.25,
                  -0.68, 0.15, 1.25, 0, 0.3, 0.25,
                  0.68, 0.15, 1.25, 0, 0.3, 0.25,
                  0, 0.3, 0.25, -0.75, 0.12, -0.1,
                  0, 0.3, 0.25, 0.75, 0.12, -0.1,
                  0, 0.3, 0.25, 0, 0.12, -0.18,
                  0, 0.12, -0.18, -0.72, 0.18, -1.25,
                  0, 0.12, -0.18, 0.72, 0.18, -1.25,
                  -0.72, 0.18, -1.25, 0, 0.38, -1.85,
                  0.72, 0.18, -1.25, 0, 0.38, -1.85,
                ]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00e5ff" transparent opacity={0.35} />
        </lineSegments>
      </group>

      {/* ========================================================
          7. INTERACTIVE SPEC COMPONENT FOCUS RETICLE
          ======================================================== */}
      <group ref={focusHighlightRef} visible={false}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.26, 0.29, 32]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.85} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.36, 0.38, 32]} />
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <pointLight intensity={2.5} distance={2.0} color="#00e5ff" />
      </group>
    </group>
  )
}
