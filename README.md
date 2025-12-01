# 🎮 Nostalgia Quiz Battle

A real-time multiplayer quiz game with a neon-retro theme, bringing back memories from the 90s and early 2000s!

## 🚀 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** (Neon-retro styling)
- **Supabase** (Auth, Database, Realtime)
- **Socket.IO** (Live battle logic)

## ✨ Features

- 🔐 Authentication (Email/Password + Magic Link)
- 🎯 Multiple Game Modes (Solo, 1v1, 4-player, Random, Friends)
- ⚡ Real-time Battles
- 🎨 Attack System (Blur, Reverse Text, Shake, Time Freeze, Fake Option)
- 🏆 Leaderboards (Global, Friends, Weekly)
- 💰 Rewards System (Coins, XP, Levels, Streaks)

## 🛠️ Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

Quick start:

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

3. Set up database:
   - Run SQL from `supabase/schema.sql` in Supabase SQL Editor
   - Run SQL from `supabase/functions.sql` for helper functions

4. Start servers (you need TWO terminals):
```bash
# Terminal 1: Next.js app
npm run dev

# Terminal 2: Socket.IO server
npm run socket
```

5. Seed questions (optional):
```bash
curl -X POST http://localhost:3000/api/questions/seed
```

## 📝 Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## 🎮 Game Modes

- **Solo Quiz**: Practice mode
- **1 vs 1 Battle**: Head-to-head competition
- **4-player Room Battle**: Battle royale style
- **Random Matchmaking**: Quick match with strangers
- **Play With Friends**: Join with room code

## 🎨 Attack System

- **Blur Screen**: Question becomes blurry for 4 seconds
- **Reverse Text**: Question text becomes reversed
- **Screen Shake**: UI shakes for 3 seconds
- **Time Freeze**: Opponent timer stops for 2 seconds
- **Fake Option**: Adds a dummy 5th option

