import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial, ContactShadows } from '@react-three/drei'

// Automotive Reveal Studio Environment
// Real-time HDR studio lighting rig with Lightformers, glossy reflection floor, and soft contact shadows

// Precompute floating atmospheric dust / light motes
function createDustPositions(count = 180) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.sin(i * 1.7) * 0.5) * 12
    positions[i * 3 + 1] = ((i % 25) / 25) * 2.2 + 0.05
    positions[i * 3 + 2] = (Math.cos(i * 2.3) * 0.5) * 12
  }
  return positions
}

const STATIC_DUST_DATA = createDustPositions(180)

export default function EnvironmentStudio() {
  const dustParticlesRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (dustParticlesRef.current) {
      dustParticlesRef.current.rotation.y = t * 0.012
      dustParticlesRef.current.position.y = Math.sin(t * 0.25) * 0.03
    }
  })

  return (
    <>
      {/* Background color and atmospheric deep studio fog */}
      <color attach="background" args={['#030508']} />
      <fog attach="fog" args={['#030508', 5.0, 22.0]} />

      {/* ========================================================
          1. HDR ENVIRONMENT STUDIO SOFTBOX RIG (LIGHTFORMERS)
          ======================================================== */}
      <Environment resolution={512}>
        <group rotation={[-Math.PI / 4, -0.2, 0]}>
          {/* Main overhead longitudinal studio softbox */}
          <Lightformer
            form="rect"
            intensity={3.2}
            position={[0, 6, 0]}
            scale={[16, 5]}
            color="#ffffff"
            target={[0, 0, 0]}
          />

          {/* Left grazing highlight for car shoulder line */}
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[-7, 2.5, 0]}
            scale={[14, 2.5]}
            rotation-y={Math.PI / 2}
            color="#e6f2ff"
          />

          {/* Right fill softbox with subtle electric cyan tint */}
          <Lightformer
            form="rect"
            intensity={1.8}
            position={[7, 2.5, 0]}
            scale={[14, 2.5]}
            rotation-y={-Math.PI / 2}
            color="#d0f4ff"
          />

          {/* Rear rim kicker for spoiler and rear haunches */}
          <Lightformer
            form="circle"
            intensity={3.0}
            position={[0, 2.8, -8]}
            scale={4.5}
            color="#00e5ff"
            target={[0, 0.4, 0]}
          />

          {/* Front nose ground bounce light */}
          <Lightformer
            form="ring"
            intensity={1.2}
            position={[0, 1.0, 7]}
            scale={4}
            color="#6884a0"
            target={[0, 0.2, 1.8]}
          />
        </group>
      </Environment>

      {/* ========================================================
          2. DIRECTIONAL STUDIO ILLUMINATION & SHADOWS
          ======================================================== */}
      {/* Soft Key Light from 3/4 high angle */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={25}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0002}
        color="#ffffff"
      />

      {/* Subtle Cyan Rim Highlight from opposite corner */}
      <directionalLight position={[-6, 3, -4]} intensity={0.8} color="#00e5ff" />

      {/* Ambient Fill */}
      <ambientLight intensity={0.35} color="#405060" />

      {/* ========================================================
          3. POLISHED OBSIDIAN REFLECTIVE STUDIO FLOOR
          ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Real-time Blurred Mirror Showroom Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <MeshReflectorMaterial
            blur={[350, 100]}
            resolution={512}
            mixBlur={0.85}
            mixStrength={1.4}
            roughness={0.24}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#06090e"
            metalness={0.88}
            mirror={0.55}
          />
        </mesh>

        {/* Realistic ground-truth tire and chassis contact shadows */}
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.8}
          scale={7}
          blur={2.4}
          far={1.6}
          resolution={512}
          color="#000000"
        />

        {/* Elegant Minimalist Technical Showroom Floor Guide */}
        <gridHelper
          args={[30, 30, '#00e5ff', '#0d1520']}
          position={[0, 0.002, 0]}
        />

        {/* Subtle longitudinal floor guidelines */}
        <mesh position={[-2.4, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.015, 18]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} />
        </mesh>
        <mesh position={[2.4, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.015, 18]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* ========================================================
          4. FLOATING ATMOSPHERIC LIGHT PARTICLES
          ======================================================== */}
      <points ref={dustParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[STATIC_DUST_DATA, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          color="#8ec8e8"
          transparent
          opacity={0.25}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </>
  )
}
