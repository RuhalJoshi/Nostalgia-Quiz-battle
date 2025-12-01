# 🎮 Nostalgia Quiz Battle - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep this secret!)

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Step 4: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase/schema.sql` to create all tables
4. Run the SQL from `supabase/functions.sql` to create helper functions

## Step 5: Seed Questions

After setting up the database, seed it with sample questions:

```bash
# Make a POST request to the seed endpoint
# You can use curl, Postman, or visit the API route in your browser after starting the dev server
curl -X POST http://localhost:3000/api/questions/seed
```

Or use the Supabase dashboard SQL editor to insert questions manually.

## Step 6: Start the Development Servers

You need to run TWO servers:

### Terminal 1: Next.js App
```bash
npm run dev
```

### Terminal 2: Socket.IO Server
```bash
npm run socket
```

The app will be available at `http://localhost:3000`
The Socket.IO server will run on `http://localhost:3001`

## Step 7: Create Your First Account

1. Visit `http://localhost:3000`
2. Click "Sign Up"
3. Create an account with email/password or use magic link
4. Your profile will be automatically created

## 🎯 Game Features

### Authentication
- Email/Password login
- Magic link authentication
- Automatic profile creation

### Game Modes
- **Solo Quiz**: Practice mode (no attacks)
- **1 vs 1 Battle**: Head-to-head with attacks
- **4-Player Room**: Battle royale style
- **Random Matchmaking**: Quick match with strangers
- **Play With Friends**: Join with room code

### Attack System
- **Blur Screen** (10 coins): Blurs question for 4 seconds
- **Reverse Text** (15 coins): Reverses question text
- **Screen Shake** (12 coins): Shakes UI for 3 seconds
- **Time Freeze** (20 coins): Freezes opponent timer for 2 seconds
- **Fake Option** (18 coins): Adds a dummy 5th option

### Rewards
- Coins earned per correct answer
- XP based on score
- Level up system (1000 XP per level)
- Streak tracking

## 🐛 Troubleshooting

### Socket.IO Connection Issues
- Make sure the Socket.IO server is running (`npm run socket`)
- Check that `NEXT_PUBLIC_SOCKET_URL` matches the Socket.IO server port
- Verify CORS settings in `socket-server.js`

### Database Errors
- Ensure all tables are created (run `schema.sql`)
- Check RLS policies are enabled
- Verify environment variables are correct

### Authentication Issues
- Clear browser cookies/localStorage
- Check Supabase project settings
- Verify email confirmation is disabled (for development)

## 📝 Development Notes

- Questions are stored in `lib/questions.ts` - add more there
- Game logic is in `server/socket.ts` and `socket-server.js`
- UI components are in `components/`
- Pages are in `app/` directory (Next.js App Router)

## 🚀 Production Deployment

1. Deploy Next.js app to Vercel/Netlify
2. Deploy Socket.IO server to a Node.js hosting service (Railway, Render, etc.)
3. Update `NEXT_PUBLIC_SOCKET_URL` to production Socket.IO URL
4. Set up environment variables in your hosting platform
5. Enable email confirmation in Supabase (for production)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Socket.IO Documentation](https://socket.io/docs)

