'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'
import GameLobby from '@/components/GameLobby'
import QuestionCard from '@/components/QuestionCard'
import AttackPanel from '@/components/AttackPanel'
import AttackNotification from '@/components/AttackNotification'
import { useAuth } from '@/lib/hooks/useAuth'
import { getSocket, disconnectSocket } from '@/lib/socket'
import { supabase } from '@/lib/supabase/client'
import { GameMode, AttackType, QuestionCategory } from '@/lib/types'

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

function BattleGameContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = (params.mode as GameMode) || '1v1'
  const selectedCategory = searchParams.get('category')
  const dbCategory = selectedCategory ? categoryMap[selectedCategory] : undefined
  const { profile, sessionToken } = useAuth()
  const [gameId, setGameId] = useState<string | null>(null)
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [attacks, setAttacks] = useState<{ blur?: boolean; reverse?: boolean; shake?: boolean; fake?: string; freeze?: boolean }>({})
  const [coins, setCoins] = useState(profile?.coins || 0)
  const [currentAttack, setCurrentAttack] = useState<{ type: AttackType; attacker: string } | null>(null)

  useEffect(() => {
    if (!profile) return

    const createGame = async () => {
      let code: string | null = null
      if (mode === 'friends') {
        code = Math.random().toString(36).substring(2, 8).toUpperCase()
      }

      const { data, error } = await supabase
        .from('games')
        .insert({
          mode,
          room_code: code,
          status: 'waiting',
          max_players: mode === '4player' ? 4 : mode === '1v1' ? 2 : 1,
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
        setRoomCode(data.room_code)
        await supabase.from('game_participants').insert({
          game_id: data.id,
          player_id: profile.id,
        })
      }
    }

    createGame()

    return () => {
      disconnectSocket()
    }
  }, [profile, mode])

  useEffect(() => {
    if (!gameId || !sessionToken) return

    const socket = getSocket(sessionToken)

    socket.on('game-update', (game: any) => {
      setPlayers(game.players || [])
    })

    socket.on('game-started', (game: any) => {
      setGameStarted(true)
      setCurrentQuestion(game.currentQuestion)
    })

    socket.on('new-question', (question: any) => {
      setCurrentQuestion(question)
      setAttacks({})
    })

    socket.on('attack-received', (attack: { type: AttackType; attacker: string }) => {
      // Show attack notification
      setCurrentAttack({ type: attack.type, attacker: attack.attacker })
      setTimeout(() => setCurrentAttack(null), 3000)

      const duration = attack.type === 'blur' ? 4000 : attack.type === 'shake' ? 3000 : attack.type === 'freeze' ? 2000 : 5000
      
      if (attack.type === 'blur') {
        setAttacks({ blur: true })
        setTimeout(() => setAttacks({}), duration)
      } else if (attack.type === 'reverse') {
        setAttacks({ reverse: true })
        setTimeout(() => setAttacks({}), duration)
      } else if (attack.type === 'shake') {
        setAttacks({ shake: true })
        setTimeout(() => setAttacks({}), duration)
      } else if (attack.type === 'freeze') {
        // Freeze timer
        setAttacks({ freeze: true })
        setTimeout(() => setAttacks({}), duration)
      } else if (attack.type === 'fake') {
        setAttacks({ fake: 'This is a fake option! 🎭' })
        setTimeout(() => setAttacks({}), duration)
      }
    })

    socket.on('attack-used', () => {
      // Update coins after attack
      if (profile) {
        setCoins(profile.coins)
      }
    })

    socket.on('game-finished', (game: any) => {
      router.push(`/game/results/${gameId}`)
    })

    socket.emit('join-game', { gameId, mode, roomCode })

    return () => {
      socket.off('game-update')
      socket.off('game-started')
      socket.off('new-question')
      socket.off('attack-received')
      socket.off('attack-used')
      socket.off('game-finished')
    }
  }, [gameId, sessionToken, mode, roomCode, router, profile])

  const startGame = () => {
    if (!gameId || !sessionToken) return
    const socket = getSocket(sessionToken)
    socket.emit('start-game', { gameId })
  }

  const handleAnswer = (answerIndex: number, timeTaken: number) => {
    if (!gameId || !currentQuestion || !sessionToken) return
    const socket = getSocket(sessionToken)
    socket.emit('submit-answer', {
      gameId,
      questionId: currentQuestion.id,
      answerIndex,
      timeTaken,
    })
  }

  const handleAttack = (type: AttackType, targetId: string) => {
    if (!gameId || !sessionToken) return
    const socket = getSocket(sessionToken)
    socket.emit('use-attack', { gameId, targetId, attackType: type })
  }

  const opponents = players.filter((p) => p.id !== profile?.id)

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
          <GameLobby gameId={gameId} mode={mode} roomCode={roomCode || undefined} onStart={startGame} />
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
    if (confirm('Are you sure you want to leave? You will forfeit this match.')) {
      if (gameId && sessionToken) {
        const socket = getSocket(sessionToken)
        socket.emit('leave-game', { gameId })
        disconnectSocket()
      }
      router.push('/dashboard')
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen p-8 retro-grid">
        {/* Attack Notification */}
        <AttackNotification attack={currentAttack} />

        <div className="max-w-6xl mx-auto">
          {/* Header with Leave Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleLeaveGame}
              className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <span>←</span> Leave Game
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <QuestionCard
                question={currentQuestion.question}
                options={currentQuestion.options}
                timeLimit={currentQuestion.timeLimit || 10000}
                onAnswer={handleAnswer}
                onTimeUp={() => handleAnswer(-1, 10000)}
                blur={attacks.blur}
                reverse={attacks.reverse}
                shake={attacks.shake}
                fakeOption={attacks.fake}
                freeze={attacks.freeze}
              />
            </div>
            <div>
              <AttackPanel
                coins={coins}
                onAttack={handleAttack}
                opponents={opponents}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default function BattleGamePage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl neon-text animate-pulse">Loading...</div>
        </div>
      }>
        <BattleGameContent />
      </Suspense>
    </AuthGuard>
  )
}

