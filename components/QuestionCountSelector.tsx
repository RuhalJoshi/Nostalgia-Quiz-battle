'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface QuestionCountSelectorProps {
  category: string
  onSelect: (count: number) => void
}

export default function QuestionCountSelector({ category, onSelect }: QuestionCountSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCount, setSelectedCount] = useState(10)

  const questionOptions = [
    { value: 5, label: '5 Questions', description: 'Quick game' },
    { value: 10, label: '10 Questions', description: 'Standard game' },
    { value: 15, label: '15 Questions', description: 'Extended game' },
    { value: 20, label: '20 Questions', description: 'Long game' },
    { value: 0, label: 'Unlimited', description: 'Play until you quit' },
  ]

  const handleSelect = (count: number) => {
    setSelectedCount(count)
    onSelect(count)
  }

  return (
    <div className="neon-card mb-6">
      <h3 className="text-xl font-bold mb-4 text-center">Number of Questions</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {questionOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedCount === option.value
                ? 'border-neon-cyan bg-neon-cyan/20 shadow-neon-cyan'
                : 'border-neon-cyan/30 bg-retro-dark hover:border-neon-cyan hover:bg-neon-cyan/10'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-cyan mb-1">
                {option.value === 0 ? '∞' : option.value}
              </div>
              <div className="text-sm font-semibold mb-1">{option.label}</div>
              <div className="text-xs text-gray-400">{option.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

