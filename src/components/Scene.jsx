import React, { Component } from 'react'
import { useFrame } from '@react-three/fiber'
import ProceduralHypercar from './ProceduralHypercar'
import CinemaCamera from './CinemaCamera'
import EnvironmentStudio from './EnvironmentStudio'
import { scrollStore } from '../lib/scrollStore'

// Failsafe WebGL Error Boundary
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL Rendering Recovered via Failsafe:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          <ambientLight intensity={1.5} />
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.9, 0.4, 4.2]} />
            <meshStandardMaterial color="#0c131a" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )
    }
    return this.props.children
  }
}

function SceneContent() {
  // Single-source update per animation frame
  useFrame((state, delta) => {
    scrollStore.update(delta)
  })

  return (
    <>
      {/* 6-Scene Cinema Camera Director */}
      <CinemaCamera />

      {/* Autonomous Automotive Reveal Studio */}
      <EnvironmentStudio />

      {/* Realistic 2035 Autonomous Electric Hypercar */}
      <ProceduralHypercar />
    </>
  )
}

export default function Scene() {
  return (
    <WebGLErrorBoundary>
      <SceneContent />
    </WebGLErrorBoundary>
  )
}
