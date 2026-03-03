'use client'

import { LearningDomain } from '@/data/types'
import { soundManager } from '@/lib/sounds'

interface SidePanelProps {
  domain: LearningDomain | null
  onStartGame: () => void
}

export default function SidePanel({ domain, onStartGame }: SidePanelProps) {
  const handleStartGame = () => {
    if (domain) {
      soundManager.playSound('success')
      onStartGame()
    }
  }

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-gray-900 via-gray-800 to-black border-l-2 border-tron-orange shadow-2xl z-50 tron-border pulse-glow">
      {/* Tron Grid Background */}
      <div className="absolute inset-0 tron-grid-bg opacity-20"></div>

      {/* Panel Header */}
      <div className="relative bg-gradient-to-r from-tron-orange via-tron-cyan to-tron-blue p-6 border-b-2 border-tron-cyan">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="text-center mt-2 relative z-10">
          {domain ? (
            <>
              <div className="text-5xl mb-3 animate-pulse tron-text tron-glitch">{domain.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2 tron-text tron-glitch">{domain.name}</h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-tron-cyan to-transparent animate-pulse"></div>
              <div className="text-xs text-tron-cyan mt-2 font-bold tracking-widest tron-text console-text">SYSTEM PROTOCOL</div>
              <div className="mt-2 text-xs text-tron-cyan console-text cursor-blink">&gt; SECTOR_UNLOCKED</div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3 tron-text tron-glitch">◆</div>
              <h2 className="text-2xl font-bold text-white mb-2 tron-text tron-glitch">SELECT SECTOR</h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-tron-cyan to-transparent"></div>
              <div className="text-xs text-tron-cyan mt-2 font-bold tracking-widest tron-text console-text">CHOOSE DESTINATION</div>
              <div className="mt-2 text-xs text-yellow-400 console-text cursor-blink">&gt; AWAITING_SELECTION</div>
            </>
          )}
        </div>
      </div>

      {/* Panel Content */}
      <div className="p-6 text-white h-full overflow-y-auto relative z-10">
        {domain ? (
          <>
            <div className="mb-8 bg-black/50 rounded p-4 border border-tron-cyan/30">
              <h3 className="text-lg font-semibold text-tron-cyan mb-3 tron-text console-text text-center">SYSTEM ANALYSIS</h3>
              <p className="text-gray-300 leading-relaxed console-text text-justify text-sm">{domain.description}</p>
            </div>

            <div className="mb-8 bg-black/50 rounded p-4 border border-tron-orange/30">
              <h3 className="text-lg font-semibold text-tron-cyan mb-3 tron-text console-text text-center">DIFFICULTY MATRIX</h3>
              <div className="flex items-center gap-2">
                {domain.difficulty === 'easy' && (
                  <>
                    <span className="text-tron-orange">■</span>
                    <span className="text-tron-orange">■</span>
                    <span className="text-gray-600">■</span>
                    <span className="text-gray-600">■</span>
                    <span className="text-gray-600">■</span>
                    <span className="text-tron-orange ml-2 font-bold">ROOKIE</span>
                  </>
                )}
                {domain.difficulty === 'medium' && (
                  <>
                    <span className="text-tron-cyan">■</span>
                    <span className="text-tron-cyan">■</span>
                    <span className="text-tron-cyan">■</span>
                    <span className="text-gray-600">■</span>
                    <span className="text-gray-600">■</span>
                    <span className="text-tron-cyan ml-2 font-bold">VETERAN</span>
                  </>
                )}
                {domain.difficulty === 'hard' && (
                  <>
                    <span className="text-red-500">■</span>
                    <span className="text-red-500">■</span>
                    <span className="text-red-500">■</span>
                    <span className="text-red-500">■</span>
                    <span className="text-red-500">■</span>
                    <span className="text-red-500 ml-2 font-bold">ELITE</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-8 bg-black/50 rounded p-4 border border-tron-orange/30">
              <h3 className="text-lg font-semibold text-tron-cyan mb-3 tron-text console-text text-center">TRAINING PROTOCOLS</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-300 console-text">
                  <span className="text-tron-orange">◆</span>
                  <span>&gt; Neural Link Speed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 console-text">
                  <span className="text-tron-orange">◆</span>
                  <span>&gt; Data Stream Accuracy</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 console-text">
                  <span className="text-tron-orange">◆</span>
                  <span>&gt; Network Integration</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-tron-orange via-tron-cyan to-tron-blue hover:from-tron-orange hover:via-tron-cyan hover:to-tron-blue text-white font-bold py-4 px-6 rounded-lg border-2 border-tron-cyan shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 tron-border tron-glitch"
            >
              <span className="text-lg tron-text console-text">INITIALIZE</span>
              <div className="text-sm mt-1 console-text">SYSTEM ACTIVATION</div>
            </button>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-tron-cyan mb-3 tron-text">MAIN TERMINAL</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Access the digital grid and select a sector to begin your training protocol.
              </p>
              <p className="text-gray-400 text-sm">
                Each sector contains unique data streams and learning matrices.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div className="bg-gray-800/50 border border-tron-orange/30 rounded-lg p-4 tron-border">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-tron-blue">◆</span>
                  <span className="font-semibold text-white">Numbers Sector</span>
                </div>
                <div className="text-xs text-gray-400">Mathematical algorithms and calculations</div>
              </div>

              <div className="bg-gray-800/50 border border-tron-cyan/30 rounded-lg p-4 tron-border">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-tron-cyan">◆</span>
                  <span className="font-semibold text-white">Geometry Sector</span>
                </div>
                <div className="text-xs text-gray-400">Spatial matrices and shape algorithms</div>
              </div>

              <div className="bg-gray-800/50 border border-tron-orange/30 rounded-lg p-4 tron-border">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-tron-orange">◆</span>
                  <span className="font-semibold text-white">People Sector</span>
                </div>
                <div className="text-xs text-gray-400">Social network protocols and empathy</div>
              </div>

              <div className="bg-gray-800/50 border border-tron-blue/30 rounded-lg p-4 tron-border">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-tron-orange">◆</span>
                  <span className="font-semibold text-white">AI Sector</span>
                </div>
                <div className="text-xs text-gray-400">Machine learning and neural networks</div>
              </div>

              <div className="bg-gray-800/50 border border-red-500/30 rounded-lg p-4 tron-border">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-red-500">◆</span>
                  <span className="font-semibold text-white">History Sector</span>
                </div>
                <div className="text-xs text-gray-400">Timeline protocols and data archives</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tron Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 left-0 w-1 h-24 bg-gradient-to-b from-transparent via-tron-orange to-transparent opacity-80"></div>
      <div className="absolute top-3/4 left-0 w-1 h-16 bg-gradient-to-t from-transparent via-tron-cyan to-transparent opacity-80"></div>
      <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-tron-blue to-transparent opacity-60"></div>
    </div>
  )
}