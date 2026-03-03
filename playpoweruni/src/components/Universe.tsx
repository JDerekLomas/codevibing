'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'
import { LearningDomain } from '@/data/types'
import { soundManager } from '@/lib/sounds'

interface UniverseProps {
  domains: LearningDomain[]
  onDomainClick: (domain: LearningDomain) => void
  selectedDomain?: string
}

// Tron grid field component
function TronGrid() {
  const ref = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0001
      ref.current.rotation.x += 0.00005
    }
  })

  const positions = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000 * 3; i += 3) {
      // Create a more structured grid pattern
      const gridX = Math.floor(Math.random() * 20) - 10
      const gridZ = Math.floor(Math.random() * 20) - 10
      const y = (Math.random() - 0.5) * 50

      positions[i] = gridX * 3
      positions[i + 1] = y
      positions[i + 2] = gridZ * 3
    }
    return positions
  }, [])

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ff6600"
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  )
}

// Planet component for each learning domain
function Planet({
  domain,
  position,
  isHovered,
  isSelected,
  onClick,
  onHover
}: {
  domain: LearningDomain
  position: [number, number, number]
  isHovered: boolean
  isSelected: boolean
  onClick: () => void
  onHover: (hover: boolean) => void
}) {
  const planetRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [rotation, setRotation] = useState(0)

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.003
    }
    setRotation(state.clock.elapsedTime)
  })

  // Planet properties based on domain - Tron colors
  const planetConfig = {
    numbers: { size: 1.2, color: '#0099ff', hasRing: false, texture: 'solid' },
    geometry: { size: 1.0, color: '#00ffff', hasRing: true, texture: 'striped' },
    people: { size: 1.3, color: '#ff6600', hasRing: false, texture: 'solid' },
    ai: { size: 1.1, color: '#ffaa00', hasRing: true, texture: 'hexagon' },
    history: { size: 1.15, color: '#ff3366', hasRing: false, texture: 'cratered' }
  }

  const config = planetConfig[domain.id as keyof typeof planetConfig]
  const scale = isHovered ? 1.8 : (isSelected ? 1.4 : 1.0)

  return (
    <group position={position}>
      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.size * 3, config.size * 3.1, 64]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Planet */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={planetRef}
          scale={[scale, scale, scale]}
          onClick={onClick}
          onPointerOver={() => onHover(true)}
          onPointerOut={() => onHover(false)}
        >
          <sphereGeometry args={[config.size, 32, 32]} />
          <meshStandardMaterial
            color={config.color}
            roughness={0.3}
            metalness={0.7}
            emissive={config.color}
            emissiveIntensity={isHovered ? 0.4 : (isSelected ? 0.3 : 0.1)}
          />
        </mesh>

        {/* Planet ring if applicable */}
        {config.hasRing && (
          <mesh ref={ringRef} rotation={[Math.PI / 2 - 0.3, 0, 0]}>
            <ringGeometry args={[config.size * 1.5, config.size * 2, 32]} />
            <meshStandardMaterial
              color={config.color}
              transparent
              opacity={0.7}
              roughness={0.4}
              metalness={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Glow effect when hovered */}
        {isHovered && (
          <mesh scale={[config.size * 2, config.size * 2, config.size * 2]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.1}
            />
          </mesh>
        )}

        {/* Tron energy particles with glitch effects */}
        {(isHovered || isSelected) && (
          <group>
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2 + rotation
              const distance = config.size * 2.5
              const glitchOffset = Math.sin(rotation * 10 + i) * 0.1
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * distance + glitchOffset,
                    Math.sin(angle) * distance * 0.3 + Math.cos(rotation * 5 + i) * 0.2,
                    Math.sin(angle) * distance
                  ]}
                  scale={[0.08, 0.08, 0.08]}
                >
                  <octahedronGeometry args={[1, 0]} />
                  <meshBasicMaterial
                    color={i % 2 === 0 ? "#ff6600" : "#00ffff"}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
              )
            })}
          </group>
        )}

        {/* Glitch effect rings */}
        {isHovered && (
          <mesh scale={[config.size * 3, config.size * 3, config.size * 3]}>
            <ringGeometry args={[1, 1.05, 8]} />
            <meshBasicMaterial
              color="#ff0000"
              transparent
              opacity={Math.sin(rotation * 20) * 0.5 + 0.5}
            />
          </mesh>
        )}
      </Float>

      {/* Domain icon */}
      {(isHovered || isSelected) && (
        <Float speed={3} rotationIntensity={0} floatIntensity={1}>
          <mesh position={[0, config.size + 1, 0]} scale={[0.5, 0.5, 0.5]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </Float>
      )}
    </group>
  )
}

