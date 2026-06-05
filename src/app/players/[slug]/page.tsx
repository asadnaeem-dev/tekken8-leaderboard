import { query } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PlayerProfilePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    // 1. Fetch player details and overall rank stats
    const playerRes = await query(`
      SELECT 
        p.*,
        r.rank as current_rank,
        r.total_twt_pts,
        r.total_matches,
        r.total_wins,
        r.win_rate
      FROM players p
      LEFT JOIN rankings r ON r.player_id = p.id AND r.season = '2024'
      WHERE LOWER(p.liquipedia_url) = LOWER($1) OR LOWER(p.name) = LOWER($2)
    `, [slug, slug.replace('_', ' ')]);

    if (playerRes.rows.length === 0) {
      notFound();
    }

    const player = playerRes.rows[0];

    // 2. Fetch character usages
    const charactersRes = await query(`
      SELECT 
        c.name,
        c.portrait_url,
        c.icon_url,
        pc.usage_pct,
        pc.is_main
      FROM player_characters pc
      JOIN characters c ON pc.character_id = c.id
      WHERE pc.player_id = $1
      ORDER BY pc.usage_pct DESC
    `, [player.id]);

    // 3. Fetch tournament placements
    const placementsRes = await query(`
      SELECT 
        pl.placement,
        pl.twt_points,
        pl.prize_won,
        t.name as tournament_name,
        t.short_name,
        t.start_date,
        t.tier,
        t.liquipedia_url as tournament_slug
      FROM placements pl
      JOIN tournaments t ON pl.tournament_id = t.id
      WHERE pl.player_id = $1
      ORDER BY t.start_date DESC
    `, [player.id]);

    // 4. Fetch recent matches (last 10)
    const matchesRes = await query(`
      SELECT 
        m.id,
        m.round_name,
        m.player1_score,
        m.player2_score,
        t.name as tournament_name,
        t.start_date,
        p1.id as p1_id,
        p1.name as p1_name,
        p1.liquipedia_url as p1_slug,
        p2.id as p2_id,
        p2.name as p2_name,
        p2.liquipedia_url as p2_slug,
        w.id as winner_id,
        w.name as winner_name
      FROM matches m
      JOIN tournaments t ON m.tournament_id = t.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      JOIN players w ON m.winner_id = w.id
      WHERE m.player1_id = $1 OR m.player2_id = $1
      ORDER BY t.start_date DESC, m.created_at DESC
      LIMIT 10
    `, [player.id]);

    // Map matches to a simpler H2H structure from the player's perspective
    const recentMatches = matchesRes.rows.map(m => {
      const isP1 = m.p1_id === player.id;
      const opponentName = isP1 ? m.p2_name : m.p1_name;
      const opponentSlug = isP1 ? m.p2_slug : m.p1_slug;
      const playerScore = isP1 ? m.player1_score : m.player2_score;
      const opponentScore = isP1 ? m.player2_score : m.player1_score;
      const result = m.winner_id === player.id ? 'W' : 'L';

      return {
        id: m.id,
        round: m.round_name,
        tournamentName: m.tournament_name,
        opponentName,
        opponentSlug,
        playerScore,
        opponentScore,
        result
      };
    });

    const formatPlacement = (place: number) => {
      if (place === 1) return <span className="font-bold text-[#FFD700]">🥇 Champion</span>;
      if (place === 2) return <span className="font-bold text-[#C0C0C0]">🥈 Runner-up</span>;
      if (place === 3) return <span className="font-bold text-[#CD7F32]">🥉 3rd Place</span>;
      return <span className="font-semibold text-gray-400">{place}th Place</span>;
    };

    const losses = player.total_matches - player.total_wins;

    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="tekken-panel rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative overflow-hidden bg-gradient-to-r from-[#111] to-[#0A0A0A]">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#C8102E]" />

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded border border-[#C8102E] bg-[#1A1A1A] flex items-center justify-center tekken-heading font-black text-4xl text-white shadow-[0_0_15px_rgba(200,16,46,0.3)]">
              {player.name.substring(0, 2).toUpperCase()}
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tekken-heading text-white tracking-wider">
                  {player.name}
                </h1>
                {player.current_rank && (
                  <span className="px-3 py-1 bg-[#C8102E] text-white text-xs font-bold tekken-heading tracking-widest rounded-full uppercase glow-red">
                    Rank #{player.current_rank}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-400 font-semibold">{player.real_name}</p>

              <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
                <span className="text-lg">{player.flag_emoji}</span>
                <span className="font-semibold text-gray-300">{player.nationality}</span>
              </div>
              
              {player.bio && (
                <p className="text-xs text-gray-500 max-w-xl italic mt-3 font-medium">&quot;{player.bio}&quot;</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Link
              id="compare-fighter-btn"
              href={`/compare?p1=${player.liquipedia_url}`}
              className="px-6 py-2.5 bg-[#C8102E] hover:bg-red-700 font-bold tekken-heading text-center rounded tracking-wider transition-all uppercase text-sm"
            >
              Compare Fighter H2H
            </Link>
            <a
              href={`https://liquipedia.net/fighters/${player.liquipedia_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[#2A2A2A] hover:border-gray-500 bg-[#151515] hover:bg-[#1C1C1C] text-xs font-semibold uppercase tracking-wider text-center rounded transition-colors"
            >
              Liquipedia Profile ↗
            </a>
          </div>
        </section>

        {/* Stats Cards Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-grid">
          <div className="tekken-panel p-5 rounded-lg text-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">TWT Points</div>
            <div className="text-3xl font-black tekken-heading text-[#FFD700]">
              {(player.total_twt_pts || 0).toLocaleString()}
            </div>
          </div>
          <div className="tekken-panel p-5 rounded-lg text-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Win Rate</div>
            <div className="text-3xl font-black tekken-heading text-gradient-red">
              {player.total_matches > 0 ? `${player.win_rate}%` : 'N/A'}
            </div>
          </div>
          <div className="tekken-panel p-5 rounded-lg text-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Matches</div>
            <div className="text-3xl font-black tekken-heading text-white">
              {player.total_matches || 0}
            </div>
          </div>
          <div className="tekken-panel p-5 rounded-lg text-center">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Record (W-L)</div>
            <div className="text-3xl font-black tekken-heading text-gray-300">
              <span className="text-[#22C55E]">{player.total_wins}</span>
              <span className="text-gray-600"> - </span>
              <span className="text-[#EF4444]">{losses}</span>
            </div>
          </div>
        </section>

        {/* Main Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Tournament History */}
            <section className="tekken-panel rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold tekken-heading tracking-wider text-white border-b border-[#2A2A2A] pb-3">
                Tournament History
              </h2>
              {placementsRes.rows.length === 0 ? (
                <p className="text-gray-500 text-sm font-medium py-4">No recorded tournament participations.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse" id="tournament-history-table">
                    <thead>
                      <tr className="border-b border-[#2A2A2A] text-gray-500 font-bold uppercase tracking-wider text-xs">
                        <th className="py-3 pr-4">Tournament</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Placement</th>
                        <th className="py-3 pl-4 text-right">Points Won</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1D1D1D] font-medium">
                      {placementsRes.rows.map((p: any, idx: number) => (
                        <tr key={idx} className="hover:bg-[#141414] transition-colors">
                          <td className="py-3.5 pr-4 text-white font-bold">{p.tournament_name}</td>
                          <td className="py-3.5 px-4 text-gray-400">
                            {new Date(p.start_date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                            })}
                          </td>
                          <td className="py-3.5 px-4">{formatPlacement(p.placement)}</td>
                          <td className="py-3.5 pl-4 text-right text-[#FFD700] font-semibold">
                            +{p.twt_points.toLocaleString()} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Recent Matches */}
            <section className="tekken-panel rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold tekken-heading tracking-wider text-white border-b border-[#2A2A2A] pb-3">
                Recent Match Logs
              </h2>
              {recentMatches.length === 0 ? (
                <p className="text-gray-500 text-sm font-medium py-4">No recent matches recorded in the database.</p>
              ) : (
                <div className="space-y-3" id="match-logs-list">
                  {recentMatches.map((match: any) => (
                    <div
                      key={match.id}
                      className="flex flex-col sm:flex-row items-center justify-between p-4 rounded bg-[#161616] border border-[#232323] hover:border-gray-700 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className={`w-8 h-8 rounded flex items-center justify-center text-xs font-black tekken-heading text-white ${
                          match.result === 'W' ? 'bg-[#22C55E] glow-red' : 'bg-[#EF4444]'
                        }`}>
                          {match.result}
                        </span>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{match.round}</div>
                          <div className="text-xs font-medium text-gray-400 line-clamp-1">{match.tournamentName}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto font-bold">
                        <div className="text-sm">
                          vs{' '}
                          <Link
                            href={`/players/${match.opponentSlug}`}
                            className="text-[#C8102E] hover:underline"
                          >
                            {match.opponentName}
                          </Link>
                        </div>
                        <div className="tekken-heading text-lg tracking-wider px-3 py-1 bg-[#1F1F1F] rounded">
                          <span className={match.result === 'W' ? 'text-[#22C55E]' : 'text-gray-400'}>
                            {match.playerScore}
                          </span>
                          <span className="text-gray-600"> - </span>
                          <span className={match.result === 'L' ? 'text-[#22C55E]' : 'text-gray-400'}>
                            {match.opponentScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Character Pool Usage */}
          <div className="space-y-8">
            <section className="tekken-panel rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold tekken-heading tracking-wider text-white border-b border-[#2A2A2A] pb-3">
                Character Usage
              </h2>
              {charactersRes.rows.length === 0 ? (
                <p className="text-gray-500 text-sm font-medium py-4">No character records found.</p>
              ) : (
                <div className="space-y-5" id="character-usages-list">
                  {charactersRes.rows.map((char: any, idx: number) => {
                    const pct = parseFloat(char.usage_pct);
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
                            <span className="text-white">{char.name}</span>
                            {char.is_main && (
                              <span className="text-[10px] bg-[#FFD700] text-black font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">
                                Main
                              </span>
                            )}
                          </div>
                          <span className="text-gray-400">{pct}%</span>
                        </div>
                        
                        <div className="w-full h-2 rounded-full bg-[#1F1F1F] overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              char.is_main 
                                ? 'from-[#FFD700] to-[#E5C100]' 
                                : 'from-[#C8102E] to-[#A00D24]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="py-20 text-center" id="error-state">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-3xl tekken-heading text-[#C8102E] font-black mb-2">System Error</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          {error.message || 'An error occurred loading the fighter profile.'}
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#C8102E] hover:bg-red-700 font-bold tekken-heading rounded tracking-wider transition-all"
        >
          Back to Leaderboard
        </Link>
      </div>
    );
  }
}
