import { seed } from '@/data/seed';
import type { Content } from './types';
import { FIREBASE_WEB } from './firebase-web';

export interface Loaded {
  content: Content;
  /** ISO time of the Firestore publish this build was made from; '' when built from seed. */
  publishedAt: string;
}

let cache: Promise<Loaded> | undefined;

/**
 * The published snapshot at Firestore `site/live`, falling back to the seed
 * when it doesn't exist yet or Firestore can't be reached.
 *
 * `site/live` is public-read, so the REST API needs no credentials. If App
 * Check enforcement is turned on later, set FIREBASE_SERVICE_ACCOUNT and the
 * Admin SDK is used instead (it bypasses App Check).
 *
 * Cached for the whole build; in `astro dev` every request reads fresh, so a
 * Publish in the admin shows up on refresh.
 */
export function loadContent(): Promise<Loaded> {
  if (import.meta.env.DEV) return fetchLive();
  return (cache ??= fetchLive());
}

async function fetchLive(): Promise<Loaded> {
  try {
    const live = process.env.FIREBASE_SERVICE_ACCOUNT ? await viaAdmin(process.env.FIREBASE_SERVICE_ACCOUNT) : await viaRest();
    if (!live) {
      console.warn('[content] site/live does not exist yet — using seed');
      return { content: seed, publishedAt: '' };
    }
    const { publishedAt, ...data } = live as Partial<Content> & { publishedAt?: string };
    return { content: { ...seed, ...data } as Content, publishedAt: publishedAt || '' };
  } catch (e) {
    console.warn('[content] could not read Firestore — using seed:', (e as Error).message);
    return { content: seed, publishedAt: '' };
  }
}

async function viaAdmin(sa: string): Promise<Record<string, unknown> | null> {
  const { initializeApp, cert, getApps } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const app = getApps()[0] ?? initializeApp({ credential: cert(JSON.parse(sa)) });
  const snap = await getFirestore(app).doc('site/live').get();
  return snap.exists ? (snap.data() as Record<string, unknown>) : null;
}

async function viaRest(): Promise<Record<string, unknown> | null> {
  const { projectId, apiKey } = FIREBASE_WEB;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/site/live?key=${apiKey}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore REST ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const doc = (await res.json()) as { fields?: Record<string, FsValue> };
  return decodeFields(doc.fields ?? {});
}

// Firestore REST returns typed values ({ stringValue: … }); turn them back into plain JSON.
type FsValue = {
  stringValue?: string; booleanValue?: boolean; integerValue?: string; doubleValue?: number; nullValue?: null; timestampValue?: string;
  arrayValue?: { values?: FsValue[] }; mapValue?: { fields?: Record<string, FsValue> };
};
const decodeFields = (f: Record<string, FsValue>) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, decode(v)]));
function decode(v: FsValue): unknown {
  if ('stringValue' in v) return v.stringValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue?.values ?? []).map(decode);
  if ('mapValue' in v) return decodeFields(v.mapValue?.fields ?? {});
  return null;
}

/** Content with drafts removed — what visitors see. */
export async function loadPublished(): Promise<Content> {
  return publishedOnly((await loadContent()).content);
}

export function publishedOnly(c: Content): Content {
  const p = <T extends { status: string }>(a: T[]) => a.filter((x) => x.status === 'published');
  return { ...c, now: p(c.now), experience: p(c.experience), projects: p(c.projects), classes: p(c.classes), research: p(c.research), education: p(c.education) };
}
