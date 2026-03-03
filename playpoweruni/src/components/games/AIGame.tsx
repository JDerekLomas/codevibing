'use client'

import { useState, useEffect } from 'react'

interface AIGameProps {
  onGameComplete: (score: number) => void
  onBack: () => void
}

interface AIConcept {
  id: string
  term: string
  definition: string
  examples: string[]
  category: 'basics' | 'applications' | 'ethics'
}

const aiConcepts: AIConcept[] = [
  {
    id: '1',
    term: 'Machine Learning',
    definition: 'Teaching computers to learn from data without explicit programming',
    examples: ['Spam email filters', 'Photo recognition', 'Recommendation systems'],
    category: 'basics'
  },
  {
    id: '2',
    term: 'Neural Network',
    definition: 'Computer systems inspired by the human brain\'s structure',
    examples: ['Image recognition', 'Language translation', 'Game playing AI'],
    category: 'basics'
  },
  {
    id: '3',
    term: 'Algorithm',
    definition: 'Step-by-step instructions for solving a problem or completing a task',
    examples: ['Google search', 'GPS navigation', 'Sorting a list of names'],
    category: 'basics'
  },
  {
    id: '4',
    term: 'Robotics',
    definition: 'Designing and building machines that can perform tasks automatically',
    examples: ['Factory assembly robots', 'Vacuum cleaning robots', 'Mars rovers'],
    category: 'applications'
  },
  {
    id: '5',
    term: 'Natural Language Processing',
    definition: 'Helping computers understand and respond to human language',
    examples: ['Voice assistants', 'Chatbots', 'Language translation apps'],
    category: 'applications'
  },
  {
    id: '6',
    term: 'Computer Vision',
    definition: 'Teaching computers to see and understand visual information',
    examples: ['Face recognition', 'Self-driving cars', 'Medical image analysis'],
    category: 'applications'
  },
  {
    id: '7',
    term: 'AI Ethics',
    definition: 'Making sure AI is used responsibly and fairly',
    examples: ['Preventing bias in AI decisions', 'Protecting privacy', 'Ensuring AI helps everyone'],
    category: 'ethics'
  },
  {
    id: '8',
    term: 'Data Privacy',
    definition: 'Protecting personal information collected and used by AI systems',
    examples: ['Secure social media accounts', 'Private messaging', 'Personal data protection'],
    category: 'ethics'
  }
]

export default function AIGame({ onGameComplete, onBack }: AIGameProps) {
  const [score, setScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)
  const [selectedExample, setSelectedExample] = useState<string | null>(null)
  const [currentConcept, setCurrentConcept] = useState<AIConcept | null>(null)
  const [correctExamples, setCorrectExamples] = useState<string[]>([])
  const [incorrectExamples, setIncorrectExamples] = useState<string[]>([])
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const [totalRounds] = useState(6)

  const generateWrongExamples = (correctExamples: string[]): string[] => {
    const allExamples = aiConcepts.flatMap(concept => concept.examples)
    const wrongExamples = allExamples.filter(ex => !correctExamples.includes(ex))
    return wrongExamples.sort(() => Math.random() - 0.5).slice(0, 3)
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setCurrentRound(1)
    generateNewRound()
  }

  const generateNewRound = () => {
    const randomConcept = aiConcepts[Math.floor(Math.random() * aiConcepts.length)]
    const wrongExamples = generateWrongExamples(randomConcept.examples)
    const allExamples = [...randomConcept.examples, ...wrongExamples].sort(() => Math.random() - 0.5)

    setCurrentConcept(randomConcept)
    setCorrectExamples(randomConcept.examples)
    setIncorrectExamples(wrongExamples)
    setSelectedExample(null)
    setFeedback(null)
  }

  const handleExampleSelect = (example: string) => {
    if (feedback || !currentConcept) return

    setSelectedExample(example)
    const isCorrect = correctExamples.includes(example)

    setFeedback({
      message: isCorrect
        ? `Correct! ${example} is a great example of ${currentConcept.term}! 🎉`
        : `Not quite! ${example} is not an example of ${currentConcept.term}.`,
      isCorrect
    })

    if (isCorrect) {
      setScore(score + 16.67) // 100 points / 6 rounds
    }

    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound(currentRound + 1)
        generateNewRound()
      } else {
        setGameActive(false)
        onGameComplete(score + (isCorrect ? 16.67 : 0))
      }
    }, 3000)
  }

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🤖</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Explorer</h1>
            <p className="text-gray-600">Discover the fascinating world of Artificial Intelligence!</p>
          </div>

          {score > 0 && (
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-purple-900 mb-2">Your Results</h3>
              <div className="space-y-1 text-purple-800">
                <p>Final Score: {Math.round(score)}</p>
                <p>Concepts Mastered: {Math.round(score / 16.67)}/{totalRounds}</p>
                <p>Accuracy: {Math.round((score / (totalRounds * 16.67)) * 100)}%</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-8">
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
            <div className="text-sm font-medium text-purple-600">
              Score: {Math.round(score)}
            </div>
            <div className="text-sm font-medium text-gray-600">
              Round: {currentRound}/{totalRounds}
            </div>
          </div>
        </div>

        {/* AI Concept */}
        {currentConcept && (
          <div className="text-center mb-8">
            <div className="mb-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                currentConcept.category === 'basics' ? 'bg-blue-100 text-blue-800' :
                currentConcept.category === 'applications' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {currentConcept.category.toUpperCase()}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentConcept.term}</h2>
            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <div className="text-xl text-purple-900 leading-relaxed">
                {currentConcept.definition}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-4">Which of these is an example of {currentConcept.term}?</h3>

            {/* Example Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[...correctExamples, ...incorrectExamples].map((example, index) => (
                <button
                  key={`${example}-${index}`}
                  onClick={() => handleExampleSelect(example)}
                  disabled={selectedExample !== null}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedExample === example
                      ? feedback?.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : selectedExample !== null
                      ? 'border-gray-200 bg-gray-50 opacity-50'
                      : 'border-purple-200 bg-white hover:border-purple-400 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {correctExamples.includes(example) ? '✅' : '❌'}
                    </div>
                    <div className="text-gray-800">{example}</div>
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
            {feedback && !feedback.isCorrect && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-800">
                  <strong>Correct examples:</strong> {correctExamples.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}