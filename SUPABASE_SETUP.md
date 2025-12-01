# 🗄️ Supabase Database Setup Guide

Follow these steps to set up your Supabase database for Nostalgia Quiz Battle.

## Step-by-Step Instructions

### 1. Access Supabase SQL Editor

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query** to create a new SQL query

### 2. Run the Complete Setup SQL

1. Open the file `supabase/complete-setup.sql` in your project
2. **Copy the entire contents** of the file
3. **Paste it into the Supabase SQL Editor**
4. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

This will create:
- ✅ All database tables
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Database functions
- ✅ Triggers for automatic profile creation

### 3. Verify Setup

After running the SQL, verify everything was created:

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `profiles`
   - `questions`
   - `games`
   - `game_participants`
   - `game_answers`
   - `attacks_used`
   - `leaderboard`
   - `weekly_leaderboard`
   - `friendships`

3. Go to **Database** → **Functions** to verify:
   - `handle_new_user()` function exists
   - `update_player_stats()` function exists

### 4. Seed Sample Questions (Optional)

You can seed questions in two ways:

#### Option A: Using the API Endpoint (Recommended)

1. Start your Next.js dev server: `npm run dev`
2. Make a POST request to: `http://localhost:3000/api/questions/seed`
   - Using curl:
     ```bash
     curl -X POST http://localhost:3000/api/questions/seed
     ```
   - Or visit the URL in your browser (though POST requests need a tool)

#### Option B: Manual Insert via SQL Editor

Run this SQL in the Supabase SQL Editor:

```sql
-- Insert sample questions
INSERT INTO questions (category, question, options, correct_answer, difficulty) VALUES
('cartoons', 'Which cartoon character had a catchphrase "Cowabunga!"?', 
 '["Teenage Mutant Ninja Turtles", "SpongeBob SquarePants", "Tom and Jerry", "The Simpsons"]'::jsonb, 
 0, 'easy'),
('cartoons', 'What was the name of the main character in "Dragon Ball Z"?', 
 '["Vegeta", "Goku", "Piccolo", "Gohan"]'::jsonb, 
 1, 'medium'),
('bollywood', 'Which actor starred in "Dilwale Dulhania Le Jayenge" (1995)?', 
 '["Aamir Khan", "Shah Rukh Khan", "Salman Khan", "Akshay Kumar"]'::jsonb, 
 1, 'easy'),
('hollywood', 'Which movie featured the quote "I''ll be back"?', 
 '["Predator", "The Terminator", "Total Recall", "Commando"]'::jsonb, 
 1, 'easy'),
('gadgets', 'What was the storage capacity of a standard floppy disk?', 
 '["1.44 MB", "2.88 MB", "720 KB", "360 KB"]'::jsonb, 
 0, 'medium'),
('toys', 'Which spinning top toy was popular in the 2000s?', 
 '["Beyblade", "Top Trumps", "Yo-yo", "Fidget Spinner"]'::jsonb, 
 0, 'easy');
```

### 5. Test Authentication

1. Make sure your `.env.local` has the correct Supabase credentials
2. Start your app: `npm run dev`
3. Visit `http://localhost:3000`
4. Try signing up - a profile should be automatically created!

## Troubleshooting

### Error: "relation already exists"
- This means tables already exist. You can either:
  - Drop existing tables and re-run the setup
  - Or skip the `CREATE TABLE` statements if you just want to update policies

### Error: "permission denied"
- Make sure you're running the SQL as the database owner
- Check that you're in the correct Supabase project

### Error: "function already exists"
- This is fine - the `CREATE OR REPLACE FUNCTION` will update existing functions
- You can safely ignore these warnings

### RLS Policies Not Working
- Make sure RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Verify policies are created correctly
- Check that users are authenticated when testing

## Next Steps

After database setup:
1. ✅ Configure environment variables (`.env.local`)
2. ✅ Start Next.js server: `npm run dev`
3. ✅ Start Socket.IO server: `npm run socket`
4. ✅ Seed questions (using API or SQL)
5. ✅ Create your first user account
6. ✅ Start playing!

## Need Help?

- Check the main [SETUP.md](./SETUP.md) file
- Review Supabase documentation: https://supabase.com/docs
- Check the SQL files in the `supabase/` directory

