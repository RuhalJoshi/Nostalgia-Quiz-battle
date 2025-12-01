'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ATTACKS, AttackType } from '@/lib/types'

interface AttackNotificationProps {
  attack: {
    type: AttackType
    attacker: string
  } | null
}

export default function AttackNotification({ attack }: AttackNotificationProps) {
  if (!attack) return null

  const attackConfig = ATTACKS.find(a => a.type === attack.type)

  const attackMessages: Record<AttackType, string> = {
    blur: 'Your screen is blurry! 👁️',
    reverse: 'Text reversed! Read carefully! 🔄',
    shake: 'Screen shaking! Hold on! 💥',
    freeze: 'Time frozen! Timer stopped! ⏸️',
    fake: 'Fake option added! Be careful! 🎭',
  }

  const attackColors: Record<AttackType, string> = {
    blur: 'from-purple-500/20 to-pink-500/20 border-purple-500',
    reverse: 'from-blue-500/20 to-cyan-500/20 border-blue-500',
    shake: 'from-red-500/20 to-orange-500/20 border-red-500',
    freeze: 'from-cyan-500/20 to-blue-500/20 border-cyan-500',
    fake: 'from-yellow-500/20 to-orange-500/20 border-yellow-500',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.5 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.5 }}
        className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-6 rounded-xl border-2 bg-gradient-to-r ${attackColors[attack.type]} shadow-2xl`}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="text-center"
        >
          <div className="text-5xl mb-2">{attackConfig?.icon}</div>
          <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
            {attackMessages[attack.type]}
          </h3>
          <p className="text-sm text-gray-200">
            Attacked by <span className="font-bold text-neon-pink">{attack.attacker}</span>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

