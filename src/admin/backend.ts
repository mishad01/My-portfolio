import { seed } from '@/data/seed';
import type { Content } from '@/lib/types';

export interface Snapshot {
  draft: Content;
  /** Draft differs from what the live site was last built from. */
  changed: boolean;
}

export interface Backend {
  demo: boolean;
  onAuth(cb: (signedIn: boolean, email?: string) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  load(): Promise<Snapshot>;
  saveDraft(c: Content): Promise<void>;
  /** Copy the draft to `site/live`; the deploy workflow picks it up. */
  publish(c: Content): Promise<void>;
  upload(file: File, folder: string): Promise<string>;
}

const env = import.meta.env;

/**
 * Web config for Firebase project my-portfolio-fd9f0. It is public by design —
 * access is enforced by firestore.rules / storage.rules and App Check.
 * PUBLIC_FIREBASE_* env vars override it (e.g. for a staging project).
 */
const config = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY || 'AIzaSyByqgfuqaAKpN2hLE3e2WLHALtA32H2Y1k',
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN || 'my-portfolio-fd9f0.firebaseapp.com',
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID || 'my-portfolio-fd9f0',
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET || 'my-portfolio-fd9f0.firebasestorage.app',
  appId: env.PUBLIC_FIREBASE_APP_ID || '1:671409225209:web:4b1372845f279973f9d128',
};
export const firebaseConfigured = !!(config.apiKey && config.projectId);

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

/** Browser-only stand-in used when Firebase isn't configured, and by the canvas (?demo=1). */
export function demoBackend(opts: { changed?: boolean; persist?: boolean } = {}): Backend {
  const KEY = 'pfAdminDemo';
  const persist = opts.persist ?? true;
  let mem: { draft: Content; changed: boolean } | null = null;
  const read = () => {
    if (mem) return mem;
    try { const s = persist && localStorage.getItem(KEY); if (s) return (mem = JSON.parse(s)); } catch {}
    return (mem = { draft: clone(seed), changed: !!opts.changed });
  };
  const write = () => { if (persist) try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch {} };
  let signedIn = false;
  let listener: ((s: boolean, e?: string) => void) | null = null;
  return {
    demo: true,
    onAuth(cb) { listener = cb; cb(signedIn); return () => { listener = null; }; },
    async signIn(email) { signedIn = true; listener?.(true, email); },
    async signOut() { signedIn = false; listener?.(false); },
    async load() { const s = read(); return { draft: clone(s.draft), changed: s.changed }; },
    async saveDraft(c) { read(); mem = { draft: clone(c), changed: true }; write(); },
    async publish(c) { mem = { draft: clone(c), changed: false }; write(); },
    upload: (file) =>
      new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = () => rej(r.error);
        r.readAsDataURL(file);
      }),
  };
}

export async function firebaseBackend(): Promise<Backend> {
  const { initializeApp } = await import('firebase/app');
  const { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } = await import('firebase/auth');
  const { getFirestore, doc, getDoc, setDoc } = await import('firebase/firestore');
  const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');

  const app = initializeApp(config);
  if (env.PUBLIC_FIREBASE_APPCHECK_SITE_KEY) {
    const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
    initializeAppCheck(app, { provider: new ReCaptchaV3Provider(env.PUBLIC_FIREBASE_APPCHECK_SITE_KEY), isTokenAutoRefreshEnabled: true });
  }
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const draftRef = doc(db, 'site', 'draft');
  const liveRef = doc(db, 'site', 'live');

  // Firestore rejects `undefined`; the JSON round-trip drops it.
  const plain = (c: Content) => clone(c);

  return {
    demo: false,
    onAuth: (cb) => onAuthStateChanged(auth, (u) => cb(!!u, u?.email ?? undefined)),
    async signIn(email, password) { await signInWithEmailAndPassword(auth, email, password); },
    async signOut() { await signOut(auth); },
    async load() {
      const [d, l] = await Promise.all([getDoc(draftRef), getDoc(liveRef)]);
      const live = l.exists() ? (l.data() as Content & { publishedAt?: string }) : null;
      const draft = d.exists() ? (d.data() as Content & { updatedAt?: string }) : null;
      const base = draft ?? live ?? seed;
      const { updatedAt, publishedAt, ...content } = base as Content & { updatedAt?: string; publishedAt?: string };
      void publishedAt;
      return {
        draft: { ...clone(seed), ...content } as Content,
        changed: !live || (!!draft && (updatedAt || '') > (live.publishedAt || '')),
      };
    },
    async saveDraft(c) { await setDoc(draftRef, { ...plain(c), updatedAt: new Date().toISOString() }); },
    async publish(c) {
      const at = new Date().toISOString();
      await setDoc(draftRef, { ...plain(c), updatedAt: at });
      await setDoc(liveRef, { ...plain(c), publishedAt: at });
    },
    async upload(file, folder) {
      const r = ref(storage, `uploads/${folder}/${Date.now()}-${file.name.replace(/[^\w.-]+/g, '_')}`);
      await uploadBytes(r, file, { contentType: file.type });
      return getDownloadURL(r);
    },
  };
}
