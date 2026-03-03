'use client'

import { useState, useEffect } from 'react'

interface NumbersGameProps {
  onGameComplete: (score: number) => void
  onBack: () => void
}

export default function NumbersGame({ onGameComplete, onBack }: NumbersGameProps) {
  const [currentProblem, setCurrentProblem] = useState<{ num1: number; num2: number; operator: string; answer: number } | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [problemsSolved, setProblemsSolved] = useState(0)
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds game
  const [gameActive, setGameActive] = useState(false)

  const generateProblem = () => {
    const operators = ['+', '-', '×']
    const operator = operators[Math.floor(Math.random() * operators.length)]
    let num1 = Math.floor(Math.random() * 10) + 1
    let num2 = Math.floor(Math.random() * 10) + 1
    let answer = 0

    switch (operator) {
      case '+':
        answer = num1 + num2
        break
      case '-':
        // Ensure positive result
        if (num1 < num2) [num1, num2] = [num2, num1]
        answer = num1 - num2
        break
      case '×':
        num1 = Math.floor(Math.random() * 5) + 1 // Keep numbers small for multiplication
        num2 = Math.floor(Math.random() * 5) + 1
        answer = num1 * num2
        break
    }

    return { num1, num2, operator, answer }
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setProblemsSolved(0)
    setTimeLeft(60)
    setCurrentProblem(generateProblem())
    setUserAnswer('')
    setFeedback(null)
  }

  const handleSubmit = () => {
    if (!currentProblem || !userAnswer) return

    const userNum = parseInt(userAnswer)
    const isCorrect = userNum === currentProblem.answer

    setFeedback({
      message: isCorrect ? 'Correct! 🎉' : `Wrong! The answer was ${currentProblem.answer}`,
      isCorrect
    })

    if (isCorrect) {
      setScore(score + 10)
    }

    setProblemsSolved(problemsSolved + 1)

    setTimeout(() => {
      setFeedback(null)
      setUserAnswer('')
      setCurrentProblem(generateProblem())
    }, 2000)
  }

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false)
      onGameComplete(score)
    }
  }, [timeLeft, gameActive, score, onGameComplete])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔢</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Numbers Challenge</h1>
            <p className="text-gray-600">Solve as many math problems as you can in 60 seconds!</p>
          </div>

          {score > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Your Results</h3>
              <div className="space-y-1 text-blue-800">
                <p>Final Score: {score}</p>
                <p>Problems Solved: {problemsSolved}</p>
                <p>Accuracy: {Math.round((score / (problemsSolved * 10)) * 100)}%</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Exit Game
          </button>
          <div className="flex gap-4">
            <div className="text-sm font-medium text-blue-600">
              Score: {score}
            </div>
            <div className={`text-sm font-medium ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
              Time: {timeLeft}s
            </div>
          </div>
        </div>

        {/* Problem */}
        {currentProblem && (
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-gray-800 mb-8">
              {currentProblem.num1} {currentProblem.operator} {currentProblem.num2} = ?
            </div>

            {/* Answer Input */}
            <div className="max-w-xs mx-auto">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your answer"
                className="w-full text-3xl font-semibold text-center border-4 border-blue-200 rounded-lg p-4 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`mt-4 p-3 rounded-lg ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!userAnswer}
              className="mt-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}