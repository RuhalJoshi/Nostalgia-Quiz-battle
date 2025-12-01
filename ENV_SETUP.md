# 🔐 Environment Variables Setup Guide

This guide will walk you through configuring all environment variables needed for Nostalgia Quiz Battle.

## Step 1: Get Your Supabase Credentials

### 1.1 Access Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create an account
3. Select your project (or create a new one)

### 1.2 Find Your API Keys

1. In your Supabase project dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see three important values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   - Copy this entire URL

   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```
   - This is a long string starting with `eyJ...`
   - Safe to expose in client-side code

   **service_role key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```
   - This is also a long string starting with `eyJ...`
   - ⚠️ **KEEP THIS SECRET** - Never commit this to Git or expose it publicly!

## Step 2: Create `.env.local` File

### 2.1 Create the File

1. In your project root directory (`D:\Nostalgia Quiz Battle`), create a new file named `.env.local`
2. **Important:** Make sure it's named exactly `.env.local` (with the dot at the beginning)

### 2.2 Copy the Template

Copy this template into your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Socket.IO Server URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 2.3 Fill in Your Values

Replace the placeholder values with your actual Supabase credentials:

**Example:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.abcdefghijklmnopqrstuvwxyz1234567890
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM4OTY3MjkwLCJleHAiOjE5NTQ1NDMyOTB9.abcdefghijklmnopqrstuvwxyz1234567890

# Socket.IO Server URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Step 3: Verify Your Configuration

### 3.1 Check File Location

Make sure your `.env.local` file is in the project root:
```
D:\Nostalgia Quiz Battle\
├── .env.local          ← Should be here
├── package.json
├── next.config.js
├── app/
├── components/
└── ...
```

### 3.2 Verify File Format

- ✅ No spaces around the `=` sign
- ✅ No quotes around values (unless the value itself contains spaces)
- ✅ Each variable on its own line
- ✅ File is named `.env.local` (not `.env.local.txt`)

### 3.3 Test Your Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. If you see errors about missing environment variables, double-check:
   - File is named correctly (`.env.local`)
   - File is in the project root
   - Values are copied correctly (no extra spaces)
   - Restart the dev server after creating/modifying `.env.local`

## Step 4: Environment Variables Explained

### `NEXT_PUBLIC_SUPABASE_URL`
- **What it is:** Your Supabase project URL
- **Where to find:** Supabase Dashboard → Settings → API → Project URL
- **Example:** `https://abcdefghijklmnop.supabase.co`
- **Public:** Yes (safe to expose in client-side code)

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **What it is:** Your Supabase anonymous/public API key
- **Where to find:** Supabase Dashboard → Settings → API → anon public key
- **Public:** Yes (safe to expose in client-side code)
- **Used for:** Client-side authentication and database queries

### `SUPABASE_SERVICE_ROLE_KEY`
- **What it is:** Your Supabase service role key (admin access)
- **Where to find:** Supabase Dashboard → Settings → API → service_role key
- **Public:** ❌ **NO** - Keep this secret!
- **Used for:** Server-side operations, Socket.IO authentication
- **Security:** Never commit this to Git or expose it publicly

### `NEXT_PUBLIC_SOCKET_URL`
- **What it is:** URL where your Socket.IO server runs
- **Default:** `http://localhost:3001` (for development)
- **Production:** Change to your production Socket.IO server URL
- **Public:** Yes (needed by client-side code)

## Step 5: Security Best Practices

### ✅ DO:
- ✅ Keep `.env.local` in `.gitignore` (already configured)
- ✅ Use `.env.local` for local development
- ✅ Use environment variables in your hosting platform for production
- ✅ Restart your dev server after changing environment variables

### ❌ DON'T:
- ❌ Commit `.env.local` to Git
- ❌ Share your `SUPABASE_SERVICE_ROLE_KEY` publicly
- ❌ Put environment variables directly in your code
- ❌ Use production keys in development

## Step 6: Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Go to your hosting platform's dashboard
2. Navigate to **Environment Variables** or **Settings**
3. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SOCKET_URL` (your production Socket.IO URL)

## Troubleshooting

### Error: "Missing environment variable"
- ✅ Check file name is exactly `.env.local`
- ✅ Check file is in project root
- ✅ Restart dev server after creating/modifying `.env.local`
- ✅ Check for typos in variable names

### Error: "Invalid API key"
- ✅ Double-check you copied the entire key (they're very long)
- ✅ Make sure there are no extra spaces
- ✅ Verify you're using the correct key (anon vs service_role)

### Environment variables not loading
- ✅ Restart your dev server
- ✅ Check Next.js console for warnings
- ✅ Verify variable names start with `NEXT_PUBLIC_` for client-side access

## Quick Checklist

- [ ] Created `.env.local` file in project root
- [ ] Got Supabase Project URL
- [ ] Got Supabase Anon Key
- [ ] Got Supabase Service Role Key
- [ ] Filled in all values in `.env.local`
- [ ] Verified no extra spaces or quotes
- [ ] Restarted dev server
- [ ] Tested that app loads without errors

## Need Help?

If you're still having issues:
1. Check the console for specific error messages
2. Verify your Supabase project is active
3. Make sure you've run the database setup SQL
4. Review the main [SETUP.md](./SETUP.md) guide

