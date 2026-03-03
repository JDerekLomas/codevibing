'use client'

import { useState, useEffect, useRef } from 'react'
import { LearningDomain } from '@/data/types'
import { soundManager } from '@/lib/sounds'

interface TypingGameProps {
  domain: LearningDomain
  onGameComplete: (score: number) => void
  onBack: () => void
}

interface TypingChallenge {
  id: string
  text: string
  translation: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
  points: number
}

const getChallengesForDomain = (domainId: string): TypingChallenge[] => {
  const comprehensiveChallenges = {
    numbers: [
      { id: '1', text: 'The sum of 15 and 27 equals 42', translation: '15 + 27 = 42', difficulty: 'easy' as const, timeLimit: 15, points: 10 },
      { id: '2', text: 'The difference between 50 and 23 is 27', translation: '50 - 23 = 27', difficulty: 'easy' as const, timeLimit: 12, points: 10 },
      { id: '3', text: 'Multiplication distributes over addition in algebra', translation: 'a × (b + c) = a × b + a × c', difficulty: 'medium' as const, timeLimit: 20, points: 20 },
      { id: '4', text: 'The derivative of x squared with respect to x is 2x', translation: 'd/dx(x²) = 2x', difficulty: 'hard' as const, timeLimit: 25, points: 30 },
      { id: '5', text: 'Integration calculates the area under a curve', translation: '∫f(x)dx = area under curve', difficulty: 'hard' as const, timeLimit: 28, points: 35 },
      { id: '6', text: 'The golden ratio φ equals approximately 1.6180339', translation: 'φ ≈ 1.618', difficulty: 'medium' as const, timeLimit: 18, points: 20 },
      { id: '7', text: 'Prime numbers have exactly two positive divisors', translation: 'Prime: 1 and itself only', difficulty: 'easy' as const, timeLimit: 14, points: 12 },
      { id: '8', text: 'Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34', translation: 'F(n) = F(n-1) + F(n-2)', difficulty: 'medium' as const, timeLimit: 22, points: 25 },
      { id: '9', text: 'The quadratic formula solves ax² + bx + c = 0', translation: 'x = (-b ± √(b²-4ac)) / 2a', difficulty: 'hard' as const, timeLimit: 30, points: 35 },
      { id: '10', text: 'Eulers number e equals approximately 2.71828', translation: 'e ≈ 2.71828', difficulty: 'medium' as const, timeLimit: 16, points: 18 },
    ],
    geometry: [
      { id: '1', text: 'A triangle has three sides and three interior angles', translation: 'Triangle: 3 sides, 3 angles', difficulty: 'easy' as const, timeLimit: 15, points: 10 },
      { id: '2', text: 'The Pythagorean theorem: a² + b² = c² for right triangles', translation: 'Right triangle: a² + b² = c²', difficulty: 'medium' as const, timeLimit: 20, points: 20 },
      { id: '3', text: 'Pi equals approximately 3.14159265358979', translation: 'π ≈ 3.14159', difficulty: 'medium' as const, timeLimit: 15, points: 15 },
      { id: '4', text: 'A regular hexagon has six equal sides and six equal angles', translation: 'Hexagon: 6 equal sides', difficulty: 'easy' as const, timeLimit: 18, points: 12 },
      { id: '5', text: 'The area of a circle equals π times radius squared', translation: 'Area = π × r²', difficulty: 'medium' as const, timeLimit: 18, points: 20 },
      { id: '6', text: 'A rectangle has opposite sides that are parallel and equal', translation: 'Rectangle: opposite sides =', difficulty: 'easy' as const, timeLimit: 14, points: 10 },
      { id: '7', text: 'The sum of interior angles in any triangle equals 180 degrees', translation: 'Triangle angles sum to 180°', difficulty: 'medium' as const, timeLimit: 20, points: 18 },
      { id: '8', text: 'The volume of a sphere is four-thirds pi r cubed', translation: 'V = 4/3 πr³', difficulty: 'hard' as const, timeLimit: 25, points: 30 },
      { id: '9', text: 'Parallel lines never intersect in Euclidean geometry', translation: 'Parallel lines: never meet', difficulty: 'medium' as const, timeLimit: 16, points: 15 },
      { id: '10', text: 'Tangent lines touch circles at exactly one point', translation: 'Tangent: 1 touch point', difficulty: 'medium' as const, timeLimit: 18, points: 18 },
    ],
    people: [
      { id: '1', text: 'Empathy means understanding and sharing others feelings', translation: 'Empathy = feeling with others', difficulty: 'easy' as const, timeLimit: 15, points: 10 },
      { id: '2', text: 'Active listening involves full attention and understanding', translation: 'Listen: focus, understand, respond', difficulty: 'medium' as const, timeLimit: 18, points: 15 },
      { id: '3', text: 'Communication requires both speaking and listening skills', translation: 'Communication = send + receive', difficulty: 'easy' as const, timeLimit: 20, points: 12 },
      { id: '4', text: 'Emotional intelligence helps build better relationships', translation: 'EQ improves social connections', difficulty: 'medium' as const, timeLimit: 22, points: 20 },
      { id: '5', text: 'Body language often communicates more than spoken words', translation: 'Non-verbal > verbal signals', difficulty: 'hard' as const, timeLimit: 25, points: 25 },
      { id: '6', text: 'Cultural awareness helps bridge different social perspectives', translation: 'Culture awareness = empathy + respect', difficulty: 'medium' as const, timeLimit: 20, points: 18 },
      { id: '7', text: 'Conflict resolution requires active listening and compromise', translation: 'Resolution = listen + compromise', difficulty: 'medium' as const, timeLimit: 24, points: 22 },
      { id: '8', text: 'Social intelligence involves navigating group dynamics', translation: 'Social IQ = group navigation', difficulty: 'hard' as const, timeLimit: 26, points: 30 },
      { id: '9', text: 'Trust is built through consistent actions over time', translation: 'Trust = consistency + integrity', difficulty: 'medium' as const, timeLimit: 18, points: 16 },
      { id: '10', text: 'Active participation enhances team collaboration and innovation', translation: 'Participation = collaboration + innovation', difficulty: 'easy' as const, timeLimit: 20, points: 14 },
    ],
    ai: [
      { id: '1', text: 'Artificial intelligence mimics human cognitive functions', translation: 'AI simulates human thinking', difficulty: 'easy' as const, timeLimit: 18, points: 12 },
      { id: '2', text: 'Machine learning uses data patterns to improve performance', translation: 'ML learns from data patterns', difficulty: 'medium' as const, timeLimit: 22, points: 20 },
      { id: '3', text: 'Neural networks are inspired by biological brain structures', translation: 'Neural nets mimic brain neurons', difficulty: 'medium' as const, timeLimit: 20, points: 18 },
      { id: '4', text: 'Deep learning utilizes multiple hidden neural network layers', translation: 'Deep learning = many neural layers', difficulty: 'hard' as const, timeLimit: 25, points: 30 },
      { id: '5', text: 'Algorithms provide step by step problem solving instructions', translation: 'Algorithm = step-by-step process', difficulty: 'easy' as const, timeLimit: 20, points: 15 },
      { id: '6', text: 'Natural language processing enables human-computer conversation', translation: 'NLP = human-AI conversation', difficulty: 'medium' as const, timeLimit: 24, points: 22 },
      { id: '7', text: 'Computer vision allows machines to interpret visual information', translation: 'CV = machine visual interpretation', difficulty: 'medium' as const, timeLimit: 22, points: 20 },
      { id: '8', text: 'Supervised learning uses labeled training data for guidance', translation: 'Supervised = labeled training data', difficulty: 'medium' as const, timeLimit: 20, points: 18 },
      { id: '9', text: 'Reinforcement learning learns through reward and punishment', translation: 'RL = reward-based learning', difficulty: 'hard' as const, timeLimit: 28, points: 32 },
      { id: '10', text: 'Artificial general intelligence aims for human-like versatility', translation: 'AGI = human-level versatility', difficulty: 'hard' as const, timeLimit: 30, points: 35 },
    ],
    history: [
      { id: '1', text: 'The Ancient Egyptians built the Great Pyramids of Giza', translation: 'Egyptians built the pyramids', difficulty: 'easy' as const, timeLimit: 15, points: 10 },
      { id: '2', text: 'The Renaissance began in fourteenth century Italy', translation: 'Renaissance started in 14th century Italy', difficulty: 'medium' as const, timeLimit: 20, points: 18 },
      { id: '3', text: 'World War Two ended in nineteen forty five', translation: 'WWII ended in 1945', difficulty: 'easy' as const, timeLimit: 18, points: 12 },
      { id: '4', text: 'The Industrial Revolution transformed manufacturing processes', translation: 'Industrial Revolution changed factories', difficulty: 'medium' as const, timeLimit: 22, points: 20 },
      { id: '5', text: 'The printing press revolutionized information sharing globally', translation: 'Printing press spread knowledge worldwide', difficulty: 'hard' as const, timeLimit: 25, points: 25 },
      { id: '6', text: 'The fall of the Roman Empire occurred in 476 AD', translation: 'Roman Empire fell in 476 AD', difficulty: 'medium' as const, timeLimit: 18, points: 18 },
      { id: '7', text: 'The American Revolution established the United States independence', translation: 'American Revolution created US independence', difficulty: 'medium' as const, timeLimit: 22, points: 20 },
      { id: '8', text: 'The Cold War defined twentieth century geopolitics', translation: 'Cold War shaped 20th century politics', difficulty: 'medium' as const, timeLimit: 20, points: 18 },
      { id: '9', text: 'The Internet emerged from ARPANET in the late 1960s', translation: 'Internet evolved from ARPANET in 1960s', difficulty: 'hard' as const, timeLimit: 24, points: 28 },
      { id: '10', text: 'Space exploration began with the Soviet Sputnik launch', translation: 'Space race started with Sputnik', difficulty: 'medium' as const, timeLimit: 18, points: 20 },
    ]
  }

  return comprehensiveChallenges[domainId as keyof typeof comprehensiveChallenges] || comprehensiveChallenges.numbers
}

