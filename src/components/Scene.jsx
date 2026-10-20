import React, { Component, useRef } from 'react'
import ProceduralHypercar from './ProceduralHypercar'
import CinemaCamera from './CinemaCamera'
import EnvironmentStudio from './EnvironmentStudio'
import { scrollStore } from '../lib/scrollStore'

// Failsafe WebGL Error Boundary
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL Rendering Recovered via Failsafe:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          <ambientLight intensity={1} />
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.8, 0.4, 4.0]} />
            <meshStandardMaterial color="#0c131a" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )
    }
    return this.props.children
  }
}

export default function Scene({ focusedKey }) {
  const storeRef = useRef(scrollStore)

  return (
    <WebGLErrorBoundary>
      {/* 6-Scene Cinema Camera Director */}
      <CinemaCamera scrollStoreRef={storeRef} focusedKey={focusedKey} />

      {/* Autonomous Automotive Reveal Studio (Procedural, Offline-Safe) */}
      <EnvironmentStudio scrollStoreRef={storeRef} />

      {/* Procedural 2035 Autonomous Electric Hypercar */}
      <ProceduralHypercar scrollStoreRef={storeRef} focusedKey={focusedKey} />
    </WebGLErrorBoundary>
  )
}
