'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'
import GameLobby from '@/components/GameLobby'
import QuestionCard from '@/components/QuestionCard'
import { useAuth } from '@/lib/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { SAMPLE_QUESTIONS } from '@/lib/questions'
import { Question, QuestionCategory } from '@/lib/types'

// Map category names to database categories
const categoryMap: Record<string, QuestionCategory> = {
  '90s Cartoons': 'cartoons',
  'Bollywood': 'bollywood',
  'Hollywood': 'hollywood',
  'Old Gadgets': 'gadgets',
  'Childhood Snacks': 'snacks',
  'Toys & Games': 'toys',
  'Mixed': 'cartoons', // Default, will use all categories
}

function SoloGameContent() {
  const { profile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')
  const questionCountParam = searchParams.get('questions')
  const dbCategory = selectedCategory ? categoryMap[selectedCategory] : undefined
  
  // Configurable question count: 5, 10, 15, 20, or unlimited (0)
  const totalQuestions = questionCountParam ? parseInt(questionCountParam) : 10
  
  const [gameId, setGameId] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [attacks, setAttacks] = useState<{ blur?: boolean; reverse?: boolean; shake?: boolean; fake?: string; freeze?: boolean;}>({})
  const [showResult, setShowResult] = useState(false)     

  useEffect(() => {
    const createGame = async () => {
      if (!profile) return

      const { data, error } = await supabase
        .from('games')
        .insert({
          mode: 'solo',
          status: 'waiting',
          max_players: 1,
          current_players: 1,
          created_by: profile.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating game:', error)
        return
      }

      if (data) {
        setGameId(data.id)
        await supabase.from('game_participants').insert({
          game_id: data.id,
          player_id: profile.id,
        })
      }
    }

    createGame()
  }, [profile])

  const startGame = () => {
    setGameStarted(true)
    loadQuestion(0)
  }

  const loadQuestion = (index: number) => {
    // Filter questions by category if selected
    let availableQuestions = SAMPLE_QUESTIONS
    if (dbCategory && selectedCategory !== 'Mixed') {
      availableQuestions = SAMPLE_QUESTIONS.filter(q => q.category === dbCategory)
    }
    
    // If no questions in category, use all questions
    if (availableQuestions.length === 0) {
      availableQuestions = SAMPLE_QUESTIONS
    }
    
    const question = availableQuestions[index % availableQuestions.length]
    setCurrentQuestion({
      ...question,
      id: `q-${index}`,
      created_at: new Date().toISOString(),
    })
    setAttacks({})
    setShowResult(false)
  }

  const handleAnswer = async (answerIndex: number, timeTaken: number) => {
    if (!currentQuestion || !gameId || !profile) return

    const isCorrect = answerIndex === currentQuestion.correct_answer
    const points = isCorrect ? Math.max(100, 1000 - timeTaken) : 0

    if (isCorrect) {
      setScore((prev) => prev + points)
      setCorrectAnswers((prev) => prev + 1)
    }

    // Show result
    setShowResult(true)

    // Save answer
    await supabase.from('game_answers').insert({
      game_id: gameId,
      player_id: profile.id,
      question_id: currentQuestion.id,
      answer_index: answerIndex,
      is_correct: isCorrect,
      time_taken: timeTaken,
    })

    // Next question after delay
    setTimeout(() => {
      setShowResult(false)
      // If totalQuestions is 0, play unlimited questions
      // Otherwise check if we've reached the limit
      if (totalQuestions === 0 || questionIndex < totalQuestions - 1) {
        setQuestionIndex((prev) => prev + 1)
        loadQuestion(questionIndex + 1)
      } else {
        finishGame()
      }
    }, 3000) // Increased delay to 3 seconds so user can see the result
  }

  const handleTimeUp = () => {
    handleAnswer(-1, 10000)
  }

  const finishGame = async () => {
    if (!gameId || !profile) return

    const xpGained = Math.floor(score / 10)
    const coinsGained = correctAnswers * 5

    await supabase
      .from('games')
      .update({ status: 'finished', finished_at: new Date().toISOString() })
      .eq('id', gameId)

    await supabase
      .from('profiles')
      .update({
        xp: (profile.xp || 0) + xpGained,
        coins: (profile.coins || 0) + coinsGained,
      })
      .eq('id', profile.id)

    router.push(`/game/results/${gameId}`)
  }

  if (!gameId) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl neon-text animate-pulse">Creating game...</div>
        </div>
      </AuthGuard>
    )
  }

  if (!gameStarted) {
    return (
      <AuthGuard>
        <div className="min-h-screen p-8 retro-grid">
          <GameLobby gameId={gameId} mode="solo" onStart={startGame} />
        </div>
      </AuthGuard>
    )
  }

  if (!currentQuestion) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl neon-text animate-pulse">Loading question...</div>
        </div>
      </AuthGuard>
    )
  }

  const handleLeaveGame = async () => {
    if (confirm('Are you sure you want to leave? Your progress will be saved up to this point.')) {
      // Save current progress
      if (gameId && profile) {
        const xpGained = Math.floor(score / 10)
        const coinsGained = correctAnswers * 5

        await supabase
          .from('games')
          .update({ status: 'finished', finished_at: new Date().toISOString() })
          .eq('id', gameId)

        await supabase
          .from('profiles')
          .update({
            xp: (profile.xp || 0) + xpGained,
            coins: (profile.coins || 0) + coinsGained,
          })
          .eq('id', profile.id)
      }
      router.push('/dashboard')
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen p-8 retro-grid">
        <div className="max-w-4xl mx-auto">
          {/* Header with Leave Button */}
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={handleLeaveGame}
              className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <span>←</span> Leave Game
            </button>
          </div>

          {/* Score Header */}
          <div className="mb-6 flex justify-between items-center">
            <div className="neon-card px-6 py-3">
              <p className="text-sm text-gray-400">Score</p>
              <p className="text-3xl font-bold text-neon-green">{score}</p>
            </div>
            <div className="neon-card px-6 py-3">
              <p className="text-sm text-gray-400">Question</p>
              <p className="text-3xl font-bold text-neon-cyan">
                {totalQuestions === 0 ? `${questionIndex + 1}∞` : `${questionIndex + 1}/${totalQuestions}`}
              </p>
            </div>
            <div className="neon-card px-6 py-3">
              <p className="text-sm text-gray-400">Correct</p>
              <p className="text-3xl font-bold text-neon-pink">{correctAnswers}</p>
            </div>
          </div>

          {/* Question */}
          <QuestionCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            timeLimit={10000}
            onAnswer={handleAnswer}
            onTimeUp={handleTimeUp}
            blur={attacks.blur}
            reverse={attacks.reverse}
            shake={attacks.shake}
            fakeOption={attacks.fake}
            correctAnswer={currentQuestion.correct_answer}
            showResult={showResult}
          />
        </div>
      </div>
    </AuthGuard>
  )
}

export default function SoloGamePage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl neon-text animate-pulse">Loading...</div>
        </div>
      }>
        <SoloGameContent />
      </Suspense>
    </AuthGuard>
  )
}

