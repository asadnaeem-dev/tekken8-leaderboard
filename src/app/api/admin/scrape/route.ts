import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export const dynamic = 'force-dynamic';

// GET: Returns list of tournaments (with last-scraped timestamp) and last 20 scrape logs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = request.headers.get('Authorization') || searchParams.get('password');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch tournaments and their last placement update
    const tournamentsRes = await query(`
      SELECT 
        t.id, t.name, t.short_name, t.tier, t.liquipedia_url,
        (SELECT MAX(created_at) FROM placements p WHERE p.tournament_id = t.id) as last_scraped_at
      FROM tournaments t
      ORDER BY t.start_date DESC
    `);

    // 2. Fetch last 20 scrape logs
    const logsRes = await query(`
      SELECT id, source_url, status, records_upserted, error_message, triggered_at, completed_at
      FROM scrape_log
      ORDER BY triggered_at DESC
      LIMIT 20
    `);

    return NextResponse.json({
      success: true,
      tournaments: tournamentsRes.rows,
      logs: logsRes.rows
    });
  } catch (error: any) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Triggers the python scraper
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, url } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Determine path to python executable and scraper script
    const workspaceRoot = process.cwd();
    const pythonPath = path.join(workspaceRoot, '.venv', 'Scripts', 'python.exe');
    const scraperPath = path.join(workspaceRoot, 'scraper', 'scrape.py');

    let command = `"${pythonPath}" "${scraperPath}"`;
    if (url) {
      command += ` --url "${url}"`;
    }

    console.log(`Executing scraper command: ${command}`);
    
    // Execute python scraper
    const { stdout, stderr } = await execPromise(command);

    // Fetch the latest log written to database to confirm success
    const latestLogRes = await query(`
      SELECT * FROM scrape_log 
      ORDER BY triggered_at DESC 
      LIMIT 1
    `);
    const latestLog = latestLogRes.rows[0];

    return NextResponse.json({
      success: true,
      stdout,
      stderr,
      log: latestLog
    });
  } catch (error: any) {
    console.error('Scraper execution failed:', error);
    
    // Attempt to log failure in database
    try {
      await query(`
        INSERT INTO scrape_log (source_url, status, records_upserted, error_message, triggered_at, completed_at)
        VALUES ($1, 'FAILED', 0, $2, NOW(), NOW())
      `, [request.url, error.message]);
    } catch (dbErr) {
      console.error('Failed to log scraper error to DB:', dbErr);
    }

    return NextResponse.json({
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || ''
    }, { status: 500 });
  }
}
