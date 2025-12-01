-- Function to update player stats after game
CREATE OR REPLACE FUNCTION update_player_stats(
  player_id UUID,
  xp_gained INTEGER,
  coins_gained INTEGER,
  correct_answers INTEGER
)
RETURNS VOID AS $$
DECLARE
  current_xp INTEGER;
  current_level INTEGER;
  new_xp INTEGER;
  new_level INTEGER;
  xp_for_next_level INTEGER;
BEGIN
  -- Get current stats
  SELECT xp, level INTO current_xp, current_level
  FROM profiles
  WHERE id = player_id;

  -- Calculate new XP and level
  new_xp := COALESCE(current_xp, 0) + xp_gained;
  new_level := current_level;
  xp_for_next_level := new_level * 1000; -- 1000 XP per level

  -- Level up if needed
  WHILE new_xp >= xp_for_next_level LOOP
    new_level := new_level + 1;
    xp_for_next_level := new_level * 1000;
  END LOOP;

  -- Update profile
  UPDATE profiles
  SET
    xp = new_xp,
    level = new_level,
    coins = COALESCE(coins, 0) + coins_gained,
    last_played_at = NOW()
  WHERE id = player_id;

  -- Update leaderboard
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
  WHERE p.id = player_id
  GROUP BY p.id, p.username, p.avatar, p.level
  ON CONFLICT (player_id) DO UPDATE
  SET 
    total_score = EXCLUDED.total_score,
    games_played = EXCLUDED.games_played,
    level = EXCLUDED.level,
    updated_at = NOW();

  -- Update weekly leaderboard
  INSERT INTO weekly_leaderboard (player_id, week_start, score, games_played)
  SELECT 
    player_id,
    DATE_TRUNC('week', NOW())::DATE,
    COALESCE(SUM(gp.score), 0),
    COUNT(DISTINCT gp.game_id)
  FROM game_participants gp
  WHERE gp.player_id = player_id
    AND gp.joined_at >= DATE_TRUNC('week', NOW())
  GROUP BY player_id
  ON CONFLICT (player_id, week_start) DO UPDATE
  SET 
    score = EXCLUDED.score,
    games_played = EXCLUDED.games_played;
END;
$$ LANGUAGE plpgsql;

