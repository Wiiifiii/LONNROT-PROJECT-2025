/**
 * prismaMigrateDeploy.cjs
 *
 * Runs `prisma migrate deploy` after loading env vars from `.env.local` (Vercel)
 * or `.env` (common local setup).
 */

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const dotenv = require('dotenv')

for (const envFile of ['.env.local', '.env']) {
  const envPath = path.resolve(process.cwd(), envFile)
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
    break
  }
}

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL. Set it in .env.local or .env')
  process.exit(1)
}

if (!process.env.DIRECT_URL) {
  console.error('Missing DIRECT_URL. Set it in .env.local or .env')
  process.exit(1)
}

const result = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

process.exit(result.status ?? 1)
