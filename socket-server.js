// Standalone Socket.IO server
// Run with: node socket-server.js
const { Server } = require('socket.io')
const { createServer } = require('http')
const { createClient } = require('@supabase/supabase-js')

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_SOCKET_URL || '*',
    methods: ['GET', 'POST'],
  },
})

// Game state management
const games = new Map()
const playerGames = new Map()

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

      let game = games.get(gameId)
      if (!game) {
        game = {
          gameId,
          mode,
          status: 'waiting',
          players: [],
          currentQuestion: null,
          questionIndex: 0,
          totalQuestions: 10,
          startTime: null,
        }
        games.set(gameId, game)
      }

      if (!game.players.some(p => p.id === socket.data.userId)) {
        game.players.push({
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar,
          coins: profile.coins,
          score: 0,
          correctAnswers: 0,
          attacksUsed: 0,
          attacksReceived: 0,
          answered: false,
          answerTime: null,
        })
        playerGames.set(socket.data.userId, gameId)
      }

      socket.join(gameId)
      socket.data.gameId = gameId

      io.to(gameId).emit('game-update', game)

      if (game.players.length === (mode === '4player' ? 4 : mode === '1v1' ? 2 : 1) && mode !== 'solo') {
        setTimeout(() => {
          const g = games.get(gameId)
          if (g) {
            g.status = 'active'
            g.startTime = Date.now()
            io.to(gameId).emit('game-started', g)
          }
        }, 3000)
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to join game' })
    }
  })

  socket.on('start-game', ({ gameId }) => {
    const game = games.get(gameId)
    if (game) {
      game.status = 'active'
      game.startTime = Date.now()
      io.to(gameId).emit('game-started', game)
    }
  })

  socket.on('submit-answer', async ({ gameId, questionId, answerIndex, timeTaken }) => {
    try {
      const game = games.get(gameId)
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
      const game = games.get(gameId)
      if (!game) return

      const attacker = game.players.find(p => p.id === socket.data.userId)
      const target = game.players.find(p => p.id === targetId)

      if (!attacker || !target) return

      const attackCosts = {
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

      await supabaseAdmin.from('attacks_used').insert({
        game_id: gameId,
        attacker_id: socket.data.userId,
        target_id: targetId,
        attack_type: attackType,
      })

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
      const game = games.get(gameId)
      if (!game) return

      game.questionIndex++
      game.players.forEach(p => {
        p.answered = false
        p.answerTime = null
      })

      if (game.questionIndex >= game.totalQuestions) {
        const finishedGame = games.get(gameId)
        if (finishedGame) {
          for (const player of finishedGame.players) {
            const xpGained = Math.floor(player.score / 10)
            const coinsGained = player.correctAnswers * 5

            await supabaseAdmin.rpc('update_player_stats', {
              player_id: player.id,
              xp_gained: xpGained,
              coins_gained: coinsGained,
              correct_answers: player.correctAnswers,
            })
          }

          io.to(gameId).emit('game-finished', finishedGame)
          games.delete(gameId)
          finishedGame.players.forEach(p => playerGames.delete(p.id))
        }
      } else {
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
      const game = games.get(gameId)
      if (game) {
        game.players = game.players.filter(p => p.id !== socket.data.userId)
        playerGames.delete(socket.data.userId)

        if (game.players.length === 0) {
          games.delete(gameId)
        } else {
          io.to(gameId).emit('player-left', {
            playerId: socket.data.userId,
            game,
          })
        }
      }
    }
    console.log('User disconnected:', socket.data.userId)
  })
})

const PORT = process.env.SOCKET_PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

