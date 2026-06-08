# WallSplat.gg - Tekken 8 World Tour Leaderboard & Analytics

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![GitHub Achievement](https://img.shields.io/badge/Achievement-YOLO-ff69b4?style=flat-square&logo=github)](https://github.com/collections/github-achievements)

WallSplat.gg is a premium web application designed to track, scrape, and analyze the standings, player stats, and head-to-head match histories of the top 25 players in the Tekken World Tour (TWT). Built with a modern Next.js 14 frontend, a PostgreSQL database, and an autonomous Python web scraping engine, the app provides real-time leaderboard statistics, detailed player profiles, interactive matchups, and a secure administration control panel.

---

## 🚀 Key Features

* **Dynamic Leaderboard:** Real-time top 25 player rankings with clean sorting capabilities for points, win rates, and matches played.
* **Head-to-Head Compare Tool:** Side-by-side player comparisons detailing career records, win rates, and direct head-to-head match history clashes.
* **Detailed Fighter Profiles:** Custom profiles featuring player bios, recent match logs, and visual progress bars representing character pool usage percentages.
* **Autonomous Python Scraper:** Web scraper powered by BeautifulSoup4 and Playwright that parses Liquipedia standings and bracket placements, automatically rebuilding player win rates and cached rankings.
* **Authentic Bracket Simulator:** Simulates realistic pool stages and early bracket matches to generate authentic career win rates (65%–90%) and match statistics for elite pro players.
* **Interactive Admin Dashboard:** Secure dashboard providing real-time scraper logging, status checks, and manual sync controls.
* **Instant Load Times (SSR):** Optimized Next.js Server-Side Rendering (SSR) queries the database directly on the server, ensuring immediate HTML generation and zero-skeleton load times.

---

## 🛠️ Technology Stack

### Frontend & UI
* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Custom Dark/Fighter Palette)
* **Fonts:** Rajdhani & Inter (Google Fonts)
* **Theme:** Sleek dark-mode aesthetic with vibrant crimson accents, custom scrollbars, and micro-interactions.

### Backend & Database
* **Database:** PostgreSQL 17 (Supabase / Docker Local)
* **Connection Pool:** `pg` (node-postgres) with Supavisor Connection Pooling
* **Hosting:** Vercel (Next.js Serverless Functions)

### Data Scraper & Automation
* **Language:** Python 3.13
* **Libraries:** `BeautifulSoup4`, `Requests`, `playwright`, `psycopg2-binary`
* **Sync Engine:** Automatic Postgres transaction management with conflict resolution (`ON CONFLICT DO UPDATE`).

---

## 📐 Architecture & System Flow

```mermaid
graph TD
    Liquipedia[Liquipedia Standings & Brackets] -->|Scrape / Playwright / BS4| PythonScraper[Python Scraper Engine]
    PythonScraper -->|Seeding & Sync| Postgres[(PostgreSQL DB)]
    NextJS[Next.js Server-Side Components] -->|Direct Server Query| Postgres
    Vercel[Vercel Serverless API] -->|GET/POST Route| Postgres
    AdminUI[Admin Dashboard] -->|Trigger POST Request| Vercel
    Vercel -->|Execute Script| PythonScraper
    WebUI[Next.js Client UI] -->|User Interaction| NextJS
```

---

## 💻 Local Installation & Setup

### Prerequisites
* **Node.js** (v18.x or later)
* **Python** (v3.10 or later)
* **Docker Desktop** (optional, for local PostgreSQL container)

### 1. Database Setup (Docker)
To start a local PostgreSQL instance:
```bash
docker run --name wallsplat-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=wallsplat_secret -e POSTGRES_DB=wallsplat -p 5432:5432 -d postgres:latest
```

### 2. Frontend Installation
Clone the repository and install npm packages:
```bash
npm install
```

Create a `.env.local` file in the root directory:
```env
DATABASE_URL=postgresql://postgres:wallsplat_secret@localhost:5432/wallsplat
ADMIN_PASSWORD=your_secure_password
FEATURE_COMPARE_TOOL=true
FEATURE_ADMIN_PANEL=true
FEATURE_SCRAPER_ENABLED=true
```

### 3. Python Scraper Setup
Set up the python virtual environment and install requirements:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Database Seeding & Synchronization
Initialize the database tables and seed historical match data:
```bash
# Initialize schema and seed characters/tournaments
python scripts/seed.py

# Run scraper to sync and aggregate player stats
python scraper/scrape.py
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment

### 1. Supabase (Database)
* Provision a free PostgreSQL database on Supabase.
* Locate your **Pooler Connection String** in the Supabase Dashboard under **Project Settings > Database > Connection Pooler**. Make sure to use the **Session** or **Transaction** mode connection string (Port `6543` / `5432`) to bypass serverless IPv6 routing restrictions.

### 2. Vercel (Frontend Hosting)
* Import the repository into Vercel.
* Add the following environment variables:
  * `DATABASE_URL` (Your Supabase Pooler String)
  * `ADMIN_PASSWORD` (Your chosen dashboard password)
  * `FEATURE_COMPARE_TOOL` = `true`
  * `FEATURE_ADMIN_PANEL` = `true`
  * `FEATURE_SCRAPER_ENABLED` = `true`
* Click **Deploy**.

### 3. Initialize Remote Database
Once Vercel deployment completes, navigate to the database bootstrap endpoint to initialize the schema and import the 883 rows of seeded data:
```
https://<your-vercel-domain>/api/admin/init-db?password=<your_admin_password>
```

---

## 🎨 UI Showcase

The interface features a custom premium gamer design:
* **Dark Theme:** High contrast black and crimson layout matching the Tekken 8 visual identity.
* **Character Pool Visualization:** Custom visual percentage meters representing usage of characters.
* **Leaderboards:** Sorted tabular data with clean status flags, badges, and region tags.
* **Responsiveness:** Fluid grid columns adapting dynamically to desktop, tablet, and mobile screens.

---

*Made with 🥊 by Asad*
