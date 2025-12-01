-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT DEFAULT 'default-avatar.png',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 100,
  streak INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL, -- 'cartoons', 'bollywood', 'hollywood', 'gadgets', 'snacks', 'toys'
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of 4 options
  correct_answer INTEGER NOT NULL, -- Index 0-3
  difficulty TEXT DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games Table
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mode TEXT NOT NULL, -- 'solo', '1v1', '4player', 'random', 'friends'
  room_code TEXT UNIQUE,
  status TEXT DEFAULT 'waiting', -- 'waiting', 'active', 'finished'
  max_players INTEGER DEFAULT 1,
  current_players INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Participants
CREATE TABLE IF NOT EXISTS game_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES profiles(id),
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  attacks_used INTEGER DEFAULT 0,
  attacks_received INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, player_id)
);

-- Game Answers
CREATE TABLE IF NOT EXISTS game_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES profiles(id),
  question_id UUID REFERENCES questions(id),
  answer_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER, -- milliseconds
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attacks Used
CREATE TABLE IF NOT EXISTS attacks_used (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  attacker_id UUID REFERENCES profiles(id),
  target_id UUID REFERENCES profiles(id),
  attack_type TEXT NOT NULL, -- 'blur', 'reverse', 'shake', 'freeze', 'fake'
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard (Materialized View for performance)
CREATE TABLE IF NOT EXISTS leaderboard (
  player_id UUID REFERENCES profiles(id) PRIMARY KEY,
  username TEXT NOT NULL,
  avatar TEXT,
  total_score BIGINT DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Leaderboard
CREATE TABLE IF NOT EXISTS weekly_leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player_id UUID REFERENCES profiles(id),
  week_start DATE NOT NULL,
  score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  UNIQUE(player_id, week_start)
);

-- Friends
CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  friend_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_room_code ON games(room_code);
CREATE INDEX IF NOT EXISTS idx_game_participants_game ON game_participants(game_id);
CREATE INDEX IF NOT EXISTS idx_game_answers_game ON game_answers(game_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_leaderboard_week ON weekly_leaderboard(week_start, score DESC);
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id, status);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attacks_used ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Games policies
CREATE POLICY "Users can view all games" ON games FOR SELECT USING (true);
CREATE POLICY "Users can create games" ON games FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own games" ON games FOR UPDATE USING (auth.uid() = created_by);

-- Game participants policies
CREATE POLICY "Users can view game participants" ON game_participants FOR SELECT USING (true);
CREATE POLICY "Users can join games" ON game_participants FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Game answers policies
CREATE POLICY "Users can view own answers" ON game_answers FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "Users can submit answers" ON game_answers FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Attacks policies
CREATE POLICY "Users can view attacks in their games" ON attacks_used FOR SELECT USING (
  EXISTS (SELECT 1 FROM game_participants WHERE game_id = attacks_used.game_id AND player_id = auth.uid())
);

-- Leaderboard policies
CREATE POLICY "Everyone can view leaderboard" ON leaderboard FOR SELECT USING (true);

-- Weekly leaderboard policies
CREATE POLICY "Everyone can view weekly leaderboard" ON weekly_leaderboard FOR SELECT USING (true);

-- Friendships policies
CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = friend_id
);
CREATE POLICY "Users can create friendships" ON friendships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own friendships" ON friendships FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'player_' || substr(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO leaderboard (player_id, username, avatar, total_score, games_played, level)
  SELECT 
    p.id,
    p.username,
    p.avatar,
    COALESCE(SUM(gp.score), 0),
    COUNT(DISTINCT gp.game_id),
    p.level
  FROM profiles p
  LEFT JOIN game_participants gp ON gp.player_id = p.id
  WHERE p.id = NEW.player_id
  GROUP BY p.id, p.username, p.avatar, p.level
  ON CONFLICT (player_id) DO UPDATE
  SET 
    total_score = EXCLUDED.total_score,
    games_played = EXCLUDED.games_played,
    level = EXCLUDED.level,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

