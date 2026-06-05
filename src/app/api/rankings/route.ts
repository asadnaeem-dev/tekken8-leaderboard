import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
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
    
    return NextResponse.json({ success: true, rankings: res.rows });
  } catch (error: any) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
