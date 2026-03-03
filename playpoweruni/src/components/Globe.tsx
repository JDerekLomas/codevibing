'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { LearningDomain } from '@/data/types'

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
      globeRef.current.rotation.y += 0.002
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
    onDomainClick(domain)
  }

  const handleDomainHover = (domainId: string | null, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    setHoveredDomain(domainId)
  }

  return (
    <group>
      {/* Main globe sphere */}
      <Sphere ref={globeRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>

      {/* Add atmosphere glow */}
      <Sphere args={[2.1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          roughness={1}
          metalness={0}
        />
      </Sphere>

      {/* Domain markers */}
      {domains.map((domain) => {
        const position = latLngToVector3(domain.position.lat, domain.position.lng, 2.2)
        const isHovered = hoveredDomain === domain.id
        const isSelected = selectedDomain === domain.id
        const scale = isHovered ? 1.3 : (isSelected ? 1.2 : 1)

        return (
          <group key={domain.id} position={position}>
            {/* Connection line to globe */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3]} />
              <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
            </mesh>

            {/* Domain shape marker */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handleDomainClick(domain, e)}
              onPointerOver={(e) => handleDomainHover(domain.id, e)}
              onPointerOut={(e) => handleDomainHover(null, e)}
            >
              {domain.shape === 'cube' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
              {domain.shape === 'sphere' && <sphereGeometry args={[0.2, 32, 32]} />}
              {domain.shape === 'pyramid' && <coneGeometry args={[0.2, 0.4, 4]} />}
              {domain.shape === 'torus' && <torusGeometry args={[0.15, 0.08, 16, 32]} />}
              {domain.shape === 'cone' && <coneGeometry args={[0.2, 0.4, 8]} />}
              {domain.shape === 'cylinder' && <cylinderGeometry args={[0.15, 0.15, 0.4]} />}

              <meshStandardMaterial
                color={domain.color}
                emissive={isHovered || isSelected ? domain.color : '#000000'}
                emissiveIntensity={isHovered || isSelected ? 0.3 : 0}
              />
            </mesh>

            {/* Domain label */}
            {(isHovered || isSelected) && (
              <Html distanceFactor={10}>
                <div className="bg-white rounded-lg shadow-lg p-3 pointer-events-none whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{domain.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{domain.name}</div>
                      <div className="text-xs text-gray-600">{domain.description}</div>
                    </div>
                  </div>
                </div>
              </Html>
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
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%'
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <GlobeMesh
          domains={domains}
          onDomainClick={onDomainClick}
          selectedDomain={selectedDomain}
        />

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Debug overlay */}
      <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs">
        <div>Domains loaded: {domains.length}</div>
        <div>Canvas rendering: Active</div>
      </div>
    </div>
  )
}