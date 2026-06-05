'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface RankingPlayer {
  rank: number;
  total_twt_pts: number;
  total_matches: number;
  total_wins: number;
  win_rate: string;
  player_id: string;
  player_name: string;
  real_name: string;
  nationality: string;
  country_code: string;
  flag_emoji: string;
  profile_image_url: string;
  liquipedia_url: string;
  main_character_name: string;
  main_character_portrait: string;
  main_character_icon: string;
}

export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rank' | 'win_rate' | 'matches'>('rank');

  useEffect(() => {
    async function fetchRankings() {
      try {
        const res = await fetch('/api/rankings');
        const data = await res.json();
        if (data.success) {
          setRankings(data.rankings);
        } else {
          setError(data.error || 'Failed to fetch rankings');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, []);

  const sortedRankings = [...rankings].sort((a, b) => {
    if (sortBy === 'win_rate') {
      return parseFloat(b.win_rate) - parseFloat(a.win_rate);
    }
    if (sortBy === 'matches') {
      return b.total_matches - a.total_matches;
    }
    return a.rank - b.rank; // default
  });

  // Render a character indicator badge/avatar
  const renderCharacterBadge = (name: string) => {
    if (!name) return <div className="text-xs text-gray-500 font-medium">Various</div>;
    
    // Choose a color theme based on character name
    const colors: Record<string, string> = {
      zafina: 'from-purple-900 to-indigo-900 border-purple-500',
      xiaoyu: 'from-orange-900 to-yellow-900 border-yellow-500',
      dragunov: 'from-zinc-800 to-slate-900 border-zinc-500',
      lili: 'from-rose-900 to-pink-900 border-rose-400',
      panda: 'from-neutral-700 to-neutral-900 border-neutral-400',
      law: 'from-yellow-900 to-amber-900 border-yellow-600',
      jack8: 'from-red-900 to-zinc-950 border-red-500',
      feng: 'from-emerald-950 to-teal-900 border-emerald-500',
      jin: 'from-red-950 to-slate-900 border-red-600',
      reina: 'from-purple-950 to-neutral-950 border-purple-600',
      claudio: 'from-sky-950 to-blue-900 border-sky-400',
      hwoarang: 'from-amber-950 to-orange-950 border-orange-500'
    };

    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const gradient = colors[key] || 'from-zinc-900 to-neutral-950 border-neutral-700';

    return (
      <div className={`flex items-center gap-2 px-2.5 py-1 rounded bg-gradient-to-r ${gradient} border text-xs font-semibold text-gray-100 uppercase tracking-wider`}>
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        {name}
      </div>
    );
  };

  if (error) {
    return (
      <div className="py-12 text-center" id="error-state">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900 bg-opacity-20 border border-red-500 text-red-500 mb-4 text-2xl">
          ⚠️
        </div>
        <h2 className="text-2xl tekken-heading text-red-500 mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#C8102E] hover:bg-red-700 font-bold tekken-heading rounded tracking-wider transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A2A2A] pb-6 gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight tekken-heading text-gradient-red">
            Global Leaderboard
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            The definitive Top 25 professional Tekken 8 fighters by official Tekken World Tour (TWT) standings.
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 self-center md:self-end">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Sort By</span>
          <div className="inline-flex rounded-md p-0.5 bg-[#111] border border-[#2A2A2A]" id="sorting-controls">
            <button
              id="sort-rank"
              onClick={() => setSortBy('rank')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                sortBy === 'rank' ? 'bg-[#C8102E] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Points Rank
            </button>
            <button
              id="sort-winrate"
              onClick={() => setSortBy('win_rate')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                sortBy === 'win_rate' ? 'bg-[#C8102E] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Win Rate
            </button>
            <button
              id="sort-matches"
              onClick={() => setSortBy('matches')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                sortBy === 'matches' ? 'bg-[#C8102E] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Matches Played
            </button>
          </div>
        </div>
      </section>

      {/* Leaderboard Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="leaderboard-grid">
        {loading ? (
          // Skeletons
          Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="tekken-panel h-[190px] rounded-lg p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded bg-[#1A1A1A] shimmer" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-[#1A1A1A] shimmer rounded" />
                    <div className="h-3 w-16 bg-[#1A1A1A] shimmer rounded" />
                  </div>
                </div>
                <div className="w-8 h-8 rounded bg-[#1A1A1A] shimmer" />
              </div>
              <div className="border-t border-[#2A2A2A] pt-4 flex justify-between">
                <div className="h-6 w-20 bg-[#1A1A1A] shimmer rounded" />
                <div className="h-6 w-16 bg-[#1A1A1A] shimmer rounded" />
              </div>
            </div>
          ))
        ) : sortedRankings.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-500">
            <span className="text-4xl mb-4 block">🥊</span>
            <h3 className="text-xl tekken-heading text-gray-400 mb-1">No Fighters Registered</h3>
            <p className="text-sm">Run the scraper in the Admin panel to sync TWT standings.</p>
          </div>
        ) : (
          sortedRankings.map((player) => {
            const isRank1 = player.rank === 1 && sortBy === 'rank';
            
            return (
              <Link
                key={player.player_id}
                href={`/players/${player.liquipedia_url}`}
                className={`tekken-panel group relative rounded-lg p-5 flex flex-col justify-between hover:-translate-y-1 ${
                  isRank1 ? 'border-[#FFD700] hover:shadow-[0_8px_30px_rgba(255,215,0,0.15)] bg-gradient-to-b from-[#151300] to-[#111111]' : ''
                }`}
                id={`player-card-${player.liquipedia_url.toLowerCase()}`}
              >
                {/* Gold Crown / Rank Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  {isRank1 && <span className="text-[#FFD700] text-sm">👑</span>}
                  <span className={`tekken-heading font-black text-2xl ${
                    isRank1 ? 'text-gradient-gold' : 'text-gray-600 group-hover:text-[#C8102E] transition-colors'
                  }`}>
                    #{player.rank}
                  </span>
                </div>

                <div className="flex gap-4 items-start pr-12">
                  {/* Styled Avatar Placeholder */}
                  <div className={`w-12 h-12 rounded border flex items-center justify-center tekken-heading font-extrabold text-xl ${
                    isRank1 ? 'bg-[#FFD700] bg-opacity-10 border-[#FFD700] text-[#FFD700]' : 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-400'
                  }`}>
                    {player.player_name.substring(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="tekken-heading font-bold text-lg text-white group-hover:text-[#C8102E] transition-colors line-clamp-1">
                      {player.player_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <span>{player.flag_emoji}</span>
                      <span className="font-semibold">{player.nationality}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#2A2A2A] pt-4 mt-5 flex items-center justify-between gap-2">
                  {/* Left: Main Character */}
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Main Character</div>
                    {renderCharacterBadge(player.main_character_name)}
                  </div>

                  {/* Right: Points & Winrate */}
                  <div className="text-right">
                    <div className="tekken-heading text-lg font-bold text-white">
                      {player.total_twt_pts.toLocaleString()} <span className="text-[10px] text-[#C8102E]">TWT</span>
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {player.win_rate}% WR <span className="text-gray-600">({player.total_matches}m)</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </section>

      {/* Info Banner */}
      {!loading && sortedRankings.length > 0 && (
        <p className="text-center text-xs text-gray-600">
          Last scrape synced successfully. Standings reflect the 2024 season.
        </p>
      )}
    </div>
  );
}
