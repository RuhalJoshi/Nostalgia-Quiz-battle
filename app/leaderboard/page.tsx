'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { Trophy, Medal, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { LeaderboardEntry } from '@/lib/types'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'global' | 'weekly'>('global')

  useEffect(() => {
    fetchLeaderboard()
    fetchWeeklyLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_score', { ascending: false })
      .limit(100)

    if (data) {
      setLeaderboard(data)
    }
  }

  const fetchWeeklyLeaderboard = async () => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from('weekly_leaderboard')
      .select('*, profile:profiles(*)')
      .eq('week_start', weekStart.toISOString().split('T')[0])
      .order('score', { ascending: false })
      .limit(100)

    if (data) {
      setWeeklyLeaderboard(data)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-8 h-8 text-yellow-400" />
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-300" />
    if (rank === 3) return <Medal className="w-8 h-8 text-amber-600" />
    return <span className="text-2xl font-bold text-neon-cyan">#{rank}</span>
  }

  return (
    <AuthGuard>
      <div className="min-h-screen p-8 retro-grid">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-neon-yellow" />
            <h1 className="text-5xl font-bold neon-text mb-2">Leaderboard</h1>
          </div>

          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => setActiveTab('global')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'global'
                  ? 'bg-neon-cyan text-retro-dark'
                  : 'bg-retro-darker text-gray-400 hover:text-white'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'weekly'
                  ? 'bg-neon-cyan text-retro-dark'
                  : 'bg-retro-darker text-gray-400 hover:text-white'
              }`}
            >
              Weekly
            </button>
          </div>

          <div className="neon-card">
            <div className="space-y-4">
              {activeTab === 'global' ? (
                <>
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.player_id}
                      className={`p-4 rounded-lg border-2 ${
                        index < 3
                          ? 'border-neon-yellow bg-neon-yellow/10'
                          : 'border-neon-cyan/30 bg-retro-dark'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getRankIcon(index + 1)}
                          <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                            {entry.username[0]?.toUpperCase() || 'P'}
                          </div>
                          <div>
                            <p className="text-xl font-bold">{entry.username}</p>
                            <p className="text-sm text-gray-400">Level {entry.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-neon-green">{entry.total_score.toLocaleString()}</p>
                          <p className="text-sm text-gray-400">{entry.games_played} games</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {weeklyLeaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-lg border-2 ${
                        index < 3
                          ? 'border-neon-yellow bg-neon-yellow/10'
                          : 'border-neon-cyan/30 bg-retro-dark'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getRankIcon(index + 1)}
                          <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                            {entry.profile?.username?.[0]?.toUpperCase() || 'P'}
                          </div>
                          <div>
                            <p className="text-xl font-bold">{entry.profile?.username || 'Player'}</p>
                            <p className="text-sm text-gray-400">Level {entry.profile?.level || 1}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-neon-green">{entry.score || 0}</p>
                          <p className="text-sm text-gray-400">{entry.games_played || 0} games</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

