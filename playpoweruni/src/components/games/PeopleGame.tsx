'use client'

import { useState, useEffect } from 'react'

interface PeopleGameProps {
  onGameComplete: (score: number) => void
  onBack: () => void
}

interface Emotion {
  emoji: string
  name: string
  description: string
  scenarios: string[]
}

const emotions: Emotion[] = [
  {
    emoji: '😊',
    name: 'Happy',
    description: 'Feeling joyful and pleased',
    scenarios: [
      'You just received a gift you really wanted',
      'You got a good grade on a test',
      'Your friend told you a funny joke'
    ]
  },
  {
    emoji: '😢',
    name: 'Sad',
    description: 'Feeling unhappy or sorrowful',
    scenarios: [
      'Your pet ran away from home',
      'You said goodbye to a moving friend',
      'You lost your favorite toy'
    ]
  },
  {
    emoji: '😡',
    name: 'Angry',
    description: 'Feeling mad or frustrated',
    scenarios: [
      'Someone took your things without asking',
      'You were blamed for something you didn&apos;t do',
      'Your team lost an important game'
    ]
  },
  {
    emoji: '😨',
    name: 'Scared',
    description: 'Feeling afraid or frightened',
    scenarios: [
      'You heard a strange noise at night',
      'You have to speak in front of many people',
      'You\'re lost and don\'t know where to go'
    ]
  },
  {
    emoji: '😲',
    name: 'Surprised',
    description: 'Feeling amazed or shocked',
    scenarios: [
      'You found an unexpected surprise party',
      'You saw something amazing happen suddenly',
      'You received unexpected good news'
    ]
  },
  {
    emoji: '🤔',
    name: 'Thinking',
    description: 'Feeling puzzled or deep in thought',
    scenarios: [
      'You\'re trying to solve a difficult problem',
      'You\'re making an important decision',
      'You\'re trying to remember something important'
    ]
  }
]

export default function PeopleGame({ onGameComplete, onBack }: PeopleGameProps) {
  const [score, setScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [currentScenario, setCurrentScenario] = useState<string>('')
  const [correctEmotion, setCorrectEmotion] = useState<Emotion | null>(null)
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const [totalRounds] = useState(8)

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setCurrentRound(1)
    generateNewRound()
  }

  const generateNewRound = () => {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    const randomScenario = randomEmotion.scenarios[Math.floor(Math.random() * randomEmotion.scenarios.length)]

    setCorrectEmotion(randomEmotion)
    setCurrentScenario(randomScenario)
    setSelectedEmotion(null)
    setFeedback(null)
  }

  const handleEmotionSelect = (emotionName: string) => {
    if (feedback || !correctEmotion) return

    setSelectedEmotion(emotionName)
    const isCorrect = emotionName === correctEmotion.name

    setFeedback({
      message: isCorrect
        ? `Correct! ${correctEmotion.emoji} ${correctEmotion.name} is the right emotion! 🎉`
        : `Not quite! ${correctEmotion.emoji} ${correctEmotion.name} would be more appropriate here.`,
      isCorrect
    })

    if (isCorrect) {
      setScore(score + 12.5) // 100 points / 8 rounds
    }

    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound(currentRound + 1)
        generateNewRound()
      } else {
        setGameActive(false)
        onGameComplete(score + (isCorrect ? 12.5 : 0))
      }
    }, 3000)
  }

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👥</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Emotion Detective</h1>
            <p className="text-gray-600">Learn to understand emotions and social situations!</p>
          </div>

          {score > 0 && (
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-orange-900 mb-2">Your Results</h3>
              <div className="space-y-1 text-orange-800">
                <p>Final Score: {Math.round(score)}</p>
                <p>Emotions Mastered: {Math.round(score / 12.5)}/{totalRounds}</p>
                <p>Accuracy: {Math.round((score / (totalRounds * 12.5)) * 100)}%</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Exit Game
          </button>
          <div className="flex gap-4">
            <div className="text-sm font-medium text-orange-600">
              Score: {Math.round(score)}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Round: {currentRound}/{totalRounds}
            </div>
          </div>
        </div>

        {/* Scenario */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How would you feel?</h2>
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <div className="text-xl text-blue-900 leading-relaxed">
              {currentScenario}
            </div>
          </div>

          {/* Emotion Options */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {emotions.map((emotion) => (
              <button
                key={emotion.name}
                onClick={() => handleEmotionSelect(emotion.name)}
                disabled={selectedEmotion !== null}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedEmotion === emotion.name
                    ? feedback?.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : selectedEmotion !== null
                    ? 'border-gray-200 bg-gray-50 opacity-50'
                    : 'border-orange-200 bg-white hover:border-orange-400 hover:bg-orange-50'
                }`}
              >
                <div className="text-5xl mb-2">{emotion.emoji}</div>
                <div className="font-semibold text-gray-800">{emotion.name}</div>
                <div className="text-xs text-gray-600 mt-1">{emotion.description}</div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-lg ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {feedback.message}
            </div>
          )}

          {/* Learning Tip */}
          {feedback && correctEmotion && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Learning tip:</strong> {correctEmotion.emoji} {correctEmotion.name} is when you&apos;re {correctEmotion.description.toLowerCase()}.
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3">
          <div
            className="bg-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}