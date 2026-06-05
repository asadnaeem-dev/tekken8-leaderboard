import { Pool, QueryResult, QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:wallsplat_secret@localhost:5432/wallsplat';

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : false,
  });
} else {
  // Prevent hot-reloading from creating too many pools
  if (!(global as any)._dbPool) {
    (global as any)._dbPool = new Pool({
      connectionString,
      ssl: connectionString.includes('supabase') ? { rejectUnauthorized: false } : false,
    });
  }
  pool = (global as any)._dbPool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  console.log(`[Database Query] executed query in ${duration}ms`, { text, rows: res.rowCount });
  return res;
}

export default pool;
