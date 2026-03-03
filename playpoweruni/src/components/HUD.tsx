'use client'

import { useState, useEffect } from 'react'

interface HUDProps {
  score: number
  completedSectors: number
  totalSectors: number
  currentSector?: string
  systemStatus: 'online' | 'offline' | 'processing'
}

export default function HUD({ score, completedSectors, totalSectors, currentSector, systemStatus }: HUDProps) {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dataStream, setDataStream] = useState('INITIALIZING...')
  const [matrixData, setMatrixData] = useState('01010100')

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const dataStreams = [
      'SCANNING_SECTORS...',
      'ANALYZING_DATA...',
      'CALCULATING_SCORE...',
      'UPDATING_PROFILES...',
      'SYNCHRONIZING_GRID...',
      'OPTIMIZING_NEURAL_LINKS...',
      'PROCESSING_PROTOCOLS...',
      'VALIDATING_TRANSMISSIONS...'
    ]

    let index = 0
    const streamInterval = setInterval(() => {
      setDataStream(dataStreams[index % dataStreams.length])
      index++
    }, 2000)

    return () => clearInterval(streamInterval)
  }, [])

  useEffect(() => {
    const matrixInterval = setInterval(() => {
      const binary = Math.random().toString(2).substring(2, 10)
      setMatrixData(binary.padEnd(8, '0'))
    }, 1000)

    return () => clearInterval(matrixInterval)
  }, [])

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'online': return 'text-green-400'
      case 'offline': return 'text-red-400'
      case 'processing': return 'text-yellow-400'
      default: return 'text-tron-cyan'
    }
  }

  return (
    <>
      {/* Top Left HUD */}
      <div className="fixed top-4 left-4 z-40">
        <div className="bg-black/80 border border-tron-cyan/50 rounded p-4 tron-border pulse-glow backdrop-blur-sm min-w-[250px]">
          <div className="console-text text-tron-cyan text-xs font-bold mb-2 text-center">
            &gt; SYSTEM_STATUS: <span className={getStatusColor()}>{systemStatus.toUpperCase()}</span>
          </div>
          <div className="console-text text-white text-lg font-bold mb-1 text-center">
            SCORE: <span className="text-tron-orange">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="console-text text-tron-cyan text-xs text-center">
            &gt; SECTORS_UNLOCKED: <span className="text-white">{completedSectors}/{totalSectors}</span>
          </div>
          {currentSector && (
            <div className="console-text text-tron-orange text-xs mt-2 text-center">
              &gt; ACTIVE_SECTOR: {currentSector.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Top Right HUD - System Info */}
      <div className="fixed top-4 right-4 z-40">
        <div className="bg-black/80 border border-tron-orange/50 rounded p-4 tron-border backdrop-blur-sm min-w-[200px]">
          <div className="console-text text-tron-cyan text-xs font-bold mb-2 text-center">
            &gt; GRID_INTERFACE v2.0.1
          </div>
          <div className="console-text text-white text-xs mb-1 text-center">
            &gt; TIME: {mounted ? currentTime.toLocaleTimeString() : 'INITIALIZING...'}
          </div>
          <div className="console-text text-white text-xs text-center">
            &gt; DATE: {mounted ? currentTime.toLocaleDateString() : 'LOADING...'}
          </div>
        </div>
      </div>

      {/* Center Top HUD - Title */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/80 border border-tron-orange/50 rounded px-6 py-3 tron-border border-flow backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-tron-cyan tron-glitch tracking-wider text-shimmer">
              PLAYPOWER GRID
            </h1>
            <div className="text-xs text-tron-orange mt-1 tracking-widest console-text">
              DIGITAL LEARNING SYSTEM
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left HUD - Data Stream */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="bg-black/80 border border-tron-cyan/50 rounded p-4 tron-border backdrop-blur-sm min-w-[200px]">
          <div className="console-text text-tron-cyan text-xs font-bold mb-2 text-center">
            &gt; DATA_STREAM
          </div>
          <div className="console-text text-white text-xs cursor-blink text-center">
            {dataStream}
          </div>
        </div>
      </div>

      {/* Bottom Right HUD - Matrix Display */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-black/80 border border-green-400/50 rounded p-4 tron-border backdrop-blur-sm min-w-[150px]">
          <div className="console-text text-green-400 text-xs font-bold mb-2 text-center">
            &gt; NEURAL_MATRIX
          </div>
          <div className="console-text text-green-400 text-xs text-center">
            [{matrixData}]
          </div>
        </div>
      </div>

      {/* Matrix Rain Effects */}
      <div className="matrix-rain" style={{ left: '10%', animationDelay: '0s' }}>01010100</div>
      <div className="matrix-rain" style={{ left: '25%', animationDelay: '2s' }}>11101011</div>
      <div className="matrix-rain" style={{ left: '40%', animationDelay: '4s' }}>00110101</div>
      <div className="matrix-rain" style={{ left: '55%', animationDelay: '1s' }}>10101101</div>
      <div className="matrix-rain" style={{ left: '70%', animationDelay: '3s' }}>01011010</div>
      <div className="matrix-rain" style={{ left: '85%', animationDelay: '5s' }}>11001100</div>

      {/* Data Stream Effects */}
      <div className="data-stream" style={{ top: '20%', animationDelay: '0s' }}>[DATA_PACKET_001]</div>
      <div className="data-stream" style={{ top: '40%', animationDelay: '1.5s' }}>[NEURAL_SYNC_002]</div>
      <div className="data-stream" style={{ top: '60%', animationDelay: '3s' }}>[GRID_UPDATE_003]</div>
      <div className="data-stream" style={{ top: '80%', animationDelay: '4.5s' }}>[PROTOCOL_004]</div>

      {/* Ambient Glitches */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
        <div className="text-red-500 text-4xl font-bold opacity-0 tron-glitch">
          ERROR: DATA_CORRUPTION_DETECTED
        </div>
      </div>

      {/* System Scans */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tron-orange to-transparent pointer-events-none z-20"
           style={{ animation: 'data-stream 4s linear infinite' }}></div>
      <div className="fixed top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tron-cyan to-transparent pointer-events-none z-20"
           style={{ animation: 'data-stream 6s linear infinite', animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent pointer-events-none z-20"
           style={{ animation: 'data-stream 5s linear infinite', animationDelay: '1s' }}></div>
      <div className="fixed top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent pointer-events-none z-20"
           style={{ animation: 'data-stream 7s linear infinite', animationDelay: '3s' }}></div>
    </>
  )
}