'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import AuthGuard from '@/components/AuthGuard'
import { Gamepad2, Users, Trophy, Coins, Zap, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { profile, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <AuthGuard>
      <div className="min-h-screen p-8 retro-grid">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold neon-text mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {profile?.username}!</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="neon-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Level</p>
                  <p className="text-3xl font-bold text-neon-cyan">{profile?.level || 1}</p>
                </div>
                <Zap className="w-12 h-12 text-neon-yellow" />
              </div>
            </div>
            <div className="neon-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Coins</p>
                  <p className="text-3xl font-bold text-neon-green">{profile?.coins || 0}</p>
                </div>
                <Coins className="w-12 h-12 text-neon-yellow" />
              </div>
            </div>
            <div className="neon-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">XP</p>
                  <p className="text-3xl font-bold text-neon-pink">{profile?.xp || 0}</p>
                </div>
                <Trophy className="w-12 h-12 text-neon-pink" />
              </div>
            </div>
            <div className="neon-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Streak</p>
                  <p className="text-3xl font-bold text-neon-purple">{profile?.streak || 0}</p>
                </div>
                <Zap className="w-12 h-12 text-neon-purple" />
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 neon-text">Quick Start</h2>
            <Link href="/select-category" className="neon-card hover:scale-105 transition-transform cursor-pointer block mb-6 text-center">
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl">🎯</span>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Choose Category & Play</h3>
                  <p className="text-gray-400">Select a category and game mode to start playing</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Game Modes */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 neon-text">Game Modes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/game/solo" className="neon-card hover:scale-105 transition-transform cursor-pointer">
                <Gamepad2 className="w-12 h-12 mb-4 text-neon-cyan" />
                <h3 className="text-2xl font-bold mb-2">Solo Quiz</h3>
                <p className="text-gray-400">Practice mode - Answer questions at your own pace</p>
              </Link>

              <Link href="/game/battle/1v1" className="neon-card hover:scale-105 transition-transform cursor-pointer">
                <Users className="w-12 h-12 mb-4 text-neon-pink" />
                <h3 className="text-2xl font-bold mb-2">1 vs 1 Battle</h3>
                <p className="text-gray-400">Head-to-head competition with attacks</p>
              </Link>

              <Link href="/game/battle/4player" className="neon-card hover:scale-105 transition-transform cursor-pointer">
                <Users className="w-12 h-12 mb-4 text-neon-green" />
                <h3 className="text-2xl font-bold mb-2">4-Player Room</h3>
                <p className="text-gray-400">Battle royale with up to 4 players</p>
              </Link>

              <Link href="/game/battle/random" className="neon-card hover:scale-105 transition-transform cursor-pointer">
                <Zap className="w-12 h-12 mb-4 text-neon-yellow" />
                <h3 className="text-2xl font-bold mb-2">Random Match</h3>
                <p className="text-gray-400">Quick matchmaking with strangers</p>
              </Link>

              <Link href="/game/battle/friends" className="neon-card hover:scale-105 transition-transform cursor-pointer">
                <Users className="w-12 h-12 mb-4 text-neon-purple" />
                <h3 className="text-2xl font-bold mb-2">Play With Friends</h3>
                <p className="text-gray-400">Join or create a room with a code</p>
              </Link>

              <Link href="/leaderboard" className="neon-card hover:scale-105 transition-transform cursor-pointer">
                <Trophy className="w-12 h-12 mb-4 text-neon-yellow" />
                <h3 className="text-2xl font-bold mb-2">Leaderboard</h3>
                <p className="text-gray-400">See top players and compete</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

