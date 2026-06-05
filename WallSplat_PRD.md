# WallSplat.gg — Product Requirements Document
**Version:** 1.0  
**Status:** Ready for Agent Implementation  
**Platform:** Antigravity  
**Last Updated:** June 2026  
**Prepared by:** AI Product Manager

---

## Table of Contents
1. Executive Summary & Goals
2. User Personas & Jobs to Be Done
3. Core Entities & Data Model
4. Functional & Non-Functional Requirements
5. User Stories & Acceptance Criteria
6. Edge Cases & Error Handling
7. UI/UX Guidelines & States
8. Scope, Out-of-Scope & Open Questions
9. Rollout & GTM Plan
10. Appendix A — Tournament Scrape Targets
11. Appendix B — Known Top Players Seed List

---

## 1. Executive Summary & Goals

### What We're Building
**WallSplat.gg** is a web-based stats tracker for professional Tekken 8 players. It displays a ranked leaderboard of the Top 25 players by official Tekken World Tour (TWT) points, individual player profile pages with career stats and character usage, and a head-to-head comparison tool between any two players. Data is sourced by scraping Liquipedia on-demand and stored in a Supabase database.

### The Name
"Wall Splat" is a core Tekken mechanic — landing an opponent against a wall for bonus damage. It's instantly recognizable to any Tekken player, memorable to casual fans, and has no existing brand conflict. Domain: `wallsplat.gg`

### Why Now
The Tekken 8 competitive scene is growing rapidly following its January 2024 launch. There is no single clean, beautifully designed destination for casual fans to follow the top pros. Existing resources (Liquipedia, Eventhubs) are functional but cluttered and not casual-fan friendly.

### Success Metrics (KPIs)
| Metric | Target (3 months post-launch) |
|---|---|
| Monthly Unique Visitors | 5,000+ |
| Avg. Session Duration | > 2 min |
| Player Profile Page Views | > 60% of all sessions |
| Scraper Success Rate | > 95% per run |
| Page Load Time (LCP) | < 2.5 seconds |
| Mobile Usability Score | > 90 (Lighthouse) |

---

## 2. User Personas & Jobs to Be Done

### Primary Persona — "The Casual Fan" (Casey, 24)
- Watches Tekken 8 tournaments on Twitch/YouTube, doesn't compete
- Follows 3–5 pro players, wants to know their records and stats
- Browses on mobile, has short attention span, visual learner
- **Pain Today:** Has to manually check Liquipedia (confusing layout), Reddit, or Twitter to piece together a player's record
- **Gain with WallSplat:** Lands on a clean page, sees the leaderboard instantly, taps a player card, gets the full story

### Secondary Persona — "The Debater" (Marcus, 28)
- Plays Tekken casually, argues about who the best player is online
- Wants facts to back up opinions in Discord/Reddit arguments
- **Pain Today:** No easy head-to-head comparison tool exists
- **Gain with WallSplat:** Opens the H2H tool, shares a screenshot in Discord

### Before / After Scenario
**Before:** Casey searches "top Tekken 8 players 2024" → lands on a Liquipedia list with broken formatting → gives up and asks on Reddit.  
**After:** Casey opens wallsplat.gg → immediately sees a ranked card list of Top 25 → taps "Arslan Ash" → sees his win rate, main character, recent results → shares profile link in Discord.

---

## 3. Core Entities & Data Model

### Technology Stack
| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR for SEO, fast routing |
| Styling | Tailwind CSS | Rapid styling, dark theme support |
| Database | Supabase (PostgreSQL) | Free tier, real-time, easy REST API |
| Scraper | Python (Playwright + BeautifulSoup4) | Handles JS-rendered Liquipedia pages |
| Hosting | Vercel | Zero-config Next.js deployment |
| Trigger | Admin page (password-protected) with a "Run Scraper" button | Manual, per user requirement |

### Database Schema (Supabase / PostgreSQL)

