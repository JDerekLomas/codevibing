'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { LearningDomain } from '@/data/types'
import { soundManager } from '@/lib/sounds'

interface GlobeProps {
  domains: LearningDomain[]
  onDomainClick: (domain: LearningDomain) => void
  selectedDomain?: string
}

function GlobeMesh({ domains, onDomainClick, selectedDomain }: GlobeProps) {
  const globeRef = useRef<THREE.Mesh>(null)
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null)

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001
    }
  })

  const latLngToVector3 = (lat: number, lng: number, radius: number = 2): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)

    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    return new THREE.Vector3(x, y, z)
  }

  const handleDomainClick = (domain: LearningDomain, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    soundManager.playSound('click')
    onDomainClick(domain)
  }

  const handleDomainHover = (domainId: string | null) => {
    if (domainId !== hoveredDomain) {
      setHoveredDomain(domainId)
      if (domainId) {
        soundManager.playSound('click')
      }
    }
  }

  return (
    <group>
      {/* Main globe sphere - Japanese gaming aesthetic */}
      <Sphere ref={globeRef} args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.3}
          metalness={0.8}
          emissive="#0f0f1e"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Energy grid overlay */}
      <Sphere args={[2.02, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Domain markers - Japanese gaming style */}
      {domains.map((domain, index) => {
        const position = latLngToVector3(domain.position.lat, domain.position.lng, 2.3)
        const isHovered = hoveredDomain === domain.id
        const isSelected = selectedDomain === domain.id
        const scale = isHovered ? 2.0 : (isSelected ? 1.5 : 1.0)

        return (
          <group key={domain.id} position={position}>
            {/* Outer glow ring */}
            {isHovered && (
              <mesh scale={[1.5, 1.5, 1.5]}>
                <ringGeometry args={[0.2, 0.3, 16]} />
                <meshBasicMaterial
                  color={domain.color}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            )}

            {/* Main domain marker */}
            <mesh
              scale={scale}
              onClick={(e) => handleDomainClick(domain, e)}
              onPointerOver={() => handleDomainHover(domain.id)}
              onPointerOut={() => handleDomainHover(null)}
            >
              <octahedronGeometry args={[0.12]} />
              <meshStandardMaterial
                color={domain.color}
                emissive={domain.color}
                emissiveIntensity={isHovered ? 0.8 : (isSelected ? 0.5 : 0.3)}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>

            {/* Energy particles when hovered */}
            {isHovered && (
              <mesh scale={[0.05, 0.05, 0.05]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function Globe({ domains, onDomainClick, selectedDomain }: GlobeProps) {
  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{
          background: 'radial-gradient(ellipse at center, #0a0a0f 0%, #000000 100%)',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Ambient lighting with color */}
        <ambientLight intensity={0.3} color="#4040ff" />

        {/* Main directional light */}
        <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" />

        {/* Colored accent lights */}
        <pointLight position={[10, 0, 0]} intensity={0.4} color="#ff00ff" />
        <pointLight position={[-10, 0, 0]} intensity={0.4} color="#00ffff" />
        <pointLight position={[0, 0, 10]} intensity={0.4} color="#ffff00" />

        <GlobeMesh
          domains={domains}
          onDomainClick={onDomainClick}
          selectedDomain={selectedDomain}
        />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}