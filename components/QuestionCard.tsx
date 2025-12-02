'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuestionCardProps {
  question: string
  options: string[]
  timeLimit: number
  onAnswer: (index: number, timeTaken: number) => void
  onTimeUp: () => void
  disabled?: boolean
  blur?: boolean
  reverse?: boolean
  shake?: boolean
  fakeOption?: string
  freeze?: boolean
  correctAnswer?: number // Index of the correct answer (0-3)
  showResult?: boolean // Whether to show the result
}

export default function QuestionCard({
  question,
  options,
  timeLimit,
  onAnswer,
  onTimeUp,
  disabled = false,
  blur = false,
  reverse = false,
  shake = false,
  fakeOption,
  freeze = false,
  correctAnswer,
  showResult = false,
}: QuestionCardProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [selected, setSelected] = useState<number | null>(null)
  const [frozen, setFrozen] = useState(false)

  // Handle freeze attack
  useEffect(() => {
    if (freeze) {
      setFrozen(true)
      const timeout = setTimeout(() => {
        setFrozen(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [freeze])

  // Reset when question changes
  useEffect(() => {
    setTimeLeft(timeLimit)
    setSelected(null)
    setFrozen(false)
  }, [question, timeLimit])

  useEffect(() => {
    if (disabled || frozen || freeze) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [disabled, frozen, freeze, onTimeUp])

  const handleAnswer = (index: number) => {
    if (disabled || selected !== null) return
    setSelected(index)
    const timeTaken = timeLimit - timeLeft
    onAnswer(index, timeTaken)
  }

  const displayQuestion = reverse ? question.split('').reverse().join('') : question
  const displayOptions = fakeOption ? [...options, fakeOption] : options

  return (
    <motion.div
      className={`neon-card relative ${blur ? 'blur-md' : ''}`}
      animate={shake ? { 
        x: [0, -20, 20, -20, 20, -10, 10, 0],
        y: [0, -10, 10, -10, 10, 0],
        rotate: [0, -5, 5, -5, 5, 0]
      } : {}}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Attack indicator overlay */}
      {(blur || reverse || shake || fakeOption) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-red-500/20 rounded-xl pointer-events-none z-10"
        />
      )}
      {/* Timer */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Time Remaining</span>
          <span className={`text-2xl font-bold ${timeLeft < 3000 ? 'text-red-500 animate-pulse' : 'text-neon-cyan'}`}>
            {(timeLeft / 1000).toFixed(1)}s
          </span>
        </div>
        <div className="w-full bg-retro-dark rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-green"
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / timeLimit) * 100}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-bold mb-8 text-center min-h-[80px] flex items-center justify-center">
        {displayQuestion}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {displayOptions.map((option, index) => {
            // Skip fake option if it exists and we're showing results
            if (fakeOption && index === options.length && !showResult) {
              return null
            }
            
            const isSelected = selected === index
            const isCorrect = correctAnswer !== undefined && index === correctAnswer
            const isWrong = isSelected && !isCorrect
            
            // Determine button styling
            let buttonClass = 'border-neon-cyan/30 bg-retro-dark'
            if (showResult || selected !== null) {
              if (isCorrect) {
                buttonClass = 'border-neon-green bg-neon-green/20 shadow-neon-green'
              } else if (isWrong) {
                buttonClass = 'border-red-500 bg-red-500/20 shadow-red-500'
              } else if (selected !== null) {
                buttonClass = 'border-gray-600 bg-gray-800/50 opacity-60'
              }
            } else {
              buttonClass = 'border-neon-cyan/30 bg-retro-dark hover:border-neon-cyan hover:bg-neon-cyan/10'
            }

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={disabled || selected !== null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${buttonClass} ${
                  disabled || selected !== null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isCorrect && (showResult || selected !== null)
                      ? 'bg-neon-green text-white'
                      : isWrong
                      ? 'bg-red-500 text-white'
                      : 'bg-neon-cyan/20 text-neon-cyan'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-semibold flex-1">{option}</span>
                  {showResult || selected !== null ? (
                    isCorrect ? (
                      <span className="text-neon-green font-bold">✓ Correct</span>
                    ) : isWrong ? (
                      <span className="text-red-500 font-bold">✗ Wrong</span>
                    ) : null
                  ) : null}
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
      
      {/* Result Message */}
      {showResult && selected !== null && correctAnswer !== undefined && (
        <div className={`mt-4 p-4 rounded-lg text-center font-bold ${
          selected === correctAnswer
            ? 'bg-neon-green/20 border border-neon-green text-neon-green'
            : 'bg-red-500/20 border border-red-500 text-red-400'
        }`}>
          {selected === correctAnswer ? (
            <span>🎉 Correct! Great job!</span>
          ) : (
            <span>❌ Incorrect. The correct answer was: {String.fromCharCode(65 + correctAnswer)}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

