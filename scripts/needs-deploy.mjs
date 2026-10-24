// Scheduled runs: rebuild only when the admin has published since the last deploy.
// Writes `deploy=true|false` to $GITHUB_OUTPUT.
import { appendFileSync } from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const out = (v) => {
  console.log(`deploy=${v}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `deploy=${v}\n`);
};

const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!sa) { console.log('No FIREBASE_SERVICE_ACCOUNT — nothing to poll.'); out(false); process.exit(0); }

const app = initializeApp({ credential: cert(JSON.parse(sa)) });
const snap = await getFirestore(app).doc('site/live').get();
const published = snap.exists ? snap.get('publishedAt') || '' : '';

let deployed = '';
try {
  const res = await fetch(`${process.env.SITE_URL || 'https://mishad01.github.io'}/build.json`, { cache: 'no-store' });
  if (res.ok) deployed = (await res.json()).publishedAt || '';
} catch {}

console.log({ published, deployed });
out(published !== '' && published !== deployed);
