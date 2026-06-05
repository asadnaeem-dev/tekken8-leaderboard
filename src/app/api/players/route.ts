import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT id, name, liquipedia_url, flag_emoji, nationality 
      FROM players 
      ORDER BY name ASC
    `);
    return NextResponse.json({ success: true, players: res.rows });
  } catch (error: any) {
    console.error('Error listing players:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
