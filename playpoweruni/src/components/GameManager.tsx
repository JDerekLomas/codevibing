'use client'

import { useState } from 'react'
import Universe from './Universe'
import SidePanel from './SidePanel'
import TypingGame from './games/TypingGame'
import HUD from './HUD'
import { learningDomains } from '@/data/domains'
import { LearningDomain, GameState } from '@/data/types'

type View = 'globe' | 'game'

export default function GameManager() {
  const [currentView, setCurrentView] = useState<View>('globe')
  const [selectedDomain, setSelectedDomain] = useState<LearningDomain | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    score: 0,
    completedGames: [],
    unlockedDomains: ['numbers', 'people'], // Start with easy domains unlocked
  })
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'processing'>('online')

  const handleDomainClick = (domain: LearningDomain) => {
    if (!gameState.unlockedDomains.includes(domain.id)) {
      // Domain is locked - could show a locked message in future
      return
    }

    setSelectedDomain(domain)
    setSystemStatus('processing')
    setTimeout(() => setSystemStatus('online'), 1000)
  }

  const handleStartGame = () => {
    setCurrentView('game')
    setSystemStatus('processing')
  }

  const handleGameComplete = (score: number) => {
    const newScore = gameState.score + score
    const completedGames = [...gameState.completedGames, selectedDomain!.id]
    const unlockedDomains = [...gameState.unlockedDomains]

    // Unlock new domains based on score
    if (newScore >= 50 && !unlockedDomains.includes('geometry')) {
      unlockedDomains.push('geometry')
    }
    if (newScore >= 100 && !unlockedDomains.includes('history')) {
      unlockedDomains.push('history')
    }
    if (newScore >= 200 && !unlockedDomains.includes('ai')) {
      unlockedDomains.push('ai')
    }

    setGameState({
      currentGame: null,
      score: newScore,
      completedGames,
      unlockedDomains,
    })

    // Return to globe after a short delay
    setTimeout(() => {
      setCurrentView('globe')
      setSelectedDomain(null)
    }, 3000)
  }

  const handleBackToGlobe = () => {
    setCurrentView('globe')
    setSelectedDomain(null)
  }

  if (currentView === 'game' && selectedDomain) {
    return (
      <TypingGame
        domain={selectedDomain}
        onGameComplete={handleGameComplete}
        onBack={handleBackToGlobe}
      />
    )
  }

  return (
    <div className="relative w-full h-screen tron-grid-bg">
      {/* 3D Universe */}
      <Universe
        domains={learningDomains.map(domain => ({
          ...domain,
          color: gameState.completedGames.includes(domain.id)
            ? '#00ffff'
            : gameState.unlockedDomains.includes(domain.id)
            ? domain.color
            : '#333333'
        }))}
        onDomainClick={handleDomainClick}
        selectedDomain={selectedDomain?.id}
      />

      {/* Side Panel */}
      <SidePanel
        domain={selectedDomain}
        onStartGame={handleStartGame}
      />

      {/* Comprehensive HUD */}
      <HUD
        score={gameState.score}
        completedSectors={gameState.completedGames.length}
        totalSectors={learningDomains.length}
        currentSector={selectedDomain?.id}
        systemStatus={systemStatus}
      />
    </div>
  )
}