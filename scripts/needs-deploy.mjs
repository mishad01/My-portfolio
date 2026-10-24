// Scheduled runs: rebuild only when the admin has published since the last deploy.
// Writes `deploy=true|false` to $GITHUB_OUTPUT. site/live is public-read, so no credentials needed.
import { appendFileSync } from 'node:fs';

const PROJECT = process.env.PUBLIC_FIREBASE_PROJECT_ID || 'my-portfolio-fd9f0';
const KEY = process.env.PUBLIC_FIREBASE_API_KEY || 'AIzaSyByqgfuqaAKpN2hLE3e2WLHALtA32H2Y1k';
const SITE = process.env.SITE_URL || 'https://mishad01.github.io';

const out = (v) => {
  console.log(`deploy=${v}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `deploy=${v}\n`);
};

const res = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/site/live?key=${KEY}`);
const published = res.ok ? (await res.json()).fields?.publishedAt?.stringValue || '' : '';

let deployed = '';
try {
  const r = await fetch(`${SITE}/build.json`, { cache: 'no-store' });
  if (r.ok) deployed = (await r.json()).publishedAt || '';
} catch {}

console.log({ published, deployed });
out(published !== '' && published !== deployed);
