import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Procedural Original 2035 Autonomous Electric Hypercar
// Built with layered geometric engineering and premium physical shaders

export default function ProceduralHypercar({ scrollStoreRef, focusedKey }) {
  const root = useRef()
  const headL = useRef()
  const headR = useRef()
  const tailMesh = useRef()
  const wingGroup = useRef()
  const coreMesh = useRef()
  const coreRing1 = useRef()
  const coreRing2 = useRef()
  const wheelFL = useRef()
  const wheelFR = useRef()
  const wheelRL = useRef()
  const wheelRR = useRef()
  const aeroFlapL = useRef()
  const aeroFlapR = useRef()
  const neuralGroup = useRef()
  const airflowGroup = useRef()
  const focusHighlightRef = useRef()

  // High-end automotive materials
  const materials = useMemo(() => {
    // Deep metallic graphite/gunmetal bodywork with glossy clearcoat
    const bodyPaint = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0c131a'),
      metalness: 0.94,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
      envMapIntensity: 1.4,
    })

    // Raw woven carbon fiber
    const carbonFiber = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#080a0d'),
      roughness: 0.55,
      metalness: 0.45,
    })

    // Polarized aerodynamic glass canopy
    const canopyGlass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#061018'),
      metalness: 0.15,
      roughness: 0.05,
      transmission: 0.65,
      thickness: 0.4,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.9,
    })

    // Performance tire rubber
    const tireRubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#08090b'),
      roughness: 0.92,
      metalness: 0.05,
    })

    // Machined forged alloy for wheel spokes
    const forgedAlloy = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c0ccd6'),
      metalness: 0.92,
      roughness: 0.22,
    })

    // Active optics: Headlight laser elements
    const laserOptic = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color('#00e5ff'),
      emissiveIntensity: 0.0,
      toneMapped: false,
    })

    // Rear holographic taillight bar
    const rearLightbar = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff1a53'),
      emissive: new THREE.Color('#ff1a53'),
      emissiveIntensity: 0.8,
      toneMapped: false,
    })

    // Quantum power core plasma
    const quantumPlasma = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00e5ff'),
      emissive: new THREE.Color('#00e5ff'),
      emissiveIntensity: 2.0,
      toneMapped: false,
    })

    // Cyan accent glow strip
    const cyanTrim = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00e5ff'),
      emissive: new THREE.Color('#00e5ff'),
      emissiveIntensity: 1.2,
      toneMapped: false,
    })

    return {
      bodyPaint,
      carbonFiber,
      canopyGlass,
      tireRubber,
      forgedAlloy,
      laserOptic,
      rearLightbar,
      quantumPlasma,
      cyanTrim,
    }
  }, [])

  // Component focus positions for highlight ring
  const componentPositions = useMemo(() => ({
    aero: [0, 0.22, 1.85],
    drag: [0.95, 0.35, 0],
    power: [0, 0.28, -0.15],
    battery: [0, 0.16, 0.4],
    torque: [0, 0.25, -1.2],
    range: [0, 0.45, 0.2],
    intelligence: [0, 0.52, 0.1],
  }), [])

  // Animation Loop: headlamp boot sequence, wheel rotation, active aero, quantum core pulse
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const data = scrollStoreRef.current?.update(0.016) || { progress: 0, velocity: 0, focusedKey: null }
    const p = data.progress

    // SCENE 01: Headlight boot sequence (0.00 to 0.16)
    // Awaken: Headlight powers up from dark to intense laser beam with subtle pulse
    const bootStage = THREE.MathUtils.clamp((p - 0.01) * 7.5, 0, 1)
    const flicker = p < 0.14 ? Math.sin(t * 18) * 0.12 * (1 - bootStage) : 0
    const headIntensity = (bootStage * 4.2 + flicker + Math.sin(t * 4.5) * 0.15)
    materials.laserOptic.emissiveIntensity = Math.max(headIntensity, 0.15)

    // Tail light progressive intensity as car powers up
    const tailIntensity = 0.8 + THREE.MathUtils.clamp(p * 2.2, 0, 1) * 1.5 + Math.sin(t * 3.0) * 0.15
    materials.rearLightbar.emissiveIntensity = tailIntensity

    // SCENE 04: Quantum Energy Core Pulse
    // Intense cyan pulse, internal ring rotations, electromagnetic effects
    const powerZone = p > 0.45 && p < 0.75 ? 1.0 : 0.6
    const corePulse = (1.5 + Math.sin(t * 3.5) * 0.45 + Math.sin(t * 8.2) * 0.18) * powerZone
    materials.quantumPlasma.emissiveIntensity = corePulse

    if (coreMesh.current) {
      coreMesh.current.scale.setScalar(1 + Math.sin(t * 3.5) * 0.05)
    }
    if (coreRing1.current) {
      coreRing1.current.rotation.z = t * 1.2
      coreRing1.current.rotation.x = Math.sin(t * 0.8) * 0.2
    }
    if (coreRing2.current) {
      coreRing2.current.rotation.z = -t * 1.6
      coreRing2.current.rotation.y = Math.cos(t * 0.9) * 0.25
    }

    // Active aerodynamic surfaces (wing & front canards)
    if (wingGroup.current) {
      // Wing deploys and increases angle of attack with velocity and progress
      const targetAngle = THREE.MathUtils.lerp(-0.06, 0.22, THREE.MathUtils.clamp((p - 0.3) * 2.5, 0, 1))
      const dynamicFlap = targetAngle + data.velocity * 0.08 + Math.sin(t * 1.2) * 0.01
      wingGroup.current.rotation.x = dynamicFlap
      wingGroup.current.position.y = 0.52 + THREE.MathUtils.clamp((p - 0.3) * 0.06, 0, 0.05)
    }

    if (aeroFlapL.current && aeroFlapR.current) {
      const flapAngle = Math.sin(t * 1.5) * 0.04 + (p > 0.3 && p < 0.55 ? 0.08 : 0)
      aeroFlapL.current.rotation.y = flapAngle
      aeroFlapR.current.rotation.y = -flapAngle
    }

    // Wheels: rotate naturally with scroll velocity and idle showroom glide
    const wheelSpeed = data.velocity * 35 + (0.4 + p * 0.8)
    const spinIncrement = wheelSpeed * 0.02
    ;[wheelFL, wheelFR, wheelRL, wheelRR].forEach((w) => {
      if (w.current) w.current.rotation.x += spinIncrement
    })

    // SCENE 03: Airflow lines visibility and animation (0.30 to 0.58)
    if (airflowGroup.current) {
      const isAeroScene = p > 0.28 && p < 0.58
      airflowGroup.current.visible = isAeroScene
      if (isAeroScene) {
        airflowGroup.current.children.forEach((mesh, idx) => {
          const speed = 1.8 + idx * 0.25
          const zPos = ((t * speed + idx * 0.7) % 5.5) - 2.8
          mesh.position.z = zPos
          mesh.material.opacity = Math.sin(((zPos + 2.8) / 5.5) * Math.PI) * 0.35
        })
      }
    }

    // SCENE 05: Neural Network Nodes Pulse (0.65 to 0.90)
    if (neuralGroup.current) {
      const isNeuralScene = p > 0.62 && p < 0.92
      neuralGroup.current.visible = isNeuralScene
      if (isNeuralScene) {
        neuralGroup.current.children.forEach((child, i) => {
          if (child.isMesh) {
            child.scale.setScalar(1 + Math.sin(t * 4 + i) * 0.15)
            if (child.material) {
              child.material.opacity = 0.4 + Math.sin(t * 2.8 + i * 1.2) * 0.35
            }
          }
        })
      }
    }

    // Focus highlight reticle for interactive specs
    if (focusHighlightRef.current) {
      const fKey = data.focusedKey
      if (fKey && componentPositions[fKey]) {
        focusHighlightRef.current.visible = true
        const pos = componentPositions[fKey]
        focusHighlightRef.current.position.set(pos[0], pos[1], pos[2])
        focusHighlightRef.current.rotation.y = t * 1.8
        focusHighlightRef.current.scale.setScalar(1 + Math.sin(t * 6) * 0.08)
      } else {
        focusHighlightRef.current.visible = false
      }
    }

    // Subtle chassis breathing on suspension
    if (root.current) {
      root.current.position.y = Math.sin(t * 0.8) * 0.005 + 0.12
    }
  })

  return (
    <group ref={root} position={[0, 0.12, 0]}>
      {/* ========================================================
          1. CHASSIS & MONOCOQUE (EXTREMELY LOW & WIDE STANCE)
          ======================================================== */}
      {/* Lower Tub Base */}
      <mesh castShadow receiveShadow position={[0, 0.16, 0.0]}>
        <boxGeometry args={[1.94, 0.22, 4.2]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>

      {/* Tapered Front Nose */}
      <mesh castShadow position={[0, 0.15, 1.85]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[1.72, 0.14, 0.75]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>

      {/* Aerodynamic Front Splitter (Carbon Fiber Multi-stage) */}
      <group position={[0, 0.06, 2.12]}>
        {/* Main lower blade */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.96, 0.035, 0.48]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        {/* Illuminated Cyan Leading Edge */}
        <mesh position={[0, 0.005, 0.24]}>
          <boxGeometry args={[1.88, 0.012, 0.02]} />
          <primitive object={materials.cyanTrim} attach="material" />
        </mesh>
        {/* Dual Vertical Splitter Endplates */}
        <mesh position={[-0.97, 0.06, 0.05]} castShadow>
          <boxGeometry args={[0.03, 0.12, 0.36]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        <mesh position={[0.97, 0.06, 0.05]} castShadow>
          <boxGeometry args={[0.03, 0.12, 0.36]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        {/* Active Canards / Aero Flaps */}
        <mesh ref={aeroFlapL} position={[-0.82, 0.11, 0.08]}>
          <boxGeometry args={[0.24, 0.015, 0.16]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        <mesh ref={aeroFlapR} position={[0.82, 0.11, 0.08]}>
          <boxGeometry args={[0.24, 0.015, 0.16]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
      </group>

      {/* Sculpted Hood with Air Extractor Vent */}
      <mesh castShadow position={[0, 0.26, 1.15]} rotation={[0.16, 0, 0]}>
        <boxGeometry args={[1.68, 0.06, 1.12]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>
      {/* Hood Vent Recess (Carbon) */}
      <mesh position={[0, 0.28, 1.12]} rotation={[0.16, 0, 0]}>
        <boxGeometry args={[0.76, 0.02, 0.52]} />
        <primitive object={materials.carbonFiber} attach="material" />
      </mesh>

      {/* Flared Front Wheel Arches */}
      <mesh castShadow position={[-0.92, 0.24, 1.25]}>
        <boxGeometry args={[0.24, 0.24, 0.98]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>
      <mesh castShadow position={[0.92, 0.24, 1.25]}>
        <boxGeometry args={[0.24, 0.24, 0.98]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>

      {/* Flared Rear Wheel Arches (Wide Muscular Stance) */}
      <mesh castShadow position={[-0.96, 0.26, -1.25]}>
        <boxGeometry args={[0.26, 0.28, 1.12]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>
      <mesh castShadow position={[0.96, 0.26, -1.25]}>
        <boxGeometry args={[0.26, 0.28, 1.12]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>

      {/* Sculpted Carbon Side Skirts with Venturi Tunnels */}
      <mesh position={[-0.98, 0.08, 0]} castShadow>
        <boxGeometry args={[0.08, 0.05, 2.2]} />
        <primitive object={materials.carbonFiber} attach="material" />
      </mesh>
      <mesh position={[0.98, 0.08, 0]} castShadow>
        <boxGeometry args={[0.08, 0.05, 2.2]} />
        <primitive object={materials.carbonFiber} attach="material" />
      </mesh>
      {/* Side Intake Ducts */}
      <mesh position={[-0.95, 0.20, -0.42]}>
        <boxGeometry args={[0.06, 0.16, 0.65]} />
        <primitive object={materials.carbonFiber} attach="material" />
      </mesh>
      <mesh position={[0.95, 0.20, -0.42]}>
        <boxGeometry args={[0.06, 0.16, 0.65]} />
        <primitive object={materials.carbonFiber} attach="material" />
      </mesh>

      {/* ========================================================
          2. COCKPIT CANOPY & INTERIOR TELEMETRY
          ======================================================== */}
      {/* Aerodynamic Teardrop Glass Canopy */}
      <mesh position={[0, 0.44, 0.22]}>
        <boxGeometry args={[0.96, 0.22, 1.48]} />
        <primitive object={materials.canopyGlass} attach="material" />
      </mesh>
      {/* Carbon Roof Spine & Shark Fin Aerial */}
      <mesh position={[0, 0.54, 0.05]} castShadow>
        <boxGeometry args={[0.16, 0.04, 1.35]} />
        <primitive object={materials.carbonFiber} attach="material" />
      </mesh>
      <mesh position={[0, 0.58, -0.45]} castShadow>
        <boxGeometry args={[0.025, 0.10, 0.65]} />
        <primitive object={materials.carbonFiber} attach="material" />
      </mesh>

      {/* Interior Cockpit Elements (Visible through glass) */}
      <group position={[0, 0.32, 0.35]}>
        {/* Minimalist Dashboard */}
        <mesh position={[0, 0.02, 0.22]}>
          <boxGeometry args={[0.78, 0.04, 0.28]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        {/* Holographic Steering Yoke */}
        <mesh position={[0.22, 0.04, 0.1]}>
          <boxGeometry args={[0.22, 0.08, 0.02]} />
          <primitive object={materials.cyanTrim} attach="material" />
        </mesh>
        {/* Glowing Head-Up Cockpit Display */}
        <mesh position={[0, 0.08, 0.18]}>
          <planeGeometry args={[0.42, 0.1]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.45} toneMapped={false} />
        </mesh>
        {/* Bucket Racing Seats */}
        <mesh position={[-0.22, -0.04, -0.15]}>
          <boxGeometry args={[0.34, 0.28, 0.38]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        <mesh position={[0.22, -0.04, -0.15]}>
          <boxGeometry args={[0.34, 0.28, 0.38]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
      </group>

      {/* ========================================================
          3. LIGHTING SYSTEMS (HEADLIGHTS & REAR CYBER LIGHTBAR)
          ======================================================== */}
      {/* Front Thin LED Laser Headlights (Left & Right) */}
      <group position={[0, 0.22, 2.14]}>
        <mesh ref={headL} position={[-0.68, 0, 0]}>
          <boxGeometry args={[0.46, 0.025, 0.05]} />
          <primitive object={materials.laserOptic} attach="material" />
        </mesh>
        <mesh ref={headR} position={[0.68, 0, 0]}>
          <boxGeometry args={[0.46, 0.025, 0.05]} />
          <primitive object={materials.laserOptic} attach="material" />
        </mesh>

        {/* Headlight Internal Optic Crystals & Projection Glow */}
        <mesh position={[-0.68, 0, 0.035]}>
          <planeGeometry args={[0.56, 0.12]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} toneMapped={false} />
        </mesh>
        <mesh position={[0.68, 0, 0.035]}>
          <planeGeometry args={[0.56, 0.12]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.3} toneMapped={false} />
        </mesh>

        {/* Laser Headlight Forward Light Projection Cone */}
        <pointLight position={[-0.68, 0, 0.3]} intensity={4.5} distance={7} color="#00e5ff" />
        <pointLight position={[0.68, 0, 0.3]} intensity={4.5} distance={7} color="#00e5ff" />
      </group>

      {/* Rear Holographic Lightbar */}
      <group position={[0, 0.25, -2.12]}>
        <mesh ref={tailMesh} position={[0, 0, 0]}>
          <boxGeometry args={[1.82, 0.028, 0.04]} />
          <primitive object={materials.rearLightbar} attach="material" />
        </mesh>
        {/* Diffuse Rear Glow Blade */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.88, 0.1]} />
          <meshBasicMaterial color="#ff1a53" transparent opacity={0.25} toneMapped={false} />
        </mesh>
        <pointLight position={[0, 0, -0.2]} intensity={2.5} distance={4} color="#ff1a53" />
      </group>

      {/* ========================================================
          4. ACTIVE REAR WING & MONUMENTAL DIFFUSER
          ======================================================== */}
      {/* Active Rear Wing Assembly */}
      <group ref={wingGroup} position={[0, 0.52, -1.9]}>
        {/* Main Aerofoil Blade */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.84, 0.032, 0.34]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        {/* Illuminated Wing Endplates */}
        <mesh position={[-0.92, 0.08, 0]} castShadow>
          <boxGeometry args={[0.03, 0.18, 0.42]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        <mesh position={[-0.935, 0.08, 0.2]}>
          <boxGeometry args={[0.01, 0.16, 0.015]} />
          <primitive object={materials.cyanTrim} attach="material" />
        </mesh>
        <mesh position={[0.92, 0.08, 0]} castShadow>
          <boxGeometry args={[0.03, 0.18, 0.42]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        <mesh position={[0.935, 0.08, 0.2]}>
          <boxGeometry args={[0.01, 0.16, 0.015]} />
          <primitive object={materials.cyanTrim} attach="material" />
        </mesh>
        {/* Dual Carbon Stanchions */}
        <mesh position={[-0.45, -0.16, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.28, 0.08]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        <mesh position={[0.45, -0.16, 0.05]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.28, 0.08]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
      </group>

      {/* Enormous Underbody Venturi Rear Diffuser */}
      <group position={[0, 0.08, -2.05]}>
        {/* 6 Aerodynamic Diffuser Fins */}
        {[-0.65, -0.38, -0.12, 0.12, 0.38, 0.65].map((x, i) => (
          <mesh key={i} position={[x, 0.02, 0]} castShadow>
            <boxGeometry args={[0.025, 0.16, 0.65]} />
            <primitive object={materials.carbonFiber} attach="material" />
          </mesh>
        ))}
        {/* Diffuser Tunnel Floor */}
        <mesh position={[0, -0.01, 0]}>
          <boxGeometry args={[1.68, 0.025, 0.62]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>
        {/* Titanium Exhaust Flow Vent */}
        <mesh position={[0, 0.14, -0.05]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
          <primitive object={materials.forgedAlloy} attach="material" />
        </mesh>
      </group>

      {/* ========================================================
          5. GLOWING QUANTUM ENERGY CORE (CHASSIS CENTER)
          ======================================================== */}
      <group position={[0, 0.18, -0.15]}>
        {/* Central Cylindrical Plasma Core */}
        <mesh ref={coreMesh}>
          <cylinderGeometry args={[0.26, 0.26, 0.16, 24]} />
          <primitive object={materials.quantumPlasma} attach="material" />
        </mesh>

        {/* Outer Electromagnetic Conductor Rings */}
        <group ref={coreRing1}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.34, 0.38, 32]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.65} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>
        <group ref={coreRing2}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.44, 0.47, 32]} />
            <meshBasicMaterial color="#7c4dff" transparent opacity={0.45} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>

        {/* Underbody Light Emission */}
        <pointLight position={[0, -0.08, 0]} intensity={3.5} distance={3.5} color="#00e5ff" />
      </group>

      {/* ========================================================
          6. FUTURISTIC 22" DIRECTIONAL AERO TURBINE WHEELS
          ======================================================== */}
      <WheelAssembly
        position={[-0.95, 0.12, 1.25]}
        wheelRef={wheelFL}
        materials={materials}
        isLeft={true}
      />
      <WheelAssembly
        position={[0.95, 0.12, 1.25]}
        wheelRef={wheelFR}
        materials={materials}
        isLeft={false}
      />
      <WheelAssembly
        position={[-0.98, 0.14, -1.25]}
        wheelRef={wheelRL}
        materials={materials}
        isLeft={true}
      />
      <WheelAssembly
        position={[0.98, 0.14, -1.25]}
        wheelRef={wheelRR}
        materials={materials}
        isLeft={false}
      />

      {/* ========================================================
          7. AIRFLOW STREAMLINE VISUALIZATION (SCENE 03)
          ======================================================== */}
      <group ref={airflowGroup} position={[0, 0.34, 0]}>
        {[
          { x: -0.65, y: 0.12 },
          { x: -0.32, y: 0.22 },
          { x: 0.0, y: 0.32 },
          { x: 0.32, y: 0.22 },
          { x: 0.65, y: 0.12 },
        ].map((pt, i) => (
          <mesh key={i} position={[pt.x, pt.y, 0]}>
            <boxGeometry args={[0.015, 0.008, 1.8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#00e5ff' : '#7c4dff'} transparent opacity={0.25} />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          8. NEURAL AI NETWORK VISUALIZATION (SCENE 05)
          ======================================================== */}
      <group ref={neuralGroup} position={[0, 0.42, 0]}>
        {/* Holographic Sensor Nodes */}
        {[
          [0, 0.22, 1.95],      // Front Lidar / Vision
          [-0.65, 0.15, 1.3],   // Left Steering Controller
          [0.65, 0.15, 1.3],    // Right Steering Controller
          [0, 0.25, 0.4],       // Central AI Core / Cockpit
          [-0.72, 0.12, -0.1],  // Left Battery Node
          [0.72, 0.12, -0.1],   // Right Battery Node
          [0, 0.1, -0.15],      // Quantum Flux Stabilizer
          [-0.68, 0.18, -1.25], // Rear Left Motor Inverter
          [0.68, 0.18, -1.25],  // Rear Right Motor Inverter
          [0, 0.24, -1.85],     // Active Aero Actuator
        ].map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.026, 12, 12]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} />
          </mesh>
        ))}
        {/* Interconnected Neural Laser Lines */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  0, 0.22, 1.95, -0.65, 0.15, 1.3,
                  0, 0.22, 1.95, 0.65, 0.15, 1.3,
                  -0.65, 0.15, 1.3, 0, 0.25, 0.4,
                  0.65, 0.15, 1.3, 0, 0.25, 0.4,
                  0, 0.25, 0.4, -0.72, 0.12, -0.1,
                  0, 0.25, 0.4, 0.72, 0.12, -0.1,
                  0, 0.25, 0.4, 0, 0.1, -0.15,
                  0, 0.1, -0.15, -0.68, 0.18, -1.25,
                  0, 0.1, -0.15, 0.68, 0.18, -1.25,
                  -0.68, 0.18, -1.25, 0, 0.24, -1.85,
                  0.68, 0.18, -1.25, 0, 0.24, -1.85,
                ]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00e5ff" transparent opacity={0.35} />
        </lineSegments>
      </group>

      {/* ========================================================
          9. INTERACTIVE SPEC COMPONENT FOCUS RETICLE
          ======================================================== */}
      <group ref={focusHighlightRef} visible={false}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.32, 32]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.40, 32]} />
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <pointLight intensity={3.0} distance={2.5} color="#00e5ff" />
      </group>
    </group>
  )
}

// 22" Directional Aero Turbine Wheel Assembly
function WheelAssembly({ position, wheelRef, materials, isLeft }) {
  const dir = isLeft ? 1 : -1
  return (
    <group position={position}>
      <group ref={wheelRef}>
        {/* Tire with low-profile sidewall */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.30, 0.30, 0.26, 26]} />
          <primitive object={materials.tireRubber} attach="material" />
        </mesh>

        {/* Machined Inner Rim Barrel */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.23, 0.23, 0.265, 24]} />
          <primitive object={materials.forgedAlloy} attach="material" />
        </mesh>

        {/* Carbon Fiber Aero Disc Face */}
        <mesh position={[dir * 0.132, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.015, 24]} />
          <primitive object={materials.carbonFiber} attach="material" />
        </mesh>

        {/* Directional Turbine Aero Vanes */}
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 7
          const r = 0.11
          return (
            <mesh
              key={i}
              position={[dir * 0.138, Math.cos(angle) * r, Math.sin(angle) * r]}
              rotation={[dir * 0.35, 0, angle]}
            >
              <boxGeometry args={[0.018, 0.11, 0.024]} />
              <primitive object={materials.forgedAlloy} attach="material" />
            </mesh>
          )
        })}

        {/* Center Lock Nut with Illuminated Cyan Hex Ring */}
        <mesh position={[dir * 0.145, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 6]} />
          <primitive object={materials.cyanTrim} attach="material" />
        </mesh>
      </group>
    </group>
  )
}
