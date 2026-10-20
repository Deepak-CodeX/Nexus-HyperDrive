import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Automotive Reveal Studio Environment
// Offline-safe, fully procedural lighting, reflective ground, and volumetric atmosphere

export default function EnvironmentStudio({ scrollStoreRef }) {
  const sweepLightA = useRef()
  const sweepLightB = useRef()
  const dustParticlesRef = useRef()

  // Generate floating atmospheric dust / light motes
  const dustData = useMemo(() => {
    const count = 280
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = Math.random() * 2.5 + 0.05
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14
      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, phases }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const data = scrollStoreRef.current?.update(0.016) || { progress: 0 }
    const p = data.progress

    // Dynamic showroom sweep light moving along vehicle with scroll
    if (sweepLightA.current) {
      sweepLightA.current.position.x = THREE.MathUtils.lerp(-3.2, 3.5, p)
      sweepLightA.current.position.z = THREE.MathUtils.lerp(2.2, -2.8, p)
      sweepLightA.current.intensity = 16 + Math.sin(t * 2.0) * 2.5
    }

    if (sweepLightB.current) {
      sweepLightB.current.position.x = THREE.MathUtils.lerp(2.8, -2.8, p)
      sweepLightB.current.position.z = THREE.MathUtils.lerp(-2.5, 2.5, p)
      sweepLightB.current.intensity = 12 + Math.cos(t * 1.8) * 2.0
    }

    // Drifting dust motes
    if (dustParticlesRef.current) {
      dustParticlesRef.current.rotation.y = t * 0.015
      dustParticlesRef.current.position.y = Math.sin(t * 0.25) * 0.04
    }
  })

  return (
    <>
      {/* Background color and atmospheric deep fog */}
      <color attach="background" args={['#030508']} />
      <fog attach="fog" args={['#04070d', 4.0, 18.0]} />

      {/* Primary Key Light (Warm soft silver from high angle) */}
      <directionalLight
        position={[5.5, 7.5, 4.0]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={25}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
        color="#ffffff"
      />

      {/* Cyber Rim Light (Electric Cyan from opposite low angle) */}
      <directionalLight position={[-4.5, 3.2, -3.5]} intensity={1.8} color="#00e5ff" />

      {/* Accent Magenta Rim (Subtle highlight on rear surfaces) */}
      <directionalLight position={[3.5, 2.8, -4.5]} intensity={1.2} color="#ff2a6d" />

      {/* Ambient Fill Light */}
      <ambientLight intensity={0.45} color="#607890" />
      <hemisphereLight args={['#00e5ff', '#030508', 0.35]} />

      {/* Dynamic Showroom Sweep Lights */}
      <pointLight ref={sweepLightA} position={[-2.5, 1.4, 1.8]} intensity={16} distance={8} color="#00e5ff" decay={2} />
      <pointLight ref={sweepLightB} position={[2.5, 1.2, -1.8]} intensity={12} distance={8} color="#7c4dff" decay={2} />
      <pointLight position={[0, 2.8, 0]} intensity={8} distance={10} color="#ffffff" decay={2} />

      {/* ========================================================
          POLISHED OBSIDIAN REFLECTIVE FLOOR
          ======================================================== */}
      <group position={[0, -0.005, 0]}>
        {/* Main reflective showroom mirror slab */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[36, 36]} />
          <meshStandardMaterial
            color="#05080e"
            metalness={0.95}
            roughness={0.16}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Soft underbody ground contact shadow plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.006, 0]}>
          <planeGeometry args={[2.8, 5.2]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.65} />
        </mesh>

        {/* Ambient cyan underglow projection plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.007, -0.15]}>
          <planeGeometry args={[1.6, 2.2]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.12} />
        </mesh>

        {/* Subtle engineering floor grid */}
        <gridHelper args={[36, 36, '#00e5ff', '#162230']} position={[0, -0.004, 0]} />
      </group>

      {/* ========================================================
          LABORATORY LIGHT STRIPS & ARCHITECTURAL ACCENTS
          ======================================================== */}
      <group>
        {/* Floor Longitudinal Neon Guideway */}
        <mesh position={[-2.8, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.025, 20]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} />
        </mesh>
        <mesh position={[2.8, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.025, 20]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} />
        </mesh>

        {/* Lateral Threshold Light Blades */}
        <mesh position={[0, 0.002, -3.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[16, 0.035]} />
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 0.002, 3.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[16, 0.035]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.7} />
        </mesh>

        {/* Ceiling Linear Light Bars */}
        <mesh position={[0, 4.2, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.04, 18]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-3.2, 3.8, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.05, 0.03, 14]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
        <mesh position={[3.2, 3.8, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.05, 0.03, 14]} />
          <meshBasicMaterial color="#7c4dff" />
        </mesh>
      </group>

      {/* ========================================================
          DISTANT ARCHITECTURAL MONOLITHS (LAB 07 DEPTH)
          ======================================================== */}
      <group position={[0, 0, -8.5]}>
        {[-8, -4, 4, 8].map((x, idx) => (
          <group key={idx} position={[x, 3.5, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.7, 7, 0.7]} />
              <meshStandardMaterial color="#080c14" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Vertical cyan neon groove */}
            <mesh position={[0, 0, 0.36]}>
              <boxGeometry args={[0.02, 6.8, 0.01]} />
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================
          FLOATING ATMOSPHERIC DUST & LIGHT MOTES
          ======================================================== */}
      <points ref={dustParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustData.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          color="#a8d8f0"
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </>
  )
}
