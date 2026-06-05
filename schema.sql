-- WallSplat.gg Database Schema

-- Enable UUID extension if not already present (PostgreSQL standard)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: players
CREATE TABLE IF NOT EXISTS players (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,          -- e.g. "Arslan Ash"
  real_name     TEXT,                   -- e.g. "Arslan Siddique"
  nationality   TEXT,                   -- e.g. "Pakistan"
  country_code  CHAR(2),                -- ISO 3166-1 alpha-2, e.g. "PK"
  flag_emoji    TEXT,                   -- e.g. "🇵🇰"
  profile_image_url TEXT,
  twitter_handle    TEXT,
  twitch_handle     TEXT,
  youtube_handle    TEXT,
  liquipedia_url    TEXT UNIQUE,            -- Slug or URL for scraper matching
  bio           TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Table: characters
CREATE TABLE IF NOT EXISTS characters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,   -- e.g. "Ling Xiaoyu"
  portrait_url  TEXT,                   -- Character art URL
  icon_url      TEXT                    -- Small icon URL
);

-- Table: player_characters
CREATE TABLE IF NOT EXISTS player_characters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  character_id    UUID REFERENCES characters(id) ON DELETE CASCADE,
  usage_pct       NUMERIC(5,2),         -- e.g. 78.50 (%)
  is_main         BOOLEAN DEFAULT false,
  UNIQUE(player_id, character_id)
);

-- Table: tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,        -- e.g. "EVO 2024"
  short_name      TEXT,                 -- e.g. "EVO24"
  start_date      DATE NOT NULL,
  end_date        DATE,
  location        TEXT,                 -- e.g. "Las Vegas, USA"
  country_code    CHAR(2),
  tier            TEXT CHECK (tier IN ('TWT_MASTER', 'TWT_CHALLENGER', 'MAJOR', 'PREMIER')),
  region          TEXT CHECK (region IN ('NA', 'EU', 'ASIA', 'LATAM', 'OCE', 'GLOBAL')),
  prize_pool      INTEGER,              -- USD
  liquipedia_url  TEXT NOT NULL UNIQUE, -- Source URL for scraper
  bracket_url     TEXT,
  total_entrants  INTEGER,
  is_twt_official BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Table: placements
CREATE TABLE IF NOT EXISTS placements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  tournament_id   UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  placement       INTEGER NOT NULL,     -- 1 = 1st, 2 = 2nd, etc.
  twt_points      INTEGER DEFAULT 0,
  prize_won       NUMERIC(10,2),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, tournament_id)
);

-- Table: matches
CREATE TABLE IF NOT EXISTS matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  player1_id      UUID REFERENCES players(id) ON DELETE SET NULL,
  player2_id      UUID REFERENCES players(id) ON DELETE SET NULL,
  winner_id       UUID REFERENCES players(id) ON DELETE SET NULL,
  player1_score   INTEGER,
  player2_score   INTEGER,
  round_name      TEXT,                 -- e.g. "Winners Finals"
  bracket_phase   TEXT,                 -- CHECK removed/expanded to support varying phases
  vod_url         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Table: rankings (cached, rebuilt on each scrape)
CREATE TABLE IF NOT EXISTS rankings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  rank            INTEGER NOT NULL,     -- 1–25
  total_twt_pts   INTEGER DEFAULT 0,
  total_matches   INTEGER DEFAULT 0,
  total_wins      INTEGER DEFAULT 0,
  win_rate        NUMERIC(5,2),         -- e.g. 73.45 (%)
  season          TEXT DEFAULT '2024',
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, season)
);

-- Table: scrape_log
CREATE TABLE IF NOT EXISTS scrape_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url      TEXT,
  status          TEXT CHECK (status IN ('SUCCESS','PARTIAL','FAILED')),
  records_upserted INTEGER DEFAULT 0,
  error_message   TEXT,
  triggered_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);
