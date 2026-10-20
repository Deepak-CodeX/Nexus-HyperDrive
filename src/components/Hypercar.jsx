import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Hypercar({ progress }) {
  const root = useRef()
  const headL = useRef(), headR = useRef(), tailL = useRef(), tailR = useRef()
  const core = useRef(), wing = useRef()
  const wheelFL = useRef(), wheelFR = useRef(), wheelRL = useRef(), wheelRR = useRef()

  // materials
  const bodyMat = useMemo(()=> new THREE.MeshPhysicalMaterial({
    color: '#0f1820',
    metalness: 0.92,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.1,
  }),[])
  const carbonMat = useMemo(()=> new THREE.MeshStandardMaterial({ color:'#0a0d12', metalness:0.55, roughness:0.55 }),[])
  const glassMat = useMemo(()=> new THREE.MeshPhysicalMaterial({ color:'#081018', metalness:0.2, roughness:0.04, transmission:0.55, thickness:0.12, transparent:true, opacity:0.92 }),[])
  const rubberMat = useMemo(()=> new THREE.MeshStandardMaterial({ color:'#0a0c0f', roughness:0.92, metalness:0.02 }),[])

  // headlight material animated
  const headMat = useMemo(()=> new THREE.MeshStandardMaterial({ color:'#eaffff', emissive:'#00e5ff', emissiveIntensity: 0, toneMapped:false }),[])
  const tailMat = useMemo(()=> new THREE.MeshStandardMaterial({ color:'#ff2a6d', emissive:'#ff2a6d', emissiveIntensity:0.0, toneMapped:false }),[])
  const coreMat = useMemo(()=> new THREE.MeshStandardMaterial({ color:'#00e5ff', emissive:'#00e5ff', emissiveIntensity:1.4, toneMapped:false }),[])

  useFrame((state)=>{
    const t= state.clock.elapsedTime
    const p = progress ?? 0

    // headlights power-on near start
    const headOn = THREE.MathUtils.clamp((p - 0.02)*10, 0, 1) * (0.9 + Math.sin(t*6)*0.04)
    // pulse core with power phase
    const powerPhase = p>0.48 && p<0.72 ? 1 : 0.55
    const corePulse = (1 + Math.sin(t*2.4)*0.14 + Math.sin(t*5.2)*0.06) * powerPhase

    if (headL.current) headL.current.material.emissiveIntensity = headOn * 3.2
    if (headR.current) headR.current.material.emissiveIntensity = headOn * 3.2
    if (tailL.current) tailL.current.material.emissiveIntensity = 0.7 + Math.sin(t*3.2)*0.18 + (p>0.68?0.5:0)
    if (tailR.current) tailR.current.material.emissiveIntensity = 0.7 + Math.cos(t*3.2)*0.18 + (p>0.68?0.5:0)
    if (core.current) {
      core.current.material.emissiveIntensity = 1.2 * corePulse
      core.current.scale.setScalar(1 + Math.sin(t*2.2)*0.06)
      core.current.rotation.y += 0.012
    }
    // wheels
    const spin = p * 22 + t* (0.6 + p*1.2)
    ;[wheelFL,wheelFR,wheelRL,wheelRR].forEach(r=>{
      if(r.current) r.current.rotation.x = spin
    })
    // aero wing
    if (wing.current) {
      wing.current.rotation.x = THREE.MathUtils.lerp(0.05, -0.18, THREE.MathUtils.clamp((p-0.32)*3,0,1)) + Math.sin(t*0.9)*0.02
      wing.current.position.y = 0.46 + Math.sin(t*0.7)*0.004
    }

    // subtle color temp shift with progress
    if (root.current) {
      const temp = 0.18 + Math.sin(t*0.3)*0.01
      bodyMat.envMapIntensity = 1.05 + temp
    }
  })

  return (
    <group ref={root} position={[0,0.12,0]}>
      {/* main low body - stretched box with bevel illusion */}
      <mesh castShadow receiveShadow position={[0,0.18,-0.06]}>
        <boxGeometry args={[1.92,0.22,4.05]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>
      {/* front splitter */}
      <mesh position={[0,0.07,1.92]} castShadow>
        <boxGeometry args={[1.88,0.04,0.32]} />
        <meshStandardMaterial color="#070a0f" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* splitter cyan edge */}
      <mesh position={[0,0.075,2.06]}>
        <boxGeometry args={[1.78,0.012,0.02]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* hood slope */}
      <mesh position={[0,0.27,0.95]} rotation={[0.18,0,0]}>
        <boxGeometry args={[1.68,0.06,1.05]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>
      {/* cockpit glass */}
      <mesh position={[0,0.42,0.18]}>
        <boxGeometry args={[0.92,0.14,1.22]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      {/* roof spine */}
      <mesh position={[0,0.50,0.02]}>
        <boxGeometry args={[0.18,0.03,1.15]} />
        <meshStandardMaterial color="#0b0e14" metalness={0.9} roughness={0.18} />
      </mesh>
      {/* active wing */}
      <group ref={wing} position={[0,0.46,-1.78]}>
        <mesh castShadow>
          <boxGeometry args={[1.72,0.03,0.28]} />
          <meshStandardMaterial color="#0a0d12" metalness={0.8} roughness={0.22} />
        </mesh>
        {/* wing endplates */}
        <mesh position={[-0.84,0.06,0]}>
          <boxGeometry args={[0.04,0.15,0.34]} />
          <meshStandardMaterial color="#0a0d12" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0.84,0.06,0]}>
          <boxGeometry args={[0.04,0.15,0.34]} />
          <meshStandardMaterial color="#0a0d12" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* rear diffuser */}
      <group position={[0,0.06,-1.95]}>
        {Array.from({length:5}).map((_,i)=>(
          <mesh key={i} position={[(i-2)*0.26,0,0]}>
            <boxGeometry args={[0.03,0.12,0.42]} />
            <meshStandardMaterial color="#06080c" metalness={0.5} roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0,-0.02,0]}>
          <boxGeometry args={[1.55,0.02,0.32]} />
          <meshStandardMaterial color="#06080c" />
        </mesh>
      </group>

      {/* headlights - ultra thin */}
      <mesh ref={headL} position={[-0.68,0.20,2.00]}>
        <boxGeometry args={[0.42,0.04,0.06]} />
        <primitive object={headMat} attach="material" />
      </mesh>
      <mesh ref={headR} position={[0.68,0.20,2.00]}>
        <boxGeometry args={[0.42,0.04,0.06]} />
        <primitive object={headMat} attach="material" />
      </mesh>
      {/* headlight glow planes */}
      <mesh position={[-0.68,0.20,2.05]}>
        <planeGeometry args={[0.52,0.12]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <mesh position={[0.68,0.20,2.05]}>
        <planeGeometry args={[0.52,0.12]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.18} toneMapped={false} />
      </mesh>

      {/* tail lights */}
      <mesh ref={tailL} position={[-0.62,0.22,-2.02]}>
        <boxGeometry args={[0.56,0.03,0.05]} />
        <primitive object={tailMat} attach="material" />
      </mesh>
      <mesh ref={tailR} position={[0.62,0.22,-2.02]}>
        <boxGeometry args={[0.56,0.03,0.05]} />
        <primitive object={tailMat} attach="material" />
      </mesh>

      {/* energy core underbody */}
      <mesh ref={core} position={[0,0.11,-0.10]}>
        <cylinderGeometry args={[0.28,0.30,0.08, 20]} />
        <primitive object={coreMat} attach="material" />
      </mesh>
      <mesh position={[0,0.09,-0.10]} rotation={[Math.PI/2,0,0]}>
        <ringGeometry args={[0.32,0.38, 28]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.32} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[0,0.085,-0.10]} rotation={[Math.PI/2,0,0]}>
        <ringGeometry args={[0.44,0.46, 28]} />
        <meshBasicMaterial color="#7c4dff" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>

      {/* side intakes */}
      <mesh position={[-0.96,0.18,-0.25]}><boxGeometry args={[0.05,0.12,0.75]} /><primitive object={carbonMat} attach="material" /></mesh>
      <mesh position={[0.96,0.18,-0.25]}><boxGeometry args={[0.05,0.12,0.75]} /><primitive object={carbonMat} attach="material" /></mesh>

      {/* carbon details */}
      <mesh position={[0,0.30,-0.70]}><boxGeometry args={[1.55,0.02,0.06]} /><meshStandardMaterial color="#080a0e" roughness={0.45} metalness={0.5} /></mesh>

      {/* wheels */}
      <Wheel pos={[-0.92,0.10,1.15]} ref1={wheelFL} rubberMat={rubberMat} />
      <Wheel pos={[0.92,0.10,1.15]} ref1={wheelFR} rubberMat={rubberMat} />
      <Wheel pos={[-0.92,0.10,-1.15]} ref1={wheelRL} rubberMat={rubberMat} />
      <Wheel pos={[0.92,0.10,-1.15]} ref1={wheelRR} rubberMat={rubberMat} />
    </group>
  )
}

function Wheel({ pos, ref1, rubberMat }) {
  return (
    <group position={pos}>
      <group ref={ref1}>
        {/* tire */}
        <mesh rotation={[0,0,Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.28,0.28,0.22, 22]} />
          <primitive object={rubberMat} attach="material" />
        </mesh>
        {/* rim */}
        <mesh rotation={[0,0,Math.PI/2]}>
          <cylinderGeometry args={[0.20,0.20,0.225, 18]} />
          <meshStandardMaterial color="#c8d0d8" metalness={0.92} roughness={0.18} />
        </mesh>
        {/* center cap cyan */}
        <mesh position={[0.115,0,0]} rotation={[0,0,Math.PI/2]}>
          <cylinderGeometry args={[0.05,0.05,0.01,16]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1} toneMapped={false} />
        </mesh>
        {/* turbine blades */}
        {Array.from({length:6}).map((_,i)=>(
          <mesh key={i} position={[0.08, Math.cos(i*1.047)*0.08, Math.sin(i*1.047)*0.08]} rotation={[0,0,i*1.047]}>
            <boxGeometry args={[0.02,0.11,0.02]} />
            <meshStandardMaterial color="#e6edf2" metalness={0.7} roughness={0.28} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
