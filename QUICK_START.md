# 🚀 Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Supabase account created
- [ ] Supabase project created

## Step-by-Step Setup

### 1️⃣ Install Dependencies (1 minute)

```bash
npm install
```

### 2️⃣ Set Up Supabase Database (2 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open your project
3. Click **SQL Editor** → **New Query**
4. Open `supabase/complete-setup.sql` from your project
5. Copy ALL contents and paste into SQL Editor
6. Click **Run** (or press `Ctrl+Enter`)

✅ **Verify:** Check Table Editor - you should see 9 tables

### 3️⃣ Configure Environment Variables (2 minutes)

1. In Supabase Dashboard → **Settings** → **API**
2. Copy these three values:
   - Project URL
   - `anon` public key
   - `service_role` key (keep secret!)

3. Create `.env.local` in project root:
   ```bash
   # Windows PowerShell
   New-Item -Path .env.local -ItemType File
   
   # Or create manually in your editor
   ```

4. Paste this template and fill in your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   ```

📖 **Detailed guide:** See [ENV_SETUP.md](./ENV_SETUP.md)

### 4️⃣ Start the Servers (1 minute)

**Terminal 1 - Next.js App:**
```bash
npm run dev
```
✅ Should see: `Ready on http://localhost:3000`

**Terminal 2 - Socket.IO Server:**
```bash
npm run socket
```
✅ Should see: `Socket.IO server running on port 3001`

### 5️⃣ Seed Questions (Optional)

In a new terminal or browser:
```bash
curl -X POST http://localhost:3000/api/questions/seed
```

Or visit: `http://localhost:3000/api/questions/seed` (may need a POST tool)

### 6️⃣ Test It! 🎮

1. Open browser: `http://localhost:3000`
2. Click **Sign Up**
3. Create an account
4. Start playing!

## Common Issues

### Port Already in Use
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Or change port in package.json scripts
```

### Socket.IO Connection Failed
- Make sure Socket.IO server is running (`npm run socket`)
- Check `NEXT_PUBLIC_SOCKET_URL` matches port 3001

### Database Errors
- Verify SQL setup completed successfully
- Check environment variables are correct
- Restart both servers

## What's Next?

- 🎮 Play Solo Quiz mode
- 👥 Try 1v1 Battle
- 🏆 Check the Leaderboard
- 💰 Earn coins and level up!

## Need More Help?

- 📖 [Full Setup Guide](./SETUP.md)
- 🔐 [Environment Variables Guide](./ENV_SETUP.md)
- 🗄️ [Database Setup Guide](./SUPABASE_SETUP.md)

