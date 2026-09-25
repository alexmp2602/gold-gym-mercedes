import { createHash } from 'node:crypto';
import { getPostgresDatabase } from '../postgres/database';
export async function allowAuthAttempt(email: string, action: string) {
  const db = getPostgresDatabase();
  if (!db) return false;
  const key = createHash('sha256').update(`${action}:${email.toLowerCase()}`).digest('hex');
  const bucket = Math.floor(Date.now() / 900000);
  const result = await db.batch([
    db.prepare('DELETE FROM auth_limits WHERE bucket<?').bind(bucket - 4),
    db.prepare('INSERT INTO auth_limits(key,bucket,attempts) VALUES(?,?,1) ON CONFLICT(key,bucket) DO UPDATE SET attempts=auth_limits.attempts+1 RETURNING attempts').bind(key, bucket),
  ]);
  return Number((result[1].results[0] as { attempts: number }).attempts) <= 8;
}
