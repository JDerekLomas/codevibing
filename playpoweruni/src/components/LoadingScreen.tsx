'use client'

import { useState, useEffect, useMemo } from 'react'

export default function LoadingScreen() {
  const [loadingText, setLoadingText] = useState('Initializing PlayPower University...')
  const [progress, setProgress] = useState(0)

  const loadingMessages = useMemo(() => [
    'Loading educational content...',
    'Preparing 3D globe...',
    'Setting up mini-games...',
    'Almost ready...',
    'Let the learning begin!'
  ], [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const messageInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 600)

    return () => {
      clearInterval(interval)
      clearInterval(messageInterval)
    }
  }, [loadingMessages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-5xl font-bold text-white mb-2">PlayPower University</h1>
          <p className="text-xl text-blue-200">Educational Games for Curious Minds</p>
        </div>

        {/* Loading Progress */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/20 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white text-lg">{loadingText}</p>
          <p className="text-blue-200 text-sm mt-2">{progress}%</p>
        </div>

        {/* Loading Animation */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}