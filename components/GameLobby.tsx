'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Play, Copy, Check } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { GameMode } from '@/lib/types'

interface GameLobbyProps {
  gameId: string
  mode: GameMode
  roomCode?: string
  onStart: () => void
}

export default function GameLobby({ gameId, mode, roomCode, onStart }: GameLobbyProps) {
  const { profile } = useAuth()
  const router = useRouter()
  const [players, setPlayers] = useState<any[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data } = await supabase
        .from('game_participants')
        .select('*, profile:profiles(*)')
        .eq('game_id', gameId)

      if (data) {
        setPlayers(data)
      }
    }

    fetchPlayers()
    const interval = setInterval(fetchPlayers, 2000)
    return () => clearInterval(interval)
  }, [gameId])

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const canStart = mode === 'solo' || (players.length >= (mode === '1v1' ? 2 : mode === '4player' ? 4 : 1))

  return (
    <div className="neon-card max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold neon-text mb-6 text-center">Game Lobby</h2>

      {roomCode && (
        <div className="mb-6 p-4 bg-retro-dark rounded-lg border border-neon-cyan/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Room Code</p>
              <p className="text-2xl font-mono font-bold text-neon-cyan">{roomCode}</p>
            </div>
            <button
              onClick={copyRoomCode}
              className="px-4 py-2 bg-neon-cyan/20 border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-all flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-neon-cyan" />
          <h3 className="text-xl font-bold">Players ({players.length})</h3>
        </div>
        <div className="space-y-2">
          {players.map((participant) => (
            <div
              key={participant.id}
              className="p-4 bg-retro-dark rounded-lg border border-neon-cyan/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                  {participant.profile?.username?.[0]?.toUpperCase() || 'P'}
                </div>
                <div>
                  <p className="font-semibold">{participant.profile?.username || 'Player'}</p>
                  <p className="text-sm text-gray-400">Level {participant.profile?.level || 1}</p>
                </div>
              </div>
              {participant.player_id === profile?.id && (
                <span className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-full text-sm">You</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onStart}
          disabled={!canStart}
          className="flex-1 neon-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          {mode === 'solo' ? 'Start Game' : `Start (${players.length}/${mode === '1v1' ? 2 : mode === '4player' ? 4 : 1})`}
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-red-500/20 border border-red-500 rounded-lg hover:bg-red-500/30 transition-all"
        >
          Leave
        </button>
      </div>
    </div>
  )
}

