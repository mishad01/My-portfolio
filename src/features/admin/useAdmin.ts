import { useEffect, useMemo, useRef, useState } from 'react';
import type { Content, ListSection, Section } from '@/domain/types';
import { SEED_VERSION, seed } from '@/data/seed';
import { type Backend, demoBackend, firebaseBackend, firebaseConfigured } from './backend';
import { describeError } from './errors';
import { type Form, applyForm, blank, meta, toForm } from './schema';

export type Screen = 'login' | 'dashboard' | 'list' | 'edit' | 'inline';
export type AuthState = 'loading' | 'out' | 'in';
type Snack = { message: string; undo?: boolean } | null;
type Deleted = { sec: ListSection; item: { id: string }; index: number };
type Item = { id: string; status: 'draft' | 'published' };

export const listOf = (c: Content, s: Section) => (Array.isArray(c[s]) ? (c[s] as Item[]) : null);
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const LOAD_TIMEOUT = 15000;

/**
 * Only migrate content that predates this code's release. Versions start with
 * a date (YYYY-MM-DD-…), so string order is release order. Never overwrite
 * content published by a newer or different copy of the site.
 */
const isOlderRelease = (stored?: string) => !stored ? true : stored < SEED_VERSION && stored.slice(0, 10) < SEED_VERSION.slice(0, 10);
const SAVE_DEBOUNCE = 400;

/**
 * Admin view-model: owns auth, the draft content, navigation and every user
 * action. Screens only render what it exposes and call its commands; it knows
 * nothing about markup. Data access goes through the Backend interface
 * (Firebase or the in-browser demo).
 */
