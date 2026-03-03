'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Cone, Cylinder, Torus } from '@react-three/drei'
import * as THREE from 'three'

interface GeometryGameProps {
  onGameComplete: (score: number) => void
  onBack: () => void
}

interface Shape {
  id: string
  name: string
  type: 'cube' | 'sphere' | 'cone' | 'cylinder' | 'torus'
  color: string
  position: [number, number, number]
}

function ShapeMesh({ shape, isSelected, onClick }: { shape: Shape; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  const meshProps = {
    position: shape.position,
    onClick: onClick,
    onPointerOver: () => setHovered(true),
    onPointerOut: () => setHovered(false),
  }

  const materialProps = {
    color: isSelected ? '#10b981' : (hovered ? '#3b82f6' : shape.color),
    emissive: isSelected || hovered ? shape.color : '#000000',
    emissiveIntensity: isSelected ? 0.3 : (hovered ? 0.2 : 0),
  }

  return (
    <mesh {...meshProps}>
      {shape.type === 'cube' && <boxGeometry args={[0.8, 0.8, 0.8]} />}
      {shape.type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
      {shape.type === 'cone' && <coneGeometry args={[0.5, 1, 8]} />}
      {shape.type === 'cylinder' && <cylinderGeometry args={[0.4, 0.4, 1, 16]} />}
      {shape.type === 'torus' && <torusGeometry args={[0.4, 0.2, 16, 32]} />}
      <meshStandardMaterial {...materialProps} />
    </mesh>
  )
}

export default function GeometryGame({ onGameComplete, onBack }: GeometryGameProps) {
  const [score, setScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [targetShape, setTargetShape] = useState<Shape | null>(null)
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const [totalRounds] = useState(10)

  const shapes: Shape[] = [
    { id: '1', name: 'Cube', type: 'cube', color: '#ef4444', position: [-2, 0, 0] },
    { id: '2', name: 'Sphere', type: 'sphere', color: '#3b82f6', position: [-1, 0, 0] },
    { id: '3', name: 'Cone', type: 'cone', color: '#10b981', position: [0, 0, 0] },
    { id: '4', name: 'Cylinder', type: 'cylinder', color: '#f59e0b', position: [1, 0, 0] },
    { id: '5', name: 'Torus', type: 'torus', color: '#8b5cf6', position: [2, 0, 0] },
  ]

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setCurrentRound(1)
    generateNewRound()
  }

  const generateNewRound = () => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
    setTargetShape(randomShape)
    setSelectedShape(null)
    setFeedback(null)
  }

  const handleShapeClick = (shapeId: string) => {
    if (feedback || !targetShape) return

    setSelectedShape(shapeId)
    const isCorrect = shapeId === targetShape.id

    setFeedback({
      message: isCorrect ? `Correct! That's a ${targetShape.name}! 🎉` : `Wrong! That's not a ${targetShape.name}`,
      isCorrect
    })

    if (isCorrect) {
      setScore(score + 10)
    }

    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound(currentRound + 1)
        generateNewRound()
      } else {
        setGameActive(false)
        onGameComplete(score + (isCorrect ? 10 : 0))
      }
    }, 2000)
  }

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📐</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shape Recognition</h1>
            <p className="text-gray-600">Identify the correct 3D shapes to test your geometry knowledge!</p>
          </div>

          {score > 0 && (
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Your Results</h3>
              <div className="space-y-1 text-green-800">
                <p>Final Score: {score}</p>
                <p>Accuracy: {Math.round((score / (totalRounds * 10)) * 100)}%</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {score > 0 ? 'Play Again' : 'Start Game'}
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Globe
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Exit Game
          </button>
          <div className="flex gap-4">
            <div className="text-sm font-medium text-green-600">
              Score: {score}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Round: {currentRound}/{totalRounds}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Find the Shape!</h2>

            {targetShape && (
              <div className="mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  Click on the:
                </div>
                <div className="text-5xl font-bold text-gray-800 mb-4">
                  {targetShape.name}
                </div>
                <div className="text-gray-600">
                  Look at the 3D shapes on the right and click on the {targetShape.name.toLowerCase()}!
                </div>
              </div>
            )}

            {/* Shape Guide */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Shape Reference:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded"></div>
                  <span className="text-gray-700">Cube - 6 equal square faces</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Sphere - Perfectly round</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-green-500"></div>
                  <span className="text-gray-700">Cone - Circular base, pointed top</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                  <span className="text-gray-700">Cylinder - Circular bases, straight sides</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-4 border-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Torus - Donut shape</span>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`mt-6 p-4 rounded-lg ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.message}
              </div>
            )}
          </div>

          {/* 3D Shapes Canvas */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="h-96">
              <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} />

                {shapes.map((shape) => (
                  <ShapeMesh
                    key={shape.id}
                    shape={shape}
                    isSelected={selectedShape === shape.id}
                    onClick={() => handleShapeClick(shape.id)}
                  />
                ))}

                <OrbitControls
                  enablePan={false}
                  minDistance={4}
                  maxDistance={10}
                  autoRotate
                  autoRotateSpeed={1}
                />
              </Canvas>
            </div>
            <div className="text-center text-sm text-gray-600 mt-4">
              Click and drag to rotate • Scroll to zoom • Click on shapes to select
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}