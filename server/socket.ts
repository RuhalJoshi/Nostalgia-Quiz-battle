import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export interface GameState {
  gameId: string
  mode: string
  status: 'waiting' | 'active' | 'finished'
  players: PlayerState[]
  currentQuestion: QuestionState | null
  questionIndex: number
  totalQuestions: number
  startTime: number | null
}

export interface PlayerState {
  id: string
  username: string
  avatar: string
  score: number
  correctAnswers: number
  coins: number
  attacksUsed: number
  attacksReceived: number
  answered: boolean
  answerTime: number | null
}

export interface QuestionState {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: string
  timeLimit: number
  startTime: number
}

export class GameManager {
  private games: Map<string, GameState> = new Map()
  private playerGames: Map<string, string> = new Map() // playerId -> gameId

  createGame(gameId: string, mode: string, maxPlayers: number, createdBy: string) {
    const game: GameState = {
      gameId,
      mode,
      status: 'waiting',
      players: [],
      currentQuestion: null,
      questionIndex: 0,
      totalQuestions: 10,
      startTime: null,
    }
    this.games.set(gameId, game)
    return game
  }

  joinGame(gameId: string, player: Omit<PlayerState, 'score' | 'correctAnswers' | 'attacksUsed' | 'attacksReceived' | 'answered' | 'answerTime'>) {
    const game = this.games.get(gameId)
    if (!game) return null

    if (game.players.some(p => p.id === player.id)) {
      return game // Already joined
    }

    if (game.players.length >= (game.mode === '4player' ? 4 : game.mode === '1v1' ? 2 : 1)) {
      return null // Game full
    }

    const playerState: PlayerState = {
      ...player,
      score: 0,
      correctAnswers: 0,
      coins: player.coins,
      attacksUsed: 0,
      attacksReceived: 0,
      answered: false,
      answerTime: null,
    }

    game.players.push(playerState)
    this.playerGames.set(player.id, gameId)
    return game
  }

  getGame(gameId: string) {
    return this.games.get(gameId)
  }

  getPlayerGame(playerId: string) {
    const gameId = this.playerGames.get(playerId)
    return gameId ? this.games.get(gameId) : null
  }

  startGame(gameId: string) {
    const game = this.games.get(gameId)
    if (!game) return null

    game.status = 'active'
    game.startTime = Date.now()
    return game
  }

  endGame(gameId: string) {
    const game = this.games.get(gameId)
    if (!game) return null

    game.status = 'finished'
    this.games.delete(gameId)
    game.players.forEach(p => this.playerGames.delete(p.id))
    return game
  }

  removePlayer(playerId: string) {
    const gameId = this.playerGames.get(playerId)
    if (!gameId) return null

    const game = this.games.get(gameId)
    if (!game) return null

    game.players = game.players.filter(p => p.id !== playerId)
    this.playerGames.delete(playerId)

    if (game.players.length === 0) {
      this.games.delete(gameId)
    }

    return game
  }
}

export const gameManager = new GameManager()

