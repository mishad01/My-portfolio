import { seed } from '@/data/seed';
import type { Content } from './types';

export interface Loaded {
  content: Content;
  /** ISO time of the Firestore publish this build was made from; '' when built from seed. */
  publishedAt: string;
}

let cache: Promise<Loaded> | undefined;

/**
 * Build-time content. Reads the published snapshot at Firestore `site/live`
 * through the Admin SDK when FIREBASE_SERVICE_ACCOUNT is set (bypasses App
 * Check, which would block an unauthenticated build). Otherwise uses the seed.
 */
export function loadContent(): Promise<Loaded> {
  return (cache ??= (async () => {
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!sa) return { content: seed, publishedAt: '' };
    const { initializeApp, cert, getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');
    const app = getApps()[0] ?? initializeApp({ credential: cert(JSON.parse(sa)) });
    const snap = await getFirestore(app).doc('site/live').get();
    if (!snap.exists) {
      console.warn('[content] site/live does not exist yet — building from seed');
      return { content: seed, publishedAt: '' };
    }
    const { publishedAt, ...data } = snap.data() as Partial<Content> & { publishedAt?: string };
    return { content: { ...seed, ...data } as Content, publishedAt: publishedAt || '' };
  })());
}

/** Content with drafts removed — what visitors see. */
export async function loadPublished(): Promise<Content> {
  return publishedOnly((await loadContent()).content);
}

export function publishedOnly(c: Content): Content {
  const p = <T extends { status: string }>(a: T[]) => a.filter((x) => x.status === 'published');
  return { ...c, now: p(c.now), experience: p(c.experience), projects: p(c.projects), classes: p(c.classes), research: p(c.research), education: p(c.education) };
}
