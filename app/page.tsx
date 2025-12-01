import Link from 'next/link'
import { Trophy, Users, Zap, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 retro-grid">
      <div className="text-center mb-12">
        <h1 className="text-7xl font-bold neon-text mb-4 glow-effect">
          NOSTALGIA QUIZ BATTLE
        </h1>
        <p className="text-2xl text-neon-cyan mb-8">
          Relive the 90s & 2000s • Battle Your Friends • Win Rewards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl">
        <div className="neon-card text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-neon-yellow" />
          <h3 className="text-xl font-bold mb-2">Compete</h3>
          <p className="text-gray-300">Battle in real-time quiz matches</p>
        </div>
        <div className="neon-card text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-neon-cyan" />
          <h3 className="text-xl font-bold mb-2">Multiplayer</h3>
          <p className="text-gray-300">1v1, 4-player rooms, or random matchmaking</p>
        </div>
        <div className="neon-card text-center">
          <Zap className="w-12 h-12 mx-auto mb-4 text-neon-pink" />
          <h3 className="text-xl font-bold mb-2">Attacks</h3>
          <p className="text-gray-300">Use special attacks to disrupt opponents</p>
        </div>
        <div className="neon-card text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-neon-green" />
          <h3 className="text-xl font-bold mb-2">Rewards</h3>
          <p className="text-gray-300">Earn coins, XP, and climb the leaderboard</p>
        </div>
      </div>

      <div className="flex gap-6">
        <Link href="/auth/login" className="neon-button">
          Login
        </Link>
        <Link href="/auth/signup" className="neon-button bg-gradient-to-r from-neon-green to-neon-cyan">
          Sign Up
        </Link>
      </div>
    </div>
  )
}