export function initializeSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SOCKET_URL || '*',
      methods: ['GET', 'POST'],
    },
  })

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }

    try {
      const { data: { user } } = await supabaseAdmin.auth.getUser(token)
      if (!user) {
        return next(new Error('Authentication error'))
      }
      socket.data.userId = user.id
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.userId)

    socket.on('join-game', async ({ gameId, mode, roomCode }) => {
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', socket.data.userId)
          .single()

        if (!profile) {
          socket.emit('error', { message: 'Profile not found' })
          return
        }

        let game = gameManager.getGame(gameId)
        if (!game) {
          game = gameManager.createGame(gameId, mode, mode === '4player' ? 4 : mode === '1v1' ? 2 : 1, socket.data.userId)
        }

        const updatedGame = gameManager.joinGame(gameId, {
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar,
          coins: profile.coins,
        })

        if (!updatedGame) {
          socket.emit('error', { message: 'Could not join game' })
          return
        }

        socket.join(gameId)
        socket.data.gameId = gameId

        io.to(gameId).emit('game-update', updatedGame)

        if (updatedGame.players.length === updatedGame.totalQuestions && updatedGame.mode !== 'solo') {
          // Auto-start if enough players
          setTimeout(() => {
            const game = gameManager.startGame(gameId)
            if (game) {
              io.to(gameId).emit('game-started', game)
            }
          }, 3000)
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to join game' })
      }
    })

    socket.on('start-game', ({ gameId }) => {
      const game = gameManager.startGame(gameId)
      if (game) {
        io.to(gameId).emit('game-started', game)
      }
    })

    socket.on('submit-answer', async ({ gameId, questionId, answerIndex, timeTaken }) => {
      try {
        const game = gameManager.getGame(gameId)
        if (!game || !game.currentQuestion) return

        const player = game.players.find(p => p.id === socket.data.userId)
        if (!player || player.answered) return

        const isCorrect = answerIndex === game.currentQuestion.correctAnswer
        player.answered = true
        player.answerTime = timeTaken

        if (isCorrect) {
          const points = Math.max(100, 1000 - timeTaken)
          player.score += points
          player.correctAnswers++
        }

        // Save answer to database
        await supabaseAdmin.from('game_answers').insert({
          game_id: gameId,
          player_id: socket.data.userId,
          question_id: questionId,
          answer_index: answerIndex,
          is_correct: isCorrect,
          time_taken: timeTaken,
        })

        io.to(gameId).emit('answer-submitted', {
          playerId: socket.data.userId,
          isCorrect,
          score: player.score,
        })

        // Check if all players answered
        const allAnswered = game.players.every(p => p.answered || game.mode === 'solo')
        if (allAnswered) {
          setTimeout(() => {
            io.to(gameId).emit('question-complete', game)
          }, 2000)
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to submit answer' })
      }
    })

    socket.on('use-attack', async ({ gameId, targetId, attackType }) => {
      try {
        const game = gameManager.getGame(gameId)
        if (!game) return

        const attacker = game.players.find(p => p.id === socket.data.userId)
        const target = game.players.find(p => p.id === targetId)

        if (!attacker || !target) return

        // Check coins (attacks cost coins)
        const attackCosts: Record<string, number> = {
          blur: 10,
          reverse: 15,
          shake: 12,
          freeze: 20,
          fake: 18,
        }

        const cost = attackCosts[attackType] || 0
        if (attacker.coins < cost) {
          socket.emit('error', { message: 'Not enough coins' })
          return
        }

        attacker.coins -= cost
        attacker.attacksUsed++
        target.attacksReceived++

        // Save attack to database
        await supabaseAdmin.from('attacks_used').insert({
          game_id: gameId,
          attacker_id: socket.data.userId,
          target_id: targetId,
          attack_type: attackType,
        })

        // Update coins in database
        await supabaseAdmin
          .from('profiles')
          .update({ coins: attacker.coins })
          .eq('id', socket.data.userId)

        io.to(targetId).emit('attack-received', {
          type: attackType,
          attacker: attacker.username,
        })

        io.to(gameId).emit('attack-used', {
          attackerId: socket.data.userId,
          targetId,
          attackType,
        })
      } catch (error) {
        socket.emit('error', { message: 'Failed to use attack' })
      }
    })

    socket.on('next-question', async ({ gameId }) => {
      try {
        const game = gameManager.getGame(gameId)
        if (!game) return

        game.questionIndex++
        game.players.forEach(p => {
          p.answered = false
          p.answerTime = null
        })

        if (game.questionIndex >= game.totalQuestions) {
          // Game finished
          const finishedGame = gameManager.endGame(gameId)
          if (finishedGame) {
            // Calculate rewards
            for (const player of finishedGame.players) {
              const xpGained = player.score / 10
              const coinsGained = player.correctAnswers * 5

              await supabaseAdmin.rpc('update_player_stats', {
                player_id: player.id,
                xp_gained: xpGained,
                coins_gained: coinsGained,
                correct_answers: player.correctAnswers,
              })
            }

            io.to(gameId).emit('game-finished', finishedGame)
          }
        } else {
          // Load next question
          const { data: questions } = await supabaseAdmin
            .from('questions')
            .select('*')
            .limit(1)
            .order('random()')

          if (questions && questions.length > 0) {
            const q = questions[0]
            game.currentQuestion = {
              id: q.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correct_answer,
              category: q.category,
              timeLimit: 10000,
              startTime: Date.now(),
            }

            io.to(gameId).emit('new-question', game.currentQuestion)
          }
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to load next question' })
      }
    })

    socket.on('disconnect', () => {
      const gameId = socket.data.gameId
      if (gameId) {
        const game = gameManager.removePlayer(socket.data.userId)
        if (game) {
          io.to(gameId).emit('player-left', {
            playerId: socket.data.userId,
            game,
          })
        }
      }
      console.log('User disconnected:', socket.data.userId)
    })
  })

  return io
}

