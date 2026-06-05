'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SimplePlayer {
  id: string;
  name: string;
  liquipedia_url: string;
  flag_emoji: string;
  nationality: string;
}

interface ComparePlayerData {
  id: string;
  name: string;
  real_name: string;
  nationality: string;
  country_code: string;
  flag_emoji: string;
  profile_image_url: string;
  liquipedia_url: string;
  rank: number;
  total_twt_pts: number;
  total_matches: number;
  total_wins: number;
  win_rate: string;
  main_character_name: string;
  main_character_portrait: string;
}

interface H2HMatch {
  id: string;
  round: string;
  tournamentName: string;
  date: string;
  p1Score: number;
  p2Score: number;
  winnerName: string;
  winnerId: string;
}

interface CompareData {
  player1: ComparePlayerData;
  player2: ComparePlayerData;
  h2hStats: {
    p1Wins: number;
    p2Wins: number;
    totalClashes: number;
    verdict: string;
  };
  matches: H2HMatch[];
}

interface CompareClientProps {
  players: SimplePlayer[];
  initialData: CompareData | null;
  initialP1: string;
  initialP2: string;
}

export default function CompareClient({ players, initialData, initialP1, initialP2 }: CompareClientProps) {
  const router = useRouter();

  const [p1Slug, setP1Slug] = useState<string>(initialP1);
  const [p2Slug, setP2Slug] = useState<string>(initialP2);
  
  const [compareData, setCompareData] = useState<CompareData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareText, setShareText] = useState('Share Matchup');

  // Search filter for dropdowns
  const [p1Search, setP1Search] = useState('');
  const [p2Search, setP2Search] = useState('');
  const [showP1Dropdown, setShowP1Dropdown] = useState(false);
  const [showP2Dropdown, setShowP2Dropdown] = useState(false);

  // Initialize search inputs based on initial data
  useEffect(() => {
    if (initialData) {
      setP1Search(initialData.player1.name);
      setP2Search(initialData.player2.name);
      setCompareData(initialData);
    }
  }, [initialData]);

  // Fetch comparison dynamically when selection changes
  useEffect(() => {
    if (!p1Slug || !p2Slug) {
      setCompareData(null);
      return;
    }

    if (p1Slug === p2Slug) {
      setError('Select two different combatants to compare.');
      setCompareData(null);
      return;
    }

    // Skip fetch if it matches initialData to prevent redundant loads
    if (initialData && initialData.player1.liquipedia_url === p1Slug && initialData.player2.liquipedia_url === p2Slug) {
      setCompareData(initialData);
      return;
    }

    async function fetchComparison() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/compare?p1=${p1Slug}&p2=${p2Slug}`);
        const data = await res.json();
        if (data.success) {
          setCompareData(data);
          setP1Search(data.player1.name);
          setP2Search(data.player2.name);
        } else {
          setError(data.error || 'Failed to generate comparison details.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred loading comparison details.');
      } finally {
        setLoading(false);
      }
    }
    fetchComparison();
  }, [p1Slug, p2Slug]);

  const handleSelectPlayer1 = (player: SimplePlayer) => {
    setP1Slug(player.liquipedia_url);
    setP1Search(player.name);
    setShowP1Dropdown(false);
    updateURL(player.liquipedia_url, p2Slug);
  };

  const handleSelectPlayer2 = (player: SimplePlayer) => {
    setP2Slug(player.liquipedia_url);
    setP2Search(player.name);
    setShowP2Dropdown(false);
    updateURL(p1Slug, player.liquipedia_url);
  };

  const updateURL = (p1: string, p2: string) => {
    const params = new URLSearchParams();
    if (p1) params.set('p1', p1);
    if (p2) params.set('p2', p2);
    router.push(`/compare?${params.toString()}`);
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareText('Copied Link!');
      setTimeout(() => setShareText('Share Matchup'), 2000);
    });
  };

  const filteredP1 = players.filter(p => 
    p.name.toLowerCase().includes(p1Search.toLowerCase()) && p.liquipedia_url !== p2Slug
  );

  const filteredP2 = players.filter(p => 
    p.name.toLowerCase().includes(p2Search.toLowerCase()) && p.liquipedia_url !== p1Slug
  );

  const highlightBestValue = (val1: number, val2: number, lowerIsBetter = false) => {
    if (val1 === val2) return 'text-white';
    const isP1Better = lowerIsBetter ? val1 < val2 : val1 > val2;
    return isP1Better ? 'text-[#FFD700] font-black' : 'text-gray-400 font-medium';
  };

  const highlightBestValueStr = (val1: string, val2: string) => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (isNaN(v1) || isNaN(v2)) return 'text-white';
    if (v1 === v2) return 'text-white';
    return v1 > v2 ? 'text-[#FFD700] font-black' : 'text-gray-400 font-medium';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center md:text-left border-b border-[#2A2A2A] pb-6">
        <h1 className="text-4xl font-black tracking-tight tekken-heading text-gradient-red">
          Head-to-Head Compare
        </h1>
        <p className="text-gray-400 text-sm mt-2 font-medium">
          Settle disputes by analyzing player records and direct encounters side-by-side.
        </p>
      </section>

      {/* Selectors Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center" id="selectors-container">
        {/* Player 1 Selector */}
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Player 1</label>
          <input
            id="p1-selector-input"
            type="text"
            placeholder="Search Player 1..."
            value={p1Search}
            onChange={(e) => { setP1Search(e.target.value); setShowP1Dropdown(true); }}
            onFocus={() => setShowP1Dropdown(true)}
            className="w-full px-4 py-3 bg-[#111] border border-[#2A2A2A] rounded focus:border-[#C8102E] focus:outline-none text-white font-semibold text-sm transition-colors"
          />
          {showP1Dropdown && filteredP1.length > 0 && (
            <div className="absolute z-20 w-full mt-1 max-h-60 overflow-y-auto bg-[#111] border border-[#2A2A2A] rounded shadow-lg">
              {filteredP1.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlayer1(p)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1A1A1A] hover:text-[#C8102E] font-medium transition-colors flex items-center justify-between"
                >
                  <span>{p.name}</span>
                  <span className="text-xs text-gray-500">{p.flag_emoji} {p.nationality}</span>
                </button>
              ))}
            </div>
          )}
          {showP1Dropdown && (
            <div className="fixed inset-0 z-10" onClick={() => setShowP1Dropdown(false)} />
          )}
        </div>

        {/* Player 2 Selector */}
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Player 2</label>
          <input
            id="p2-selector-input"
            type="text"
            placeholder="Search Player 2..."
            value={p2Search}
            onChange={(e) => { setP2Search(e.target.value); setShowP2Dropdown(true); }}
            onFocus={() => setShowP2Dropdown(true)}
            className="w-full px-4 py-3 bg-[#111] border border-[#2A2A2A] rounded focus:border-[#C8102E] focus:outline-none text-white font-semibold text-sm transition-colors"
          />
          {showP2Dropdown && filteredP2.length > 0 && (
            <div className="absolute z-20 w-full mt-1 max-h-60 overflow-y-auto bg-[#111] border border-[#2A2A2A] rounded shadow-lg">
              {filteredP2.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlayer2(p)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1A1A1A] hover:text-[#C8102E] font-medium transition-colors flex items-center justify-between"
                >
                  <span>{p.name}</span>
                  <span className="text-xs text-gray-500">{p.flag_emoji} {p.nationality}</span>
                </button>
              ))}
            </div>
          )}
          {showP2Dropdown && (
            <div className="fixed inset-0 z-10" onClick={() => setShowP2Dropdown(false)} />
          )}
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-950 bg-opacity-20 border border-red-500 rounded text-red-500 text-sm font-semibold flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* Comparison results */}
      {loading ? (
        <div className="tekken-panel h-80 rounded-lg flex items-center justify-center shimmer" />
      ) : compareData ? (
        <div className="space-y-8 animate-fadeIn" id="compare-results">
          {/* Side-by-Side Hero */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center border border-[#2A2A2A] rounded-lg overflow-hidden bg-gradient-to-b md:bg-gradient-to-r from-[#111] via-[#0F0F0F] to-[#111]">
            <div className="col-span-1 p-6 text-center space-y-2 border-b md:border-b-0 md:border-r border-[#2A2A2A] h-full flex flex-col justify-center">
              <div className="w-16 h-16 rounded border border-gray-700 bg-[#1A1A1A] flex items-center justify-center tekken-heading font-black text-2xl text-white mx-auto shadow">
                {compareData.player1.name.substring(0, 2).toUpperCase()}
              </div>
              <h3 className="tekken-heading font-bold text-lg text-white">
                <Link href={`/players/${compareData.player1.liquipedia_url}`} className="hover:underline hover:text-[#C8102E]">
                  {compareData.player1.name}
                </Link>
              </h3>
              <p className="text-xs text-gray-500 font-semibold">{compareData.player1.flag_emoji} {compareData.player1.nationality}</p>
            </div>

            <div className="col-span-1 py-8 text-center space-y-2 flex flex-col justify-center h-full">
              <div className="w-10 h-10 rounded bg-[#C8102E] font-black text-xs tekken-heading flex items-center justify-center text-white mx-auto animate-pulse">
                VS
              </div>
              <p className="text-sm tekken-heading tracking-widest font-bold text-[#FFD700] uppercase mt-4">
                {compareData.h2hStats.verdict}
              </p>
              <button
                onClick={copyToClipboard}
                className="inline-block px-3 py-1 bg-[#1A1A1A] hover:bg-[#C8102E] text-[10px] tracking-wider font-extrabold uppercase tekken-heading border border-[#2A2A2A] hover:border-transparent rounded transition-all mt-4"
              >
                {shareText}
              </button>
            </div>

            <div className="col-span-1 p-6 text-center space-y-2 border-t md:border-t-0 md:border-l border-[#2A2A2A] h-full flex flex-col justify-center">
              <div className="w-16 h-16 rounded border border-gray-700 bg-[#1A1A1A] flex items-center justify-center tekken-heading font-black text-2xl text-white mx-auto shadow">
                {compareData.player2.name.substring(0, 2).toUpperCase()}
              </div>
              <h3 className="tekken-heading font-bold text-lg text-white">
                <Link href={`/players/${compareData.player2.liquipedia_url}`} className="hover:underline hover:text-[#C8102E]">
                  {compareData.player2.name}
                </Link>
              </h3>
              <p className="text-xs text-gray-500 font-semibold">{compareData.player2.flag_emoji} {compareData.player2.nationality}</p>
            </div>
          </div>

          {/* Stats Matrix */}
          <section className="tekken-panel rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold tekken-heading text-white border-b border-[#2A2A2A] pb-3">
              Performance Stats
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-center py-2 border-b border-[#1A1A1A] text-sm font-semibold">
                <span className={highlightBestValue(compareData.player1.total_twt_pts || 0, compareData.player2.total_twt_pts || 0)}>
                  {(compareData.player1.total_twt_pts || 0).toLocaleString()}
                </span>
                <span className="text-gray-500 uppercase text-xs tracking-wider">TWT Points</span>
                <span className={highlightBestValue(compareData.player2.total_twt_pts || 0, compareData.player1.total_twt_pts || 0)}>
                  {(compareData.player2.total_twt_pts || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 text-center py-2 border-b border-[#1A1A1A] text-sm font-semibold">
                <span className={highlightBestValue(compareData.player1.rank || 99, compareData.player2.rank || 99, true)}>
                  #{compareData.player1.rank || 'N/A'}
                </span>
                <span className="text-gray-500 uppercase text-xs tracking-wider">TWT Rank</span>
                <span className={highlightBestValue(compareData.player2.rank || 99, compareData.player1.rank || 99, true)}>
                  #{compareData.player2.rank || 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-3 text-center py-2 border-b border-[#1A1A1A] text-sm font-semibold">
                <span className={highlightBestValueStr(compareData.player1.total_matches > 0 ? compareData.player1.win_rate : '0', compareData.player2.total_matches > 0 ? compareData.player2.win_rate : '0')}>
                  {compareData.player1.total_matches > 0 ? `${compareData.player1.win_rate}%` : 'N/A'}
                </span>
                <span className="text-gray-500 uppercase text-xs tracking-wider">Win Rate</span>
                <span className={highlightBestValueStr(compareData.player2.total_matches > 0 ? compareData.player2.win_rate : '0', compareData.player1.total_matches > 0 ? compareData.player1.win_rate : '0')}>
                  {compareData.player2.total_matches > 0 ? `${compareData.player2.win_rate}%` : 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-3 text-center py-2 border-b border-[#1A1A1A] text-sm font-semibold">
                <span className={highlightBestValue(compareData.player1.total_matches || 0, compareData.player2.total_matches || 0)}>
                  {compareData.player1.total_matches || 0}
                </span>
                <span className="text-gray-500 uppercase text-xs tracking-wider">Matches</span>
                <span className={highlightBestValue(compareData.player2.total_matches || 0, compareData.player1.total_matches || 0)}>
                  {compareData.player2.total_matches || 0}
                </span>
              </div>

              <div className="grid grid-cols-3 text-center py-2 text-sm font-semibold">
                <span className={highlightBestValue(compareData.player1.total_wins || 0, compareData.player2.total_wins || 0)}>
                  {compareData.player1.total_wins || 0}
                </span>
                <span className="text-gray-500 uppercase text-xs tracking-wider">Wins</span>
                <span className={highlightBestValue(compareData.player2.total_wins || 0, compareData.player1.total_wins || 0)}>
                  {compareData.player2.total_wins || 0}
                </span>
              </div>
            </div>
          </section>

          {/* Direct Encounters */}
          <section className="tekken-panel rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold tekken-heading text-white border-b border-[#2A2A2A] pb-3">
              Direct Encounters ({compareData.h2hStats.totalClashes})
            </h2>
            {compareData.matches.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <span className="text-3xl block mb-2">🥊</span>
                <p className="font-semibold text-gray-400">No recorded clashes — yet.</p>
                <p className="text-xs mt-1">These players haven&apos;t met in any tracked tournament — yet.</p>
              </div>
            ) : (
              <div className="space-y-4" id="direct-clashes-list">
                {compareData.matches.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row items-center justify-between p-4 rounded bg-[#161616] border border-[#232323] hover:border-gray-700 transition-colors gap-3"
                  >
                    <div className="text-left w-full sm:w-auto">
                      <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{m.round}</span>
                      <div className="text-sm font-bold text-white line-clamp-1">{m.tournamentName}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {new Date(m.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 font-bold">
                      <div className="text-right">
                        <span className={`text-sm ${m.winnerName === compareData.player1.name ? 'text-[#22C55E]' : 'text-gray-400'}`}>
                          {compareData.player1.name}
                        </span>
                      </div>
                      
                      <div className="tekken-heading text-xl tracking-wider px-3.5 py-1 bg-[#1F1F1F] rounded">
                        <span className={m.winnerName === compareData.player1.name ? 'text-[#22C55E]' : 'text-gray-400'}>
                          {m.p1Score}
                        </span>
                        <span className="text-gray-600"> - </span>
                        <span className={m.winnerName === compareData.player2.name ? 'text-[#22C55E]' : 'text-gray-400'}>
                          {m.p2Score}
                        </span>
                      </div>

                      <div className="text-left">
                        <span className={`text-sm ${m.winnerName === compareData.player2.name ? 'text-[#22C55E]' : 'text-gray-400'}`}>
                          {compareData.player2.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="tekken-panel rounded-lg py-16 text-center text-gray-500" id="h2h-empty-state">
          <span className="text-6xl block mb-4">🆚</span>
          <h3 className="text-2xl tekken-heading text-gray-400 font-bold mb-2">Configure Comparison</h3>
          <p className="text-sm max-w-sm mx-auto">
            Select two different fighters from the dropdowns above to compare their match metrics.
          </p>
        </div>
      )}
    </div>
  );
}
