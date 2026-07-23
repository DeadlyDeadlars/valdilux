import { execSync } from 'child_process';
import { unlinkSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prismaDir = path.resolve(__dirname, '..', 'prisma');
const dbPath = path.join(prismaDir, 'test.db');

export async function setupTestDB() {
  process.env.DATABASE_URL = `file:${dbPath}`;
  process.env.ADMIN_PASS = 'admin123';
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.ALLOWED_ORIGINS = 'http://localhost:3000';

  if (existsSync(dbPath)) {
    unlinkSync(dbPath);
  }

  execSync('npx prisma db push --skip-generate', {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
    stdio: 'pipe',
  });
}

export async function teardownTestDB() {
  if (existsSync(dbPath)) {
    try { unlinkSync(dbPath); } catch {}
    try { unlinkSync(dbPath + '-journal'); } catch {}
  }
}

export const ADMIN_HEADERS = { 'x-admin-pass': 'admin123' };
