import fs from 'fs';
import path from 'path';

// Upstash / Vercel KV support
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let redisClient: any = null;

async function getRedis() {
  if (!upstashUrl || !upstashToken) return null;
  if (!redisClient) {
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });
  }
  return redisClient;
}

// SQLite local / standalone fallback
let sqliteDb: any = null;

function getSqliteDb() {
  if (!sqliteDb) {
    // node:sqlite is built-in in Node 22+
    // Dynamic require/import to prevent bundler errors in edge/serverless environments when unused
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require('node:sqlite');
    const dataDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'views.sqlite');
    sqliteDb = new DatabaseSync(dbPath);
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS site_stats (
        key TEXT PRIMARY KEY,
        value INTEGER NOT NULL
      );
      INSERT OR IGNORE INTO site_stats (key, value) VALUES ('views', 0);
    `);
  }
  return sqliteDb;
}

/**
 * Increment the global views count atomically and return the new total.
 */
export async function incrementViews(): Promise<number> {
  const redis = await getRedis();
  if (redis) {
    try {
      const count = await redis.incr('portfolio:views');
      return Number(count);
    } catch (err) {
      console.error('[viewsDb] Upstash Redis error on incrementViews, falling back to SQLite:', err);
    }
  }

  // SQLite fallback
  const db = getSqliteDb();
  const updateStmt = db.prepare(`
    UPDATE site_stats 
    SET value = value + 1 
    WHERE key = 'views' 
    RETURNING value;
  `);
  const row = updateStmt.get() as { value: number };
  return row ? Number(row.value) : 1;
}

/**
 * Get the current global views count without incrementing.
 */
export async function getViews(): Promise<number> {
  const redis = await getRedis();
  if (redis) {
    try {
      const count = await redis.get('portfolio:views');
      return count ? Number(count) : 0;
    } catch (err) {
      console.error('[viewsDb] Upstash Redis error on getViews, falling back to SQLite:', err);
    }
  }

  // SQLite fallback
  const db = getSqliteDb();
  const selectStmt = db.prepare(`
    SELECT value FROM site_stats WHERE key = 'views';
  `);
  const row = selectStmt.get() as { value: number } | undefined;
  return row ? Number(row.value) : 0;
}
