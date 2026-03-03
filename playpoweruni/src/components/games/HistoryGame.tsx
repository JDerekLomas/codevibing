'use client'

import { useState, useEffect } from 'react'

interface HistoryGameProps {
  onGameComplete: (score: number) => void
  onBack: () => void
}

interface HistoricalEvent {
  id: string
  year: number
  title: string
  description: string
  category: 'ancient' | 'medieval' | 'modern' | 'recent'
  image: string
}

const historicalEvents: HistoricalEvent[] = [
  {
    id: '1',
    year: 1969,
    title: 'Moon Landing',
    description: 'Neil Armstrong becomes the first person to walk on the moon',
    category: 'recent',
    image: '🚀'
  },
  {
    id: '2',
    year: 1492,
    title: 'Columbus Reaches Americas',
    description: 'Christopher Columbus arrives in the Americas, initiating widespread exploration',
    category: 'medieval',
    image: '⛵'
  },
  {
    id: '3',
    year: 1776,
    title: 'American Independence',
    description: 'The United States declares independence from Great Britain',
    category: 'modern',
    image: '🇺🇸'
  },
  {
    id: '4',
    year: 1969,
    title: 'Woodstock Festival',
    description: 'Famous music festival that defined a generation',
    category: 'recent',
    image: '🎵'
  },
  {
    id: '5',
    year: 753,
    title: 'Founding of Rome',
    description: 'Traditional date for the founding of Rome by Romulus',
    category: 'ancient',
    image: '🏛️'
  },
  {
    id: '6',
    year: 1066,
    title: 'Battle of Hastings',
    description: 'William the Conqueror defeats Harold II to become King of England',
    category: 'medieval',
    image: '⚔️'
  },
  {
    id: '7',
    year: 1945,
    title: 'End of World War II',
    description: 'The surrender of Japan marks the end of World War II',
    category: 'recent',
    image: '🕊️'
  },
  {
    id: '8',
    year: 1215,
    title: 'Magna Carta Signed',
    description: 'King John signs the Magna Carta, limiting royal power',
    category: 'medieval',
    image: '📜'
  },
  {
    id: '9',
    year: 3100,
    title: 'Ancient Egypt Unification',
    description: 'Upper and Lower Egypt are unified under one ruler',
    category: 'ancient',
    image: '👑'
  },
  {
    id: '10',
    year: 1989,
    title: 'Fall of Berlin Wall',
    description: 'The Berlin Wall falls, symbolizing the end of the Cold War',
    category: 'recent',
    image: '🧱'
  },
  {
    id: '11',
    year: 1789,
    title: 'French Revolution',
    description: 'The French Revolution begins, leading to major political changes',
    category: 'modern',
    image: '🗽'
  },
  {
    id: '12',
    year: 476,
    title: 'Fall of Rome',
    description: 'The Western Roman Empire falls, marking the end of ancient Rome',
    category: 'ancient',
    image: '🏰'
  }
]

export default function HistoryGame({ onGameComplete, onBack }: HistoryGameProps) {
  const [score, setScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [questionEvents, setQuestionEvents] = useState<HistoricalEvent[]>([])
  const [questionType, setQuestionType] = useState<'chronology' | 'description'>('chronology')
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const [totalRounds] = useState(8)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ancient': return 'bg-amber-100 text-amber-800'
      case 'medieval': return 'bg-purple-100 text-purple-800'
      case 'modern': return 'bg-blue-100 text-blue-800'
      case 'recent': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setCurrentRound(1)
    generateNewRound()
  }

  const generateNewRound = () => {
    const randomEvents = [...historicalEvents].sort(() => Math.random() - 0.5).slice(0, 4)
    const type = Math.random() > 0.5 ? 'chronology' : 'description'

    setQuestionEvents(randomEvents)
    setQuestionType(type)
    setSelectedEvent(null)
    setFeedback(null)
  }

  const handleEventSelect = (eventId: string) => {
    if (feedback) return

    setSelectedEvent(eventId)
    const selectedEventObj = questionEvents.find(e => e.id === eventId)
    if (!selectedEventObj) return

    let isCorrect = false

    if (questionType === 'chronology') {
      // Ask for the earliest event
      const earliestYear = Math.min(...questionEvents.map(e => e.year))
      isCorrect = selectedEventObj.year === earliestYear
    } else {
      // Randomly select which event to ask about
      const targetEvent = questionEvents[Math.floor(Math.random() * questionEvents.length)]
      isCorrect = eventId === targetEvent.id
    }

    setFeedback({
      message: isCorrect
        ? `Correct! 🎉`
        : `Not quite! The ${questionType === 'chronology' ? 'earliest event' : 'correct answer'} was different.`,
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Time Traveler</h1>
            <p className="text-gray-600">Journey through history and test your knowledge of important events!</p>
          </div>

          {score > 0 && (
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">Your Results</h3>
              <div className="space-y-1 text-red-800">
                <p>Final Score: {Math.round(score)}</p>
                <p>Events Mastered: {Math.round(score / 12.5)}/{totalRounds}</p>
                <p>Accuracy: {Math.round((score / (totalRounds * 12.5)) * 100)}%</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Exit Game
          </button>
          <div className="flex gap-4">
            <div className="text-sm font-medium text-red-600">
              Score: {Math.round(score)}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Round: {currentRound}/{totalRounds}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {questionType === 'chronology' ? 'Which event happened first?' : 'Select the historical event'}
          </h2>

          {/* Event Options */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {questionEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventSelect(event.id)}
                disabled={selectedEvent !== null}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedEvent === event.id
                    ? feedback?.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : selectedEvent !== null
                    ? 'border-gray-200 bg-gray-50 opacity-50'
                    : 'border-red-200 bg-white hover:border-red-400 hover:bg-red-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{event.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-red-600">Year: {event.year}</span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-800 mb-2">{event.title}</div>
                    <div className="text-sm text-gray-600">{event.description}</div>
                  </div>
                </div>
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
          {feedback && !feedback.isCorrect && questionType === 'chronology' && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-red-800">
                <strong>Earliest event:</strong> {questionEvents.reduce((earliest, event) =>
                  event.year < earliest.year ? event : earliest
                ).title} ({questionEvents.reduce((earliest, event) =>
                  event.year < earliest.year ? event : earliest
                ).year})
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3">
          <div
            className="bg-red-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          />
        </div>

        {/* Timeline Legend */}
        <div className="mt-6 flex justify-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-amber-200 rounded-full"></span> Ancient (before 500)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-200 rounded-full"></span> Medieval (500-1500)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-200 rounded-full"></span> Modern (1500-1900)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-200 rounded-full"></span> Recent (1900+)
          </span>
        </div>
      </div>
    </div>
  )
}