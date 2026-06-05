import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
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
      return NextResponse.json({ success: false, error: 'Player not found' }, { status: 404 });
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
      const opponentId = isP1 ? m.p2_id : m.p1_id;
      const playerScore = isP1 ? m.player1_score : m.player2_score;
      const opponentScore = isP1 ? m.player2_score : m.player1_score;
      const result = m.winner_id === player.id ? 'W' : 'L';

      return {
        id: m.id,
        round: m.round_name,
        tournamentName: m.tournament_name,
        opponentName,
        opponentSlug,
        opponentId,
        playerScore,
        opponentScore,
        result
      };
    });

    return NextResponse.json({
      success: true,
      player,
      characters: charactersRes.rows,
      placements: placementsRes.rows,
      recentMatches
    });
  } catch (error: any) {
    console.error('Error fetching player profile:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
