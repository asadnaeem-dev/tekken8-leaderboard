import { query } from '@/lib/db';
import LeaderboardClient from '@/components/LeaderboardClient';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  try {
    const res = await query(`
      SELECT 
        r.rank,
        r.total_twt_pts,
        r.total_matches,
        r.total_wins,
        r.win_rate,
        p.id as player_id,
        p.name as player_name,
        p.real_name,
        p.nationality,
        p.country_code,
        p.flag_emoji,
        p.profile_image_url,
        p.liquipedia_url,
        c.name as main_character_name,
        c.portrait_url as main_character_portrait,
        c.icon_url as main_character_icon
      FROM rankings r
      JOIN players p ON r.player_id = p.id
      LEFT JOIN player_characters pc ON pc.player_id = p.id AND pc.is_main = true
      LEFT JOIN characters c ON pc.character_id = c.id
      WHERE r.season = '2024'
      ORDER BY r.rank ASC
    `);

    return <LeaderboardClient initialRankings={res.rows} />;
  } catch (error: any) {
    return (
      <div className="py-12 text-center" id="error-state">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900 bg-opacity-20 border border-red-500 text-red-500 mb-4 text-2xl">
          ⚠️
        </div>
        <h2 className="text-2xl tekken-heading text-red-500 mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error.message}</p>
      </div>
    );
  }
}