export function useAdmin() {
  const q = useMemo(() => new URLSearchParams(typeof location === 'undefined' ? '' : location.search), []);
  const demoOnly = q.get('demo') === '1' || !firebaseConfigured;

  const [backend, setBackend] = useState<Backend | null>(null);
  const [auth, setAuth] = useState<AuthState>('loading');
  const [content, setContent] = useState<Content | null>(null);
  const [changed, setChanged] = useState(false);
  const [screen, setScreen] = useState<Screen>('login');
  const [sec, setSec] = useState<Section>((q.get('sec') as Section) || 'experience');
  const [form, setForm] = useState<Form | null>(null);
  const [snack, setSnack] = useState<Snack>(null);
  const [deleted, setDeleted] = useState<Deleted | null>(null);
  const [dark, setDark] = useState(q.get('dark') === '1');
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const snackTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);

  const notify = (message: string, undo = false) => {
    clearTimeout(snackTimer.current);
    setSnack({ message, undo });
    snackTimer.current = setTimeout(() => setSnack(null), 3200);
  };

  /** First screen after sign-in; the canvas deep-links with ?screen=&sec=&id=. */
  const openInitial = (c: Content) => {
    const want = (q.get('screen') as Screen) || 'dashboard';
    if (want === 'edit') {
      const k = (q.get('sec') as Section) || 'experience';
      setSec(k);
      setForm(toForm(k, c, meta(k).single ? 'single' : q.get('id') || listOf(c, k)?.[0]?.id || null));
    }
    setScreen(want === 'login' ? 'dashboard' : want);
  };

  // Choose a backend, then follow auth state.
  useEffect(() => {
    let off = () => {};
    (async () => {
      const b = demoOnly ? demoBackend({ changed: q.get('changed') === '1', persist: q.get('demo') !== '1' }) : await firebaseBackend();
      setBackend(b);
      off = b.onAuth(async (signedIn) => {
        try { if (!b.demo) signedIn ? localStorage.setItem('pfAdmin', '1') : localStorage.removeItem('pfAdmin'); } catch {}
        if (!signedIn) { setAuth('out'); setScreen('login'); return; }
        setAuth('loading');
        try {
          const s = await Promise.race([b.load(), new Promise<never>((_, rej) => setTimeout(() => rej(new Error('firestore-timeout')), LOAD_TIMEOUT))]);
          // Content migration: a newer built-in release replaces the draft and goes live once.
          let draft = s.draft;
          if (isOlderRelease(draft.seedVersion) && q.get('demo') !== '1') {
            draft = clone(seed);
            await b.publish(draft);
            setChanged(false);
            notify('Your site was updated with the latest built-in content (from your CV) and published.');
          } else {
            setChanged(s.changed || q.get('changed') === '1');
          }
          setContent(draft);
          setAuth('in');
          openInitial(draft);
        } catch (e) {
          console.error('[admin] loading content failed', e);
          setError(describeError(e));
          // Sign out so the next "Sign in" starts over (auth would otherwise stay signed in silently).
          await b.signOut().catch(() => {});
          setAuth('out');
        }
      });
      if (b.demo && q.get('screen') && q.get('screen') !== 'login') await b.signIn('mishad@example.com', '');
    })();
    return () => off();
  }, []);

  /** Apply a change locally and save the draft shortly after. */
  const commit = (next: Content) => {
    setContent(next);
    setChanged(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => backend?.saveDraft(next).catch((e) => notify('Couldn’t save draft: ' + describeError(e))), SAVE_DEBOUNCE);
  };

  const run = async (tag: string, fn: () => Promise<void>, fail: string) => {
    setBusy(tag);
    try { await fn(); } catch (e) { notify(fail + describeError(e)); } finally { setBusy(''); }
  };

  const c = content;
  const list = (c && listOf(c, sec)) || [];
  const setList = (next: Item[]) => c && commit({ ...c, [sec]: next } as Content);

  return {
    // ---- state
    backend, auth, content, changed, screen, sec, meta: meta(sec), form, list, snack, deleted, dark, menuOpen, error, busy,
    demo: !!backend?.demo,
    loginDefaults: demoOnly ? { email: 'mishad@example.com', password: 'password' } : { email: '', password: '' },

    // ---- session
    async signIn(email: string, password: string) {
      if (!backend) return;
      setError('');
      setBusy('signin');
      try { await backend.signIn(email, password); } catch (e) { setError(describeError(e)); } finally { setBusy(''); }
    },
    signOut: () => backend?.signOut(),
    toggleDark: () => setDark((d) => !d),

    // ---- navigation
    go(s: Screen) { setMenuOpen(false); setScreen(s); },
    openSection(k: Section) {
      if (!c) return;
      setMenuOpen(false);
      setSec(k);
      if (meta(k).single) { setForm(toForm(k, c, 'single')); setScreen('edit'); } else setScreen('list');
    },
    back: () => setScreen(screen === 'edit' && !meta(sec).single ? 'list' : 'dashboard'),
    setMenuOpen,

    // ---- publishing
    publish: () =>
      run('publish', async () => {
        if (!backend || !c || !changed) return;
        clearTimeout(saveTimer.current);
        await backend.publish(c);
        setChanged(false);
        notify(backend.demo ? 'Published (demo — nothing left this browser)' : 'Published · the site updates within ~15 minutes');
      }, 'Publish failed: '),
    loadBuiltIn() {
      commit(clone(seed));
      notify('Draft replaced · review it, then Publish');
    },
    commit,

    // ---- list
    addItem() { setForm(blank(sec)); setScreen('edit'); },
    editItem(id: string) { if (c) { setForm(toForm(sec, c, id)); setScreen('edit'); } },
    toggleStatus(id: string) {
      const it = list.find((x) => x.id === id);
      if (!it) return;
      const pub = it.status === 'published';
      setList(list.map((x) => (x.id === id ? { ...x, status: pub ? 'draft' : 'published' } : x)));
      notify(pub ? 'Moved to drafts' : 'Marked published');
    },
    deleteItem(id: string, title: string) {
      const index = list.findIndex((x) => x.id === id);
      setDeleted({ sec: sec as ListSection, item: list[index], index });
      setList(list.filter((x) => x.id !== id));
      notify(`Deleted “${title}”`, true);
    },
    undoDelete() {
      if (!c || !deleted) return;
      const a = [...(c[deleted.sec] as { id: string }[])];
      a.splice(deleted.index, 0, deleted.item);
      commit({ ...c, [deleted.sec]: a } as Content);
      setDeleted(null);
      setSnack(null);
    },
    /** Move `from` to where `to` is (drag and drop). */
    reorder(from: string, to: string) {
      if (from === to) return;
      const a = [...list];
      const [x] = a.splice(a.findIndex((i) => i.id === from), 1);
      a.splice(a.findIndex((i) => i.id === to), 0, x);
      setList(a);
    },
    /** Move one step up/down (keyboard). */
    move(id: string, d: -1 | 1) {
      const i = list.findIndex((x) => x.id === id), j = i + d;
      if (j < 0 || j >= list.length) return;
      const a = [...list];
      [a[i], a[j]] = [a[j], a[i]];
      setList(a);
    },

    // ---- edit form
    setField: (k: string, v: unknown) => setForm((f) => (f ? { ...f, [k]: v } : f)),
    upload: (file: File, k: string, multi: boolean) =>
      run('upload:' + k, async () => {
        if (!backend) return;
        const url = await backend.upload(file, sec);
        setForm((f) => (f ? { ...f, [k]: multi ? [...(f[k] || []), url] : url } : f));
      }, 'Upload failed: '),
    save() {
      if (!c || !form) return;
      commit(applyForm(sec, c, form));
      if (meta(sec).single) { notify('Saved · publish to go live'); return; }
      setScreen('list');
      notify(form.status === 'published' ? 'Saved · publish to go live' : 'Saved as draft');
    },
    discard: () => setScreen(meta(sec).single ? 'dashboard' : 'list'),
  };
}

export type AdminVM = ReturnType<typeof useAdmin>;
