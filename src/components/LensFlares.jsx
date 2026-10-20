import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function LensFlares({ progress }) {
  const g = useRef()
  useFrame((s)=>{
    if(!g.current) return
    const p = progress
    // intensity based on camera angle looking toward lights
    const intensity = Math.sin(p * Math.PI * 2) * 0.3 + 0.45
    g.current.children.forEach((c,i)=>{
      if(c.material){
        c.material.opacity = THREE.MathUtils.clamp(0.12 + intensity*0.18 + Math.sin(s.clock.elapsedTime*1.2 + i)*0.06, 0, 0.42)
        c.scale.setScalar(1 + Math.sin(s.clock.elapsedTime*0.8 + i)*0.04)
      }
    })
    // slight position shift parallax
    g.current.position.x = Math.sin(s.clock.elapsedTime*0.11)*0.04
  })
  return (
    <group ref={g}>
      {/* subtle anamorphic streak */}
      <sprite position={[1.05,0.52,0.45]} scale={[2.2,0.14,1]}>
        <spriteMaterial color="#00e5ff" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[-0.92,0.48,-0.35]} scale={[1.6,0.11,1]}>
        <spriteMaterial color="#ff2a6d" transparent opacity={0.10} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[0,0.62,1.35]} scale={[0.42,0.42,1]}>
        <spriteMaterial color="#ffffff" transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[0.22,0.35,-1.2]} scale={[0.28,0.28,1]}>
        <spriteMaterial color="#7c4dff" transparent opacity={0.11} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  )
}
