'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'
import { Gamepad2, Users, Zap, User } from 'lucide-react'

function PlayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const [questionCount, setQuestionCount] = useState(10)

  const questionOptions = [
    { value: 5, label: '5', description: 'Quick' },
    { value: 10, label: '10', description: 'Standard' },
    { value: 15, label: '15', description: 'Extended' },
    { value: 20, label: '20', description: 'Long' },
    { value: 0, label: '∞', description: 'Unlimited' },
  ]

  const gameModes = [
    {
      id: 'solo',
      name: 'Solo Quiz',
      description: 'Practice mode - Answer questions at your own pace',
      icon: User,
      gradient: 'from-neon-cyan to-neon-green',
      getHref: () => `/game/solo?category=${encodeURIComponent(category || '')}&questions=${questionCount}`
    },
    {
      id: '1v1',
      name: '1 vs 1 Battle',
      description: 'Head-to-head competition with attacks',
      icon: Users,
      gradient: 'from-neon-pink to-neon-purple',
      getHref: () => `/game/battle/1v1?category=${encodeURIComponent(category || '')}&questions=${questionCount}`
    },
    {
      id: '4player',
      name: '4-Player Room',
      description: 'Battle royale with up to 4 players',
      icon: Users,
      gradient: 'from-neon-green to-neon-cyan',
      getHref: () => `/game/battle/4player?category=${encodeURIComponent(category || '')}&questions=${questionCount}`
    },
    {
      id: 'random',
      name: 'Random Match',
      description: 'Quick matchmaking with strangers',
      icon: Zap,
      gradient: 'from-neon-yellow to-neon-pink',
      getHref: () => `/game/battle/random?category=${encodeURIComponent(category || '')}&questions=${questionCount}`
    },
    {
      id: 'friends',
      name: 'Play With Friends',
      description: 'Join or create a room with a code',
      icon: Users,
      gradient: 'from-neon-purple to-neon-pink',
      getHref: () => `/game/battle/friends?category=${encodeURIComponent(category || '')}&questions=${questionCount}`
    }
  ]

  if (!category) {
    router.push('/select-category')
    return null
  }

  return (
    <div className="min-h-screen retro-grid p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold neon-text mb-4 glow-effect">
            Select Game Mode
          </h1>
          <p className="text-xl text-neon-cyan mb-2">
            Category: <span className="font-bold text-neon-pink">{category}</span>
          </p>
          <p className="text-gray-400">
            Choose how you want to play
          </p>
        </div>

        {/* Question Count Selector */}
        <div className="neon-card mb-8">
          <h3 className="text-xl font-bold mb-4 text-center">Number of Questions</h3>
          <div className="grid grid-cols-5 gap-3">
            {questionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setQuestionCount(option.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  questionCount === option.value
                    ? 'border-neon-cyan bg-neon-cyan/20 shadow-neon-cyan'
                    : 'border-neon-cyan/30 bg-retro-dark hover:border-neon-cyan hover:bg-neon-cyan/10'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan mb-1">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((mode) => {
            const Icon = mode.icon
            return (
              <button
                key={mode.id}
                onClick={() => router.push(mode.getHref())}
                className={`neon-card hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${mode.gradient}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{mode.name}</h3>
                  </div>
                  <p className="text-gray-400 text-left">{mode.description}</p>
                </div>

                {/* Hover effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/select-category')}
            className="px-6 py-3 bg-retro-darker border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/10 transition-all text-neon-cyan"
          >
            ← Change Category
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PlayPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl neon-text animate-pulse">Loading...</div>
        </div>
      }>
        <PlayContent />
      </Suspense>
    </AuthGuard>
  )
}