#### Table: `players`
```sql
CREATE TABLE players (
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
  liquipedia_url    TEXT,
  bio           TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: `characters`
```sql
CREATE TABLE characters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,          -- e.g. "Ling Xiaoyu"
  portrait_url  TEXT,                   -- Character art URL
  icon_url      TEXT                    -- Small icon URL
);
```

#### Table: `player_characters`
```sql
CREATE TABLE player_characters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  character_id    UUID REFERENCES characters(id),
  usage_pct       NUMERIC(5,2),         -- e.g. 78.50 (%)
  is_main         BOOLEAN DEFAULT false
);
```

#### Table: `tournaments`
```sql
CREATE TABLE tournaments (
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
  liquipedia_url  TEXT NOT NULL,        -- Source URL for scraper
  bracket_url     TEXT,
  total_entrants  INTEGER,
  is_twt_official BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: `placements`
```sql
CREATE TABLE placements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID REFERENCES players(id) ON DELETE CASCADE,
  tournament_id   UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  placement       INTEGER NOT NULL,     -- 1 = 1st, 2 = 2nd, etc.
  twt_points      INTEGER DEFAULT 0,
  prize_won       NUMERIC(10,2),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, tournament_id)
);
```

#### Table: `matches`
```sql
CREATE TABLE matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  player1_id      UUID REFERENCES players(id),
  player2_id      UUID REFERENCES players(id),
  winner_id       UUID REFERENCES players(id),
  player1_score   INTEGER,
  player2_score   INTEGER,
  round_name      TEXT,                 -- e.g. "Winners Finals"
  bracket_phase   TEXT CHECK (bracket_phase IN (
                    'POOLS','TOP64','TOP32','TOP16',
                    'TOP8','SEMIS','GRANDS',
                    'LOSERS_FINAL','WINNERS_FINAL')),
  vod_url         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: `rankings` (cached, rebuilt on each scrape)
```sql
CREATE TABLE rankings (
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
```

#### Table: `scrape_log`
```sql
CREATE TABLE scrape_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url      TEXT,
  status          TEXT CHECK (status IN ('SUCCESS','PARTIAL','FAILED')),
  records_upserted INTEGER DEFAULT 0,
  error_message   TEXT,
  triggered_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);
```

---

## 4. Functional & Non-Functional Requirements

### Functional Requirements

#### FR-01: Leaderboard Page (Home)
- Display Top 25 players ranked by TWT points (descending)
- Each card shows: Rank badge, Player photo, Player name, Nationality flag + country, Main character portrait, TWT Points, Win Rate %, Total Matches
- Clicking/tapping any player card navigates to that player's profile page
- Rankings table is sortable by: Rank (default), Win Rate, Total Matches
- Last updated timestamp shown at the top

#### FR-02: Player Profile Page
- URL: `/players/[player-slug]`
- Hero section: Large player photo, name, flag, active season badge
- Stats grid: TWT Points, Overall Win Rate, Total Matches, Total Wins, Career Earnings (if available)
- Main characters section: Character portrait(s) with usage percentage
- Tournament history table: Tournament name, Date, Placement, Points Earned — sorted by date desc
- Recent matches section: Last 10 matches with opponent name, score, result (W/L), tournament name
- Social links: Twitter, Twitch, YouTube
- "Compare" button that pre-populates the H2H tool with this player

#### FR-03: Head-to-Head Comparison Tool
- URL: `/compare?p1=[slug]&p2=[slug]`
- Two player selector dropdowns (searchable)
- Side-by-side stats: TWT Points, Win Rate, Matches, Wins, Losses
- Direct encounters section: List all matches these two players have played against each other — date, tournament, score, winner highlighted
- Overall H2H record: e.g. "Arslan Ash leads 5–3"
- If no direct matches found: display "No recorded head-to-head matches" message
- Share button: copies URL with player params to clipboard

#### FR-04: Manual Scrape Trigger (Admin)
- URL: `/admin` (password-protected via environment variable `ADMIN_PASSWORD`)
- Simple page with a "Run Scraper" button
- Displays scrape progress log in real-time (streamed via Server-Sent Events or polling)
- Shows last scrape timestamp and status per tournament
- Allows scraping all tournaments or selecting individual ones via checkboxes
- Displays scrape_log table with last 20 runs

#### FR-05: Scraper (Python Script)
- Targets: Liquipedia Tekken 8 tournament pages (see Appendix A for full list)
- Scrapes per tournament: Bracket/placement results, Player names, Match scores, Round names
- Upserts data into Supabase (never duplicates)
- After scrape: rebuilds the `rankings` table by aggregating placements and matches
- Win rate formula: `(total_wins / total_matches) * 100` — only counting tracked matches
- TWT points: scraped directly from official TWT standings page on Liquipedia
- Logs every run to `scrape_log` table

### Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page Load (LCP) | < 2.5s on desktop, < 3.5s on mobile (3G) |
| Lighthouse Performance | > 85 |
| Lighthouse Accessibility | > 90 |
| Mobile Responsiveness | Works on 375px viewport (iPhone SE) |
| Scraper Runtime | < 5 minutes per full run |
| Database Query Time | < 200ms for leaderboard query |
| Uptime | 99.5%+ (Vercel + Supabase free tier) |
| Browser Support | Last 2 versions of Chrome, Firefox, Safari, Edge |

---

## 5. User Stories & Acceptance Criteria

### Story 1 — View the Leaderboard
**As a** casual Tekken fan  
**I want to** see the Top 25 ranked players on the home page  
**So that** I know who the best players in the world are right now

**Precondition:** Rankings table has at least 1 row; database is reachable  
**Trigger:** User navigates to wallsplat.gg  

**Acceptance Criteria:**
- AC1: Page renders within 2.5 seconds
- AC2: Exactly 25 player cards are displayed (or fewer if data has < 25 players)
- AC3: Cards are ordered by rank (1 at top)
- AC4: Each card displays: rank number, player name, flag emoji, main character name, TWT points, win rate
- AC5: Clicking a card navigates to `/players/[slug]`
- AC6: "Last updated: [date]" is visible on the page

### Story 2 — View a Player Profile
**As a** casual fan  
**I want to** tap on a player and see their full stats and tournament history  
**So that** I can learn about their career and performance

**Precondition:** Player exists in `players` table with associated placements and matches  
**Trigger:** User clicks player card on leaderboard OR navigates directly to `/players/arslan-ash`  

**Acceptance Criteria:**
- AC1: Hero section shows player name, flag, photo (or placeholder if no photo)
- AC2: Stats grid shows TWT Points, Win Rate, Total Matches, Total Wins
- AC3: Main character(s) shown with portrait and usage %
- AC4: Tournament history table shows all tournaments the player has participated in, sorted newest first
- AC5: Each tournament row shows: Name, Date, Placement (with medal emoji for top 3), Points earned
- AC6: Recent Matches section shows last 10 matches with: Opponent name (linked), Score, Result badge (W = green, L = red), Tournament name
- AC7: Social links are shown only if data exists (no broken empty icons)
- AC8: "Compare with another player" button is visible and functional

### Story 3 — Head-to-Head Comparison
**As a** fan wanting to settle a debate  
**I want to** compare two players side-by-side with their stats and direct match history  
**So that** I can objectively see who has the better record

**Precondition:** At least 2 players exist in the database  
**Trigger:** User navigates to `/compare` or clicks Compare from a player profile  

**Acceptance Criteria:**
- AC1: Two searchable player dropdowns are shown
- AC2: Selecting both players renders side-by-side stat comparison
- AC3: Superior stat in each row is visually highlighted (bold / colored)
- AC4: Direct encounter section lists every match between the two players from the database
- AC5: Overall H2H record is shown (e.g., "Knee leads 4–2")
- AC6: If no H2H data exists, a friendly empty state message is shown
- AC7: Share button copies URL `?p1=knee&p2=arslan-ash` to clipboard and shows a "Copied!" toast
- AC8: URL params pre-populate the selectors when the page loads with `?p1=` and `?p2=`

### Story 4 — Trigger a Scrape (Admin)
**As the** site owner  
**I want to** press a button to update all player and tournament data  
**So that** the leaderboard stays accurate after new tournaments

**Precondition:** Admin is authenticated via password; scraper script is deployed  
**Trigger:** Admin navigates to `/admin`, enters password, clicks "Run Scraper"  

**Acceptance Criteria:**
- AC1: `/admin` route is password-protected — redirects to login if not authenticated
- AC2: Dashboard shows list of all tracked tournaments with their last-scraped status
- AC3: "Run Full Scrape" button triggers the scraper for all tournaments
- AC4: Progress is shown in real-time (line-by-line log output or status indicators per tournament)
- AC5: On completion: success/failure status shown per tournament, rankings table rebuilt
- AC6: Last 20 scrape runs shown in a log table with: date, status, records upserted, any error message
- AC7: Errors do not crash the page — failed tournaments are flagged but others continue

---

## 6. Edge Cases & Error Handling

### Scraper Edge Cases
| Scenario | Handling |
|---|---|
| Liquipedia page is down | Catch HTTP error, log to `scrape_log` with status FAILED, continue to next tournament |
| Player name on Liquipedia doesn't match database | Fuzzy match by name (Levenshtein distance < 2); if no match, create new player record with flag for manual review |
| Tournament bracket is incomplete (event ongoing) | Scrape partial results, mark tournament as `in_progress`, do not overwrite existing confirmed placements |
| Duplicate match detected | Upsert by `(tournament_id, player1_id, player2_id, round_name)` unique constraint |
| Player has 0 matches in database | Win rate shown as "N/A", not 0% |
| Scraper runs > 10 minutes | Auto-timeout, log partial success, send alert to admin dashboard |
| Playwright fails to render JS | Fallback to requests + BeautifulSoup for static parse |

### Frontend Edge Cases
| Scenario | Handling |
|---|---|
| Player has no profile photo | Show a styled silhouette placeholder matching Tekken aesthetic |
| Player profile page for non-existent slug | Return Next.js 404 page with "Fighter Not Found" message and link back to leaderboard |
| Compare page with same player selected for both | Show validation error: "Select two different players" |
| Supabase is unreachable | Show site-wide error banner: "Stats are temporarily unavailable. Check back soon." |
| Leaderboard has fewer than 25 players | Show however many exist; no empty card slots |
| Win rate rounds to 100% | Display as "100%" not "100.00%" |
| Very long player names (e.g., double-barreled) | Truncate with ellipsis on cards; show full name on profile page |
| H2H players with 0 direct matches | Show: "These players haven't met in any tracked tournament — yet." |

---

## 7. UI/UX Guidelines & States

### Visual Identity — Tekken Aesthetic
The site must feel like it belongs in the Tekken universe. Key references: Tekken 8's main menu UI — dark/black backgrounds, red and gold accent colors, sharp angular elements, cinematic character art.

**Color Palette:**
```
Background Primary:   #0A0A0A  (near-black)
Background Card:      #111111  (dark card surface)
Background Elevated:  #1A1A1A  (slightly lifted surfaces)
Accent Red:           #C8102E  (Tekken red — Iron Fist color)
Accent Gold:          #FFD700  (champion gold, used for rank #1)
Text Primary:         #F5F5F5  (off-white)
Text Secondary:       #888888  (muted gray)
Win Green:            #22C55E
Loss Red:             #EF4444
Border:               #2A2A2A  (subtle dark borders)
```

**Typography:**
- Headings: `Rajdhani` (Google Fonts) — angular, sci-fi, matches Tekken's typeface
- Body: `Inter` — clean, readable
- Stat numbers: `Rajdhani Bold` in large size for impact

**Layout:**
- Max content width: 1200px, centered
- Mobile-first, fully responsive
- Leaderboard: CSS Grid — 2 columns on tablet, 1 on mobile, 3 on desktop
- Player profile: two-column layout on desktop (hero left, stats right), stacked on mobile

### Global UI States

#### Loading State
- Skeleton cards that match the card shape (shimmer animation, dark theme)
- No spinners — skeleton only, feels more premium
- Show skeleton for exactly the number of expected items (25 on leaderboard)

#### Empty State
- Icon: Tekken fist or question mark styled to match theme
- Heading: "No Fighters Found"
- Body: context-specific message (e.g., "No head-to-head matches on record yet")
- CTA: Link back to leaderboard

#### Error State
- Dark red banner pinned to top of affected section
- Icon: ⚠️ Warning triangle
- Message: "Something went wrong loading this data."
- Retry button where applicable

#### Success State (Admin scrape)
- Green checkmark per tournament with records count
- Toast notification: "Leaderboard updated successfully"

### UX Copy Guidelines
- Tone: Enthusiastic but factual. Speak like an FGC commentator.
- Player placements: Use "Champion 🥇", "Runner-up 🥈", "3rd Place 🥉" for top 3
- Win rate: Display as "74.3% Win Rate" not just "74.3%"
- Points: "12,450 TWT Points" with comma formatting
- Matches: "142 Matches Played"
- Empty H2H: "No recorded clashes — yet." (conversational, not dry)
- 404: "Fighter Not Found. They might be in another bracket."

---

## 8. Scope, Out-of-Scope & Open Questions

### In Scope (V1)
- Home leaderboard page (Top 25 by TWT points)
- Individual player profile pages
- Head-to-head comparison tool
- Supabase database with all schema above
- Python scraper targeting Liquipedia (manual trigger)
- Admin dashboard with scrape trigger and logs
- Tekken 8 data only
- Tekken 8 official TWT tournaments + major community events (see Appendix A)
- Mobile-responsive design

### Out of Scope (V1 — Do Not Build)
- User accounts or authentication for visitors (admin only)
- Live bracket tracking during events
- Character tier lists or meta analysis pages
- Tekken 7 or any game other than Tekken 8
- Video embed or VOD hosting
- Comments or community features
- Notifications or email alerts
- Automated scraping schedule (no cron — manual only in V1)
- API for external consumers
- Internationalization / multi-language support
- Mobile native app

### Open Questions
| # | Question | Owner | Priority |
|---|---|---|---|
| OQ-1 | Does Liquipedia's ToS permit scraping? We should cache aggressively and limit request rate to 1 req/2s. If blocked, fallback is Start.gg API for bracket data. | Legal/Owner | HIGH |
| OQ-2 | Should TWT points reflect 2024 season, 2025 season, or all-time cumulative? This changes what "Top 25" means significantly. | Owner | HIGH |
| OQ-3 | Who maintains the player seed list? The scraper can identify players automatically from results, but someone needs to verify profile photos, bios, and social links. | Owner | MEDIUM |
| OQ-4 | Will the site monetize? (Ads, Patreon, merch affiliate links?) This affects layout decisions. | Owner | LOW |
| OQ-5 | Is `wallsplat.gg` domain available? Need to verify and register. Alternatives: `wallsplat.com`, `ironfiststats.gg` | Owner | HIGH |

---

## 9. Rollout & GTM Plan

### Feature Flags
Use Vercel environment variables to toggle features:
```
FEATURE_COMPARE_TOOL=true
FEATURE_ADMIN_PANEL=true
FEATURE_SCRAPER_ENABLED=true
ADMIN_PASSWORD=[set in Vercel env]
NEXT_PUBLIC_SUPABASE_URL=[set in Vercel env]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[set in Vercel env]
SUPABASE_SERVICE_ROLE_KEY=[set in Vercel env, server-side only]
```

### Phased Build Order for AI Agent (Antigravity)

**Phase 1 — Database & Seed Data (Do First)**
1. Create Supabase project
2. Run all schema SQL (see Section 3)
3. Seed the 25 known top players (see Appendix B)
4. Seed Tekken 8 characters table
5. Seed tournament list (see Appendix A)

**Phase 2 — Scraper**
1. Build Python scraper targeting Liquipedia
2. Test on 3 tournaments: EVO 2024, Combo Breaker 2024, EVO Japan 2024
3. Verify upsert logic — run twice, confirm no duplicates
4. Build rankings aggregation (post-scrape rebuild)
5. Add scrape_log writes

**Phase 3 — Backend / API Routes**
1. Next.js API route: `GET /api/rankings` → returns top 25 with player data
2. Next.js API route: `GET /api/players/[slug]` → player + stats + history
3. Next.js API route: `GET /api/compare?p1=[slug]&p2=[slug]` → H2H data
4. Next.js API route: `POST /api/admin/scrape` → triggers Python scraper (protected)

**Phase 4 — Frontend**
1. Global layout: navbar (logo + nav links) + footer
2. Home page — leaderboard grid with player cards
3. Player profile page
4. Compare tool page
5. Admin dashboard page
6. 404 page
7. Loading skeletons for all pages
8. Error states for all pages

**Phase 5 — Polish & Deploy**
1. Apply Tekken visual theme (colors, fonts, textures)
2. Lighthouse audit → fix performance issues
3. Deploy to Vercel
4. Point domain to Vercel
5. Run first manual scrape via admin panel
6. Verify all 25 players have data

### Go-to-Market
- Post on r/Tekken and r/Tekken8 on launch day
- Tweet/X at known Tekken content creators: @MarkManGaming, @avoiding_the_puddle (AAK)
- Share in TekkenDiscord.gg community servers
- Submit to fgctech.com and similar FGC communities

---

## Appendix A — Tournament Scrape Targets

All URLs are on Liquipedia (liquipedia.net/fighters/). The scraper should iterate this list.

### TWT Master Events (Highest Priority)
| Tournament | Year | Liquipedia Slug | TWT Tier |
|---|---|---|---|
| EVO Japan 2024 | 2024 | EVO_Japan/2024 | TWT Master |
| Combo Breaker 2024 | 2024 | Combo_Breaker/2024 | TWT Master |
| CEO 2024 | 2024 | CEO/2024 | TWT Master |
| VSFighting 2024 | 2024 | VSFighting/2024 | TWT Master |
| EVO 2024 | 2024 | EVO/2024 | TWT Master |
| CEOtaku 2024 | 2024 | CEOtaku/2024 | TWT Master |
| Tekken World Tour 2024 Finals | 2024 | Tekken_World_Tour/2024/Finals | TWT Premier |
| EVO Japan 2025 | 2025 | EVO_Japan/2025 | TWT Master |
| Combo Breaker 2025 | 2025 | Combo_Breaker/2025 | TWT Master |
| CEO 2025 | 2025 | CEO/2025 | TWT Master |
| EVO 2025 | 2025 | EVO/2025 | TWT Master |
| Tekken World Tour 2025 Finals | 2025 | Tekken_World_Tour/2025/Finals | TWT Premier |

### Major Community Events (Second Priority)
| Tournament | Year | Notes |
|---|---|---|
| Frosty Faustings XVI | 2024 | Large NA winter major |
| The Mixup 2024 | 2024 | Largest EU community major, Lyon France |
| Red Bull Kumite 2024 | 2024 | Invitational, prestige event |
| Battle of BC 6 | 2024 | Large Canadian major |
| Defending the North 2024 | 2024 | NA major |
| DreamHack Dallas 2024 | 2024 | NA major |
| NorCal Regionals 2024 | 2024 | NA regional |
| Frosty Faustings 2025 | 2025 | Large NA winter major |
| The Mixup 2025 | 2025 | EU major |

### TWT Official Standings Page
- URL to scrape for official TWT points: `liquipedia.net/fighters/Tekken_World_Tour/2024/Standings`
- URL for 2025: `liquipedia.net/fighters/Tekken_World_Tour/2025/Standings`
- This is the source of truth for rankings — scrape this FIRST before bracket data

---

## Appendix B — Known Top Players Seed List

Pre-populate the `players` table with these records. The scraper will fill in stats.

| # | Name | Country | Country Code | Liquipedia Slug | Known Main |
|---|---|---|---|---|---|
| 1 | Arslan Ash | Pakistan | PK | Arslan_Ash | Zafina / Xiaoyu |
| 2 | Knee | South Korea | KR | Knee | Various |
| 3 | Rangchu | South Korea | KR | Rangchu | Panda / Jack-8 |
| 4 | LowHigh | South Korea | KR | LowHigh | Various |
| 5 | Book | South Korea | KR | Book | Various |
| 6 | Ulsan | South Korea | KR | Ulsan | Hwoarang |
| 7 | JDCR | South Korea | KR | JDCR | Dragunov |
| 8 | Chikurin | Japan | JP | Chikurin | Various |
| 9 | Nobi | Japan | JP | Nobi | Dragunov |
| 10 | Anakin | USA | US | Anakin | Jack-8 |
| 11 | Atif Butt | Pakistan | PK | Atif_Butt | Various |
| 12 | Awais Honey | Pakistan | PK | Awais_Honey | Various |
| 13 | CherryBerryMango | Australia | AU | CherryBerryMango | Various |
| 14 | Tissuemon | Taiwan | TW | Tissuemon | Various |
| 15 | KiD | China | CN | KiD | Various |
| 16 | MYK | Japan | JP | MYK | Various |
| 17 | AO | Japan | JP | AO | Various |
| 18 | Scallywag | United Kingdom | GB | Scallywag | Various |
| 19 | Papamisha | Russia | RU | Papamisha | Various |
| 20 | Speedkicks | Australia | AU | Speedkicks | Various |
| 21 | Crow | Australia | AU | Crow | Various |
| 22 | Rip | USA | US | Rip | Various |
| 23 | Jeondding | South Korea | KR | Jeondding | Eddy |
| 24 | Meo-IL | South Korea | KR | Meo-IL | Various |
| 25 | Alec | Spain | ES | Alec | Various |

> Note: This seed list is approximate. The scraper will discover additional players from tournament brackets and the ranking system will surface the true Top 25 by TWT points after the first successful scrape. Players not in the Top 25 by points should be excluded from the leaderboard but kept in the database for H2H and profile functionality.

---

*End of Document — WallSplat.gg PRD v1.0*
*Ready for implementation in Antigravity AI Agent Platform*
