'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'
import { Trophy, Coins, Zap, Home } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function GameResultsPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  const [results, setResults] = useState<any[]>([])
  const [rewards, setRewards] = useState<{ xp: number; coins: number } | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      const { data } = await supabase
        .from('game_participants')
        .select('*, profile:profiles(*)')
        .eq('game_id', gameId)
        .order('score', { ascending: false })

      if (data) {
        setResults(data)
      }
    }

    fetchResults()
  }, [gameId])

  return (
    <AuthGuard>
      <div className="min-h-screen p-8 retro-grid">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-neon-yellow" />
            <h1 className="text-5xl font-bold neon-text mb-2">Game Results</h1>
          </div>

          <div className="space-y-4 mb-8">
            {results.map((result, index) => (
              <div
                key={result.id}
                className={`neon-card p-6 ${
                  index === 0 ? 'border-neon-yellow shadow-neon-yellow' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-neon-cyan w-12">
                      #{index + 1}
                    </div>
                    <div className="w-16 h-16 rounded-full bg-neon-cyan/20 flex items-center justify-center text-2xl font-bold">
                      {result.profile?.username?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{result.profile?.username || 'Player'}</p>
                      <p className="text-gray-400">Level {result.profile?.level || 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-neon-green">{result.score || 0}</p>
                    <p className="text-gray-400">Score</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-400">Correct Answers: </span>
                    <span className="font-bold text-neon-green">{result.correct_answers || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Attacks Used: </span>
                    <span className="font-bold text-neon-pink">{result.attacks_used || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rewards && (
            <div className="neon-card mb-8">
              <h2 className="text-2xl font-bold mb-4">Rewards Earned</h2>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-neon-yellow" />
                  <span className="text-xl font-bold">{rewards.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-neon-yellow" />
                  <span className="text-xl font-bold">{rewards.coins} Coins</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="neon-button flex items-center gap-2">
              <Home className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <Link href="/game/solo" className="neon-button bg-gradient-to-r from-neon-green to-neon-cyan">
              Play Again
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

