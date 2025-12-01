export type GameMode = 'solo' | '1v1' | '4player' | 'random' | 'friends'
export type GameStatus = 'waiting' | 'active' | 'finished'
export type AttackType = 'blur' | 'reverse' | 'shake' | 'freeze' | 'fake'
export type QuestionCategory = 'cartoons' | 'bollywood' | 'hollywood' | 'gadgets' | 'snacks' | 'toys'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Profile {
  id: string
  username: string
  avatar: string
  level: number
  xp: number
  coins: number
  streak: number
  last_played_at: string | null
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  category: QuestionCategory
  question: string
  options: string[]
  correct_answer: number
  difficulty: Difficulty
  created_at: string
}

export interface Game {
  id: string
  mode: GameMode
  room_code: string | null
  status: GameStatus
  max_players: number
  current_players: number
  created_by: string
  started_at: string | null
  finished_at: string | null
  created_at: string
}

export interface GameParticipant {
  id: string
  game_id: string
  player_id: string
  score: number
  correct_answers: number
  attacks_used: number
  attacks_received: number
  joined_at: string
  profile?: Profile
}

export interface GameAnswer {
  id: string
  game_id: string
  player_id: string
  question_id: string
  answer_index: number
  is_correct: boolean
  time_taken: number | null
  answered_at: string
}

export interface Attack {
  id: string
  game_id: string
  attacker_id: string
  target_id: string
  attack_type: AttackType
  used_at: string
}

export interface LeaderboardEntry {
  player_id: string
  username: string
  avatar: string
  total_score: number
  games_played: number
  win_rate: number
  current_streak: number
  best_streak: number
  level: number
  updated_at: string
}

export interface AttackConfig {
  type: AttackType
  name: string
  description: string
  cost: number
  duration: number // seconds
  icon: string
}

export const ATTACKS: AttackConfig[] = [
  {
    type: 'blur',
    name: 'Blur Screen',
    description: 'Question becomes blurry for 4 seconds',
    cost: 10,
    duration: 4,
    icon: '👁️'
  },
  {
    type: 'reverse',
    name: 'Reverse Text',
    description: 'Question text becomes reversed',
    cost: 15,
    duration: 5,
    icon: '🔄'
  },
  {
    type: 'shake',
    name: 'Screen Shake',
    description: 'UI shakes for 3 seconds',
    cost: 12,
    duration: 3,
    icon: '💥'
  },
  {
    type: 'freeze',
    name: 'Time Freeze',
    description: 'Opponent timer stops for 2 seconds',
    cost: 20,
    duration: 2,
    icon: '⏸️'
  },
  {
    type: 'fake',
    name: 'Fake Option',
    description: 'Adds a dummy 5th option',
    cost: 18,
    duration: 10,
    icon: '🎭'
  }
]