// Central Tron core
function TronCore() {
  const coreRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005
      coreRef.current.rotation.x += 0.002
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1
      coreRef.current.scale.setScalar(pulse)
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.008
      ringRef.current.rotation.y += 0.003
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Outer rings */}
      <mesh ref={ringRef}>
        <ringGeometry args={[2, 2.2, 8]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.7, 8]} />
        <meshBasicMaterial
          color="#0099ff"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glow effect */}
      <mesh scale={[3, 3, 3]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  )
}

// Main universe component
function UniverseMesh({ domains, onDomainClick, selectedDomain }: UniverseProps) {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null)

  // Generate 3D positions for planets in a solar system arrangement
  const planetPositions = useMemo(() => {
    const positions: { [key: string]: [number, number, number] } = {}
    const baseDistance = 8

    // Arrange planets in different orbital planes
    positions.numbers = [baseDistance, 0, 0]
    positions.geometry = [0, baseDistance * 0.8, baseDistance * 0.6]
    positions.people = [-baseDistance * 0.7, baseDistance * 0.7, 0]
    positions.ai = [0, -baseDistance, baseDistance * 0.5]
    positions.history = [baseDistance * 0.6, 0, -baseDistance * 0.8]

    return positions
  }, [])

  const handleDomainClick = (domain: LearningDomain) => {
    soundManager.playSound('click')
    onDomainClick(domain)
  }

  const handleDomainHover = (domainId: string, isHovered: boolean) => {
    setHoveredDomain(isHovered ? domainId : null)
    if (isHovered) {
      soundManager.playSound('click')
    }
  }

  return (
    <group>
      {/* Central Tron core */}
      <TronCore />

      {/* Tron grid field */}
      <TronGrid />

      {/* Planets for each learning domain */}
      {domains.map((domain) => (
        <Planet
          key={domain.id}
          domain={domain}
          position={planetPositions[domain.id]}
          isHovered={hoveredDomain === domain.id}
          isSelected={selectedDomain === domain.id}
          onClick={() => handleDomainClick(domain)}
          onHover={(isHovered) => handleDomainHover(domain.id, isHovered)}
        />
      ))}

      {/* Tron grid lines */}
      <mesh position={[0, -20, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Energy walls */}
      <mesh position={[0, 0, -30]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function Universe({ domains, onDomainClick, selectedDomain }: UniverseProps) {
  return (
    <div className="w-full h-screen relative tron-grid-bg">
      <Canvas
        camera={{ position: [15, 10, 15], fov: 75 }}
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a1a 100%)',
          width: 'calc(100% - 24rem)', // Account for fixed side panel
          height: '100%',
          borderLeft: '2px solid rgba(255, 102, 0, 0.3)'
        }}
      >
        {/* Tron lighting */}
        <ambientLight intensity={0.2} color="#ff6600" />

        {/* Core light */}
        <pointLight position={[0, 0, 0]} intensity={3} color="#ff6600" />

        {/* Accent lights */}
        <pointLight position={[20, 10, 5]} intensity={0.8} color="#00ffff" />
        <pointLight position={[-20, -10, -5]} intensity={0.5} color="#0099ff" />

        {/* Grid stars */}
        <Stars
          radius={80}
          depth={30}
          count={3000}
          factor={3}
          saturation={1}
          fade
          speed={0.5}
        />

        <UniverseMesh
          domains={domains}
          onDomainClick={onDomainClick}
          selectedDomain={selectedDomain}
        />

        <OrbitControls
          enablePan={false}
          minDistance={12}
          maxDistance={35}
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.03}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.2}
        />
      </Canvas>

      {/* Tron grid overlay effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
        <div className="scanline"></div>
      </div>
    </div>
  )
}