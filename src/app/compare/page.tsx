import { query } from '@/lib/db';
import CompareClient from '@/components/CompareClient';

export const dynamic = 'force-dynamic';

export default async function ComparePage({
  searchParams
}: {
  searchParams: { p1?: string; p2?: string };
}) {
  const p1 = searchParams.p1 || '';
  const p2 = searchParams.p2 || '';

  // 1. Fetch all players for dropdown selectors
  const playersRes = await query(`
    SELECT id, name, liquipedia_url, flag_emoji, nationality 
    FROM players 
    ORDER BY name ASC
  `);

  let initialData = null;

  // 2. Query matchup details directly on the server if query parameters exist
  if (p1 && p2 && p1 !== p2) {
    try {
      // Query Player 1 Details
      const p1Res = await query(`
        SELECT 
          p.id, p.name, p.real_name, p.nationality, p.country_code, p.flag_emoji, p.profile_image_url, p.liquipedia_url,
          r.rank, r.total_twt_pts, r.total_matches, r.total_wins, r.win_rate,
          c.name as main_character_name,
          c.portrait_url as main_character_portrait
        FROM players p
        LEFT JOIN rankings r ON r.player_id = p.id AND r.season = '2024'
        LEFT JOIN player_characters pc ON pc.player_id = p.id AND pc.is_main = true
        LEFT JOIN characters c ON pc.character_id = c.id
        WHERE LOWER(p.liquipedia_url) = LOWER($1) OR LOWER(p.name) = LOWER($2) OR p.id::text = $3
      `, [p1, p1.replace('_', ' '), p1]);

      // Query Player 2 Details
      const p2Res = await query(`
        SELECT 
          p.id, p.name, p.real_name, p.nationality, p.country_code, p.flag_emoji, p.profile_image_url, p.liquipedia_url,
          r.rank, r.total_twt_pts, r.total_matches, r.total_wins, r.win_rate,
          c.name as main_character_name,
          c.portrait_url as main_character_portrait
        FROM players p
        LEFT JOIN rankings r ON r.player_id = p.id AND r.season = '2024'
        LEFT JOIN player_characters pc ON pc.player_id = p.id AND pc.is_main = true
        LEFT JOIN characters c ON pc.character_id = c.id
        WHERE LOWER(p.liquipedia_url) = LOWER($1) OR LOWER(p.name) = LOWER($2) OR p.id::text = $3
      `, [p2, p2.replace('_', ' '), p2]);

      if (p1Res.rows.length > 0 && p2Res.rows.length > 0) {
        const player1 = p1Res.rows[0];
        const player2 = p2Res.rows[0];

        // Query Match History
        const matchesRes = await query(`
          SELECT 
            m.id,
            m.round_name,
            m.player1_score,
            m.player2_score,
            t.name as tournament_name,
            t.start_date,
            p1.name as p1_name,
            p2.name as p2_name,
            w.id as winner_id,
            w.name as winner_name
          FROM matches m
          JOIN tournaments t ON m.tournament_id = t.id
          JOIN players p1 ON m.player1_id = p1.id
          JOIN players p2 ON m.player2_id = p2.id
          JOIN players w ON m.winner_id = w.id
          WHERE (m.player1_id = $1 AND m.player2_id = $2) 
             OR (m.player1_id = $2 AND m.player2_id = $1)
          ORDER BY t.start_date DESC, m.created_at DESC
        `, [player1.id, player2.id]);

        let p1Wins = 0;
        let p2Wins = 0;

        const matches = matchesRes.rows.map(m => {
          const p1Win = m.winner_id === player1.id;
          if (p1Win) {
            p1Wins++;
          } else {
            p2Wins++;
          }

          return {
            id: m.id,
            round: m.round_name,
            tournamentName: m.tournament_name,
            date: m.start_date,
            p1Score: m.p1_name === player1.name ? m.player1_score : m.player2_score,
            p2Score: m.p2_name === player2.name ? m.player2_score : m.player1_score,
            winnerName: m.winner_name,
            winnerId: m.winner_id
          };
        });

        initialData = {
          player1,
          player2,
          h2hStats: {
            p1Wins,
            p2Wins,
            totalClashes: matchesRes.rows.length,
            verdict: p1Wins > p2Wins 
              ? `${player1.name} leads ${p1Wins}-${p2Wins}` 
              : p2Wins > p1Wins 
                ? `${player2.name} leads ${p2Wins}-${p1Wins}` 
                : p1Wins > 0 
                  ? `Tied ${p1Wins}-${p2Wins}` 
                  : 'No recorded clashes'
          },
          matches
        };
      }
    } catch (err) {
      console.error('Failed to pre-render matchup comparison:', err);
    }
  }

  return (
    <CompareClient 
      players={playersRes.rows} 
      initialData={initialData} 
      initialP1={p1} 
      initialP2={p2} 
    />
  );
}
