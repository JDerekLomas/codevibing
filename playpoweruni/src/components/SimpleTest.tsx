'use client'

import { Canvas } from '@react-three/fiber'
import { Box, OrbitControls } from '@react-three/drei'

function TestBox() {
  return (
    <Box args={[2, 2, 2]} rotation={[0.5, 0.5, 0]}>
      <meshStandardMaterial color="orange" />
    </Box>
  )
}

export default function SimpleTest() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <TestBox />
        <OrbitControls />
      </Canvas>
      <div className="absolute top-4 left-4 bg-black/50 text-white p-4 rounded">
        <h3 className="font-bold mb-2">Three.js Test</h3>
        <p className="text-sm">You should see an orange cube if Three.js is working</p>
      </div>
    </div>
  )
}