'use client'

import { useState } from 'react'
import { ATTACKS, AttackType } from '@/lib/types'
import { Zap, Target, Coins } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AttackPanelProps {
  coins: number
  onAttack: (type: AttackType, targetId: string) => void
  opponents: Array<{ id: string; username: string; avatar: string }>
  disabled?: boolean
}

export default function AttackPanel({ coins, onAttack, opponents, disabled = false }: AttackPanelProps) {
  const [lastAttack, setLastAttack] = useState<{ type: AttackType; target: string } | null>(null)
  const [attackCooldowns, setAttackCooldowns] = useState<Record<string, number>>({})

  const handleAttack = (type: AttackType, targetId: string) => {
    const attack = ATTACKS.find(a => a.type === type)
    if (attack && coins >= attack.cost) {
      // Check cooldown
      const cooldownKey = `${type}-${targetId}`
      if (attackCooldowns[cooldownKey] && attackCooldowns[cooldownKey] > Date.now()) {
        return
      }

      // Set cooldown (5 seconds)
      setAttackCooldowns(prev => ({
        ...prev,
        [cooldownKey]: Date.now() + 5000
      }))

      setLastAttack({ type, target: opponents.find(o => o.id === targetId)?.username || 'Opponent' })
      onAttack(type, targetId)

      // Clear last attack after 2 seconds
      setTimeout(() => setLastAttack(null), 2000)
    }
  }

  if (opponents.length === 0) return null

  return (
    <div className="neon-card relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-neon-pink/10 to-neon-cyan/10 animate-pulse-neon" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-6 h-6 text-neon-yellow" />
          </motion.div>
          <h3 className="text-xl font-bold neon-text">Attack Arsenal</h3>
          <div className="ml-auto flex items-center gap-2 bg-retro-dark px-3 py-1 rounded-lg border border-neon-green/30">
            <Coins className="w-4 h-4 text-neon-yellow" />
            <span className="text-neon-green font-bold">{coins}</span>
          </div>
        </div>

        {/* Attack Success Notification */}
        <AnimatePresence>
          {lastAttack && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-4 p-3 bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 border border-neon-pink rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-sm font-bold text-neon-pink">Attack Launched!</p>
                  <p className="text-xs text-gray-300">
                    {ATTACKS.find(a => a.type === lastAttack.type)?.name} → {lastAttack.target}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {opponents.map((opponent) => (
            <motion.div
              key={opponent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-retro-dark/80 rounded-lg border-2 border-neon-cyan/30 hover:border-neon-cyan transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-red-400" />
                <p className="text-sm font-semibold text-neon-cyan">Target:</p>
                <p className="text-sm font-bold text-white">{opponent.username}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {ATTACKS.map((attack) => {
                  const canAfford = coins >= attack.cost
                  const cooldownKey = `${attack.type}-${opponent.id}`
                  const isOnCooldown = attackCooldowns[cooldownKey] && attackCooldowns[cooldownKey] > Date.now()
                  const cooldownRemaining = isOnCooldown 
                    ? Math.ceil((attackCooldowns[cooldownKey] - Date.now()) / 1000)
                    : 0

                  return (
                    <motion.button
                      key={attack.type}
                      onClick={() => handleAttack(attack.type, opponent.id)}
                      disabled={disabled || !canAfford || isOnCooldown}
                      whileHover={canAfford && !isOnCooldown ? { scale: 1.05 } : {}}
                      whileTap={canAfford && !isOnCooldown ? { scale: 0.95 } : {}}
                      className={`relative p-3 rounded-lg border-2 transition-all text-sm overflow-hidden ${
                        canAfford && !isOnCooldown
                          ? 'border-neon-cyan/50 bg-gradient-to-br from-retro-dark to-retro-darker hover:border-neon-cyan hover:shadow-neon-cyan cursor-pointer'
                          : 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
                      }`}
                      title={`${attack.name} - ${attack.cost} coins - ${attack.description}`}
                    >
                      {/* Cooldown overlay */}
                      {isOnCooldown && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 rounded-lg">
                          <span className="text-xl font-bold text-neon-cyan">{cooldownRemaining}</span>
                        </div>
                      )}

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 to-neon-pink/0 group-hover:from-neon-cyan/20 group-hover:to-neon-pink/20 transition-all duration-300" />

                      <div className="relative z-0">
                        <motion.div
                          animate={canAfford && !isOnCooldown ? {
                            scale: [1, 1.1, 1],
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-3xl mb-1"
                        >
                          {attack.icon}
                        </motion.div>
                        <div className="text-xs font-bold mb-1">{attack.name}</div>
                        <div className="flex items-center justify-center gap-1">
                          <Coins className="w-3 h-3 text-neon-yellow" />
                          <span className={`text-xs ${canAfford ? 'text-neon-green' : 'text-gray-500'}`}>
                            {attack.cost}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Attack Tips */}
        <div className="mt-4 p-3 bg-retro-darker/50 rounded-lg border border-neon-purple/30">
          <p className="text-xs text-gray-400 text-center">
            💡 <span className="text-neon-purple font-semibold">Pro Tip:</span> Use attacks strategically when opponents are answering!
          </p>
        </div>
      </div>
    </div>
  )
}

