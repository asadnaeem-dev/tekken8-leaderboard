import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workspaceRoot = process.cwd();
    
    // 1. Read schema.sql
    const schemaPath = path.join(workspaceRoot, 'schema.sql');
    console.log(`Reading schema from ${schemaPath}`);
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // 2. Read data_dump.sql
    const dataPath = path.join(workspaceRoot, 'src', 'lib', 'data_dump.sql');
    console.log(`Reading data dump from ${dataPath}`);
    if (!fs.existsSync(dataPath)) {
      throw new Error(`data_dump.sql not found at ${dataPath}`);
    }
    const dataSql = fs.readFileSync(dataPath, 'utf8');

    console.log('Executing schema initialization...');
    await query(schemaSql);

    console.log('Executing data dump seeding...');
    await query(dataSql);

    return NextResponse.json({
      success: true,
      message: 'Database schema and seeded data initialized successfully!'
    });
  } catch (error: any) {
    console.error('Error during database initialization:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