export default function TypingGame({ domain, onGameComplete, onBack }: TypingGameProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu')
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const challenges = getChallengesForDomain(domain.id)
  const currentChallenge = challenges[currentChallengeIndex]

  useEffect(() => {
    if (gameState === 'playing' && isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp()
    }
  }, [timeLeft, gameState, isTimerActive])

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameState, currentChallengeIndex])

  const startGame = () => {
    setGameState('playing')
    setCurrentChallengeIndex(0)
    setUserInput('')
    setScore(0)
    setCompletedChallenges([])
    setMistakes(0)
    setTimeLeft(30)
    setStartTime(Date.now())
    setIsTimerActive(true)
    soundManager.playSound('success')
  }

  const handleTimeUp = () => {
    setIsTimerActive(false)
    if (currentChallengeIndex < challenges.length - 1) {
      // Move to next challenge
      setCurrentChallengeIndex(currentChallengeIndex + 1)
      setUserInput('')
      setTimeLeft(30)
      setIsTimerActive(true)
    } else {
      // Game over
      endGame()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Check for mistakes
    if (value.length > userInput.length) {
      const newChar = value[value.length - 1]
      const expectedChar = currentChallenge.text[value.length - 1]
      if (newChar !== expectedChar) {
        setMistakes(mistakes + 1)
        soundManager.playSound('error')
      }
    }

    setUserInput(value)

    // Check if completed
    if (value === currentChallenge.text) {
      handleChallengeComplete()
    }
  }

  const handleChallengeComplete = () => {
    soundManager.playSound('complete')
    const timeBonus = Math.max(0, timeLeft * 2)
    const challengeScore = currentChallenge.points + timeBonus
    setScore(score + challengeScore)
    setCompletedChallenges([...completedChallenges, currentChallenge.id])

    // Move to next challenge after a short delay
    setTimeout(() => {
      if (currentChallengeIndex < challenges.length - 1) {
        setCurrentChallengeIndex(currentChallengeIndex + 1)
        setUserInput('')
        setTimeLeft(30)
        setIsTimerActive(true)
      } else {
        endGame()
      }
    }, 1500)
  }

  const endGame = () => {
    setIsTimerActive(false)
    setGameState('results')
    soundManager.playSound('complete')
  }

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return 'text-gray-600'
    if (userInput[index] === currentChallenge.text[index]) return 'text-green-400 bg-green-900/30'
    return 'text-red-400 bg-red-900/30'
  }

  const getAccuracy = () => {
    const totalChars = userInput.length
    const correctChars = userInput.split('').filter((char, index) =>
      index < currentChallenge.text.length && char === currentChallenge.text[index]
    ).length
    return totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100
  }

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-8 tron-grid-bg">
        <div className="bg-gray-900/90 border-2 border-tron-orange rounded-lg p-8 max-w-2xl w-full tron-border">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-pulse tron-text">{domain.icon}</div>
            <h1 className="text-4xl font-bold text-tron-cyan mb-2 tron-text">{domain.name}</h1>
            <h2 className="text-2xl text-tron-orange mb-4 tron-text">NEURAL INTERFACE</h2>
            <p className="text-gray-300">Initialize data stream transmission protocols</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4">
              <div className="text-cyan-400 text-sm font-bold mb-1">CHALLENGES</div>
              <div className="text-2xl font-bold text-white">{challenges.length}</div>
            </div>
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4">
              <div className="text-cyan-400 text-sm font-bold mb-1">DIFFICULTY</div>
              <div className="text-2xl font-bold text-white uppercase">{domain.difficulty}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-lg border border-cyan-300 transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span className="text-lg">START MISSION</span>
              <div className="text-sm mt-1">ミッション開始</div>
            </button>
            <button
              onClick={onBack}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-4 px-6 rounded-lg border border-gray-600 transition-colors"
            >
              BACK
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'results') {
    const accuracy = getAccuracy()
    const timeBonus = score
    const totalScore = score

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-8">
        <div className="bg-gray-800/90 border-2 border-cyan-400 rounded-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">◆</div>
            <h1 className="text-4xl font-bold text-cyan-300 mb-2 neon-text">MISSION COMPLETE</h1>
            <p className="text-gray-300">Excellent work, agent!</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4">
              <div className="text-cyan-400 text-sm font-bold mb-1">FINAL SCORE</div>
              <div className="text-3xl font-bold text-white neon-text">{totalScore}</div>
            </div>
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4">
              <div className="text-cyan-400 text-sm font-bold mb-1">CHALLENGES COMPLETED</div>
              <div className="text-3xl font-bold text-white">{completedChallenges.length}/{challenges.length}</div>
            </div>
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4">
              <div className="text-cyan-400 text-sm font-bold mb-1">ACCURACY</div>
              <div className="text-3xl font-bold text-white">{accuracy}%</div>
            </div>
            <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4">
              <div className="text-cyan-400 text-sm font-bold mb-1">MISTAKES</div>
              <div className="text-3xl font-bold text-white">{mistakes}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onGameComplete(totalScore)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-lg border border-green-300 transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span className="text-lg">CONTINUE</span>
              <div className="text-sm mt-1">続ける</div>
            </button>
            <button
              onClick={startGame}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-4 px-6 rounded-lg border border-gray-600 transition-colors"
            >
              RETRY
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-cyan-300 transition-colors"
          >
            ← ABORT MISSION
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-cyan-300 neon-text">{domain.name}</h2>
            <div className="text-cyan-500 text-sm">CHALLENGE {currentChallengeIndex + 1}/{challenges.length}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400 neon-text">{score}</div>
            <div className="text-cyan-500 text-xs">SCORE</div>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="text-cyan-400 font-bold">TIME REMAINING</div>
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white neon-text'}`}>
              {timeLeft}s
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 border border-cyan-400/30">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ${
                timeLeft <= 10 ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-400 to-blue-400'
              }`}
              style={{ width: `${(timeLeft / currentChallenge.timeLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Challenge Display */}
        <div className="bg-gray-800/50 border border-cyan-400/50 rounded-lg p-6 mb-6">
          <div className="text-lg text-cyan-300 mb-4">TYPE THE FOLLOWING:</div>
          <div className="text-2xl font-mono leading-relaxed mb-4">
            {currentChallenge.text.split('').map((char, index) => (
              <span key={index} className={`transition-colors duration-150 ${getCharacterClass(index)}`}>
                {char}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-400 italic">{currentChallenge.translation}</div>
        </div>

        {/* Input */}
        <div className="mb-6">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            className="w-full bg-gray-800/70 border-2 border-cyan-400/50 rounded-lg p-4 text-xl font-mono text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:bg-gray-800/90 transition-all"
            disabled={!isTimerActive}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4 text-center">
            <div className="text-cyan-400 text-sm font-bold mb-1">ACCURACY</div>
            <div className="text-xl font-bold text-white">{getAccuracy()}%</div>
          </div>
          <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4 text-center">
            <div className="text-cyan-400 text-sm font-bold mb-1">WPM</div>
            <div className="text-xl font-bold text-white">
              {startTime ? Math.round((userInput.length / 5) / ((Date.now() - startTime) / 60000)) : 0}
            </div>
          </div>
          <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg p-4 text-center">
            <div className="text-cyan-400 text-sm font-bold mb-1">MISTAKES</div>
            <div className="text-xl font-bold text-white">{mistakes}</div>
          </div>
        </div>
      </div>
    </div>
  )
}