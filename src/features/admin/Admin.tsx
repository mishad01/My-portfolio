import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Content, ListSection, Section } from '@/domain/types';
import { seed } from '@/data/seed';
import { type Backend, demoBackend, firebaseBackend, firebaseConfigured } from './backend';
import { FIELDS, META, type Field, type Form, applyForm, blank, meta, setEn, subOf, tags, titleOf, toForm } from './schema';

type Screen = 'login' | 'dashboard' | 'list' | 'edit' | 'inline';
type Toast = { msg: string; undo?: boolean } | null;

const fieldBox = 'flex flex-col gap-0.5 rounded-xl border border-outline px-4 py-2';
const fieldInput = 'w-full border-0 bg-transparent p-0 text-base leading-6 text-on-surface outline-0';
const navItem = 'flex cursor-pointer items-center gap-3 border-0 px-4 text-left text-sm font-medium';
const inlineEdit = 'rounded-lg border-0 bg-transparent p-0 outline-0 hover:shadow-[0_0_0_2px_var(--md-primary)] focus:shadow-[0_0_0_2px_var(--md-primary)]';

const listOf = (c: Content, s: Section) => (Array.isArray(c[s]) ? (c[s] as any[]) : null);

export default function Admin() {
  const q = useMemo(() => new URLSearchParams(typeof location === 'undefined' ? '' : location.search), []);
  const forceDemo = q.get('demo') === '1';
  const [be, setBe] = useState<Backend | null>(null);
  const [auth, setAuth] = useState<'loading' | 'out' | 'in'>('loading');
  const [content, setContent] = useState<Content | null>(null);
  const [changed, setChanged] = useState(false);
  const [screen, setScreen] = useState<Screen>('login');
  const [sec, setSec] = useState<Section>((q.get('sec') as Section) || 'experience');
  const [form, setForm] = useState<Form | null>(null);
  const [toast, setToastState] = useState<Toast>(null);
  const [last, setLast] = useState<{ sec: ListSection; it: any; idx: number } | null>(null);
  const [drag, setDrag] = useState<{ id: string | null; over: string | null }>({ id: null, over: null });
  const [dark, setDark] = useState(q.get('dark') === '1');
  const [email, setEmail] = useState(forceDemo || !firebaseConfigured ? 'mishad@example.com' : '');
  const [password, setPassword] = useState(forceDemo || !firebaseConfigured ? 'password' : '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [menu, setMenu] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);

  // Pick a backend, then follow auth.
  useEffect(() => {
    let off = () => {};
    (async () => {
      const b = forceDemo || !firebaseConfigured ? demoBackend({ changed: q.get('changed') === '1', persist: !forceDemo }) : await firebaseBackend();
      setBe(b);
      off = b.onAuth(async (inn) => {
        try { if (!b.demo) inn ? localStorage.setItem('pfAdmin', '1') : localStorage.removeItem('pfAdmin'); } catch {}
        if (!inn) { setAuth('out'); setScreen('login'); return; }
        setAuth('loading');
        try {
          const s = await Promise.race([
            b.load(),
            new Promise<never>((_, rej) => setTimeout(() => rej(new Error('firestore-timeout')), 15000)),
          ]);
          setContent(s.draft);
          setChanged(s.changed || q.get('changed') === '1');
          setAuth('in');
          const want = (q.get('screen') as Screen) || 'dashboard';
          openScreen(want === 'login' ? 'dashboard' : want, s.draft);
        } catch (e) {
          console.error('[admin] loading content failed', e);
          setError(msg(e));
          // Sign out so the next "Sign in" starts over (auth would otherwise stay signed in silently).
          await b.signOut().catch(() => {});
          setAuth('out');
        }
      });
      // Canvas frames open straight onto a screen.
      if (b.demo && q.get('screen') && q.get('screen') !== 'login') await b.signIn('mishad@example.com', '');
    })();
    return () => off();
  }, []);

  const openScreen = (s: Screen, c: Content) => {
    if (s === 'edit') {
      const k = (q.get('sec') as Section) || 'experience';
      const m = meta(k);
      const list = listOf(c, k);
      const id = m.single ? 'single' : q.get('id') || list?.[0]?.id || null;
      setSec(k);
      setForm(toForm(k, c, id));
    }
    setScreen(s);
  };

  const showToast = (m: string, undo = false) => {
    clearTimeout(toastTimer.current);
    setToastState({ msg: m, undo });
    toastTimer.current = setTimeout(() => setToastState(null), 3200);
  };

  /** Apply a change locally and save the draft shortly after. */
  const commit = useCallback(
    (next: Content) => {
      setContent(next);
      setChanged(true);
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => be?.saveDraft(next).catch((e) => showToast('Couldn’t save draft: ' + msg(e))), 400);
    },
    [be],
  );

  if (auth === 'loading' || !be) return <div className="flex min-h-screen items-center justify-center text-on-surface-variant">{be ? 'Loading your content…' : 'Loading…'}</div>;

  const signIn = async () => {
    setError('');
    setBusy('signin');
    try { await be.signIn(email, password); } catch (e) { setError(msg(e)); } finally { setBusy(''); }
  };

  if (auth === 'out' || !content || screen === 'login') {
    return (
      <div className="box-border flex min-h-screen flex-1 items-center justify-center p-6">
        <form onSubmit={(e) => { e.preventDefault(); signIn(); }} className="box-border flex w-full max-w-[400px] flex-col gap-5 rounded-[28px] bg-surface-low p-9">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-primary font-[Inter_Tight] text-2xl font-bold tracking-[-.03em] text-on-primary">M</div>
            <span className="text-sm font-medium text-on-surface-variant">Portfolio admin</span>
          </div>
          <h1 className="m-0 h-display text-4xl leading-10">Sign in</h1>
          <label className={fieldBox}>
            <span className="text-xs text-on-surface-variant">Email</span>
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldInput} required />
          </label>
          <label className={fieldBox}>
            <span className="text-xs text-on-surface-variant">Password</span>
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldInput} required={!be.demo} />
          </label>
          {error && <span className="text-sm text-error">{error}</span>}
          <button type="submit" disabled={busy === 'signin'} className="flex h-12 items-center justify-center rounded-3xl border-0 bg-primary font-medium text-on-primary hover:opacity-[.92] disabled:opacity-60">
            {busy === 'signin' ? 'Signing in…' : 'Sign in'}
          </button>
          <span className="text-[13px] text-on-surface-variant">
            {be.demo ? 'Demo mode — Firebase isn’t configured, so any credentials work and edits stay in this browser.' : 'Only the site owner can sign in.'}
          </span>
        </form>
      </div>
    );
  }

  const c = content;
  const m = meta(sec);

  const openSec = (k: Section) => {
    setMenu(false);
    setSec(k);
    if (meta(k).single) { setForm(toForm(k, c, 'single')); setScreen('edit'); }
    else setScreen('list');
  };
  const go = (s: Screen) => { setMenu(false); setScreen(s); };

  const publish = async () => {
    if (!changed || busy) return;
    clearTimeout(saveTimer.current);
    setBusy('publish');
    try {
      await be.publish(c);
      setChanged(false);
      showToast(be.demo ? 'Published (demo — nothing left this browser)' : 'Published · the site rebuilds in a few minutes');
    } catch (e) { showToast('Publish failed: ' + msg(e)); } finally { setBusy(''); }
  };

  // ---------- list
  const ls = sec as ListSection;
  const list = listOf(c, sec) ?? [];
  const setList = (next: any[]) => commit({ ...c, [ls]: next } as Content);
  const reorder = (from: string | null, to: string) => {
    setDrag({ id: null, over: null });
    if (!from || from === to) return;
    const a = [...list];
    const i = a.findIndex((x) => x.id === from), j = a.findIndex((x) => x.id === to);
    const [x] = a.splice(i, 1);
    a.splice(j, 0, x);
    setList(a);
  };
  const move = (id: string, d: number) => {
    const i = list.findIndex((x) => x.id === id), j = i + d;
    if (j < 0 || j >= list.length) return;
    const a = [...list];
    [a[i], a[j]] = [a[j], a[i]];
    setList(a);
  };

  // ---------- edit
  const setField = (k: string, v: any) => setForm((f) => (f ? { ...f, [k]: v } : f));
  const upload = async (file: File | undefined, k: string, multi: boolean) => {
    if (!file) return;
    setBusy('upload:' + k);
    try {
      const u = await be.upload(file, sec);
      setForm((f) => (f ? { ...f, [k]: multi ? [...(f[k] || []), u] : u } : f));
    } catch (e) { showToast('Upload failed: ' + msg(e)); } finally { setBusy(''); }
  };
  const save = () => {
    if (!form) return;
    const next = applyForm(sec, c, form);
    commit(next);
    if (m.single) { showToast('Saved · publish to go live'); return; }
    setScreen('list');
    showToast(form.status === 'published' ? 'Saved · publish to go live' : 'Saved as draft');
  };
  const pubNow = form?.status === 'published';

  const titles: Record<Screen, string> = { login: '', dashboard: 'Dashboard', inline: 'Edit on page', list: m.name, edit: m.single ? m.name : form?.id ? `Edit ${m.one}` : `New ${m.one}` };
  const back = () => setScreen(screen === 'edit' && !m.single ? 'list' : 'dashboard');

  const sidebar = (
    <aside className={'box-border h-screen w-[280px] flex-none flex-col gap-1 overflow-y-auto bg-surface-low px-3 py-5 ' + (menu ? 'fixed inset-y-0 left-0 z-40 flex shadow-xl' : 'sticky top-0 hidden lg:flex')}>
      <div className="flex items-center gap-3 px-4 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-[Inter_Tight] text-xl font-bold text-on-primary">M</div>
        <div className="flex flex-col">
          <span className="h-title text-lg leading-[22px]">Portfolio</span>
          <span className="text-xs text-on-surface-variant">Admin{be.demo ? ' · demo' : ''}</span>
        </div>
      </div>
      {([['dashboard', 'Dashboard', 'dashboard'], ['inline', 'Edit on page', 'edit_note']] as const).map(([id, label, icon]) => {
        const on = screen === id;
        return (
          <button key={id} type="button" onClick={() => go(id)} className={navItem + ' h-14 rounded-[28px] ' + (on ? 'bg-secondary-container text-on-secondary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-highest')}>
            <span className="ms">{icon}</span>{label}
          </button>
        );
      })}
      <span className="kicker px-4 pt-5 pb-2 text-on-surface-variant">Content</span>
      {META.map((x) => {
        const on = (screen === 'list' || screen === 'edit') && sec === x.k;
        const a = listOf(c, x.k);
        const dr = a ? a.filter((i) => i.status === 'draft').length : 0;
        return (
          <button key={x.k} type="button" onClick={() => openSec(x.k)} className={navItem + ' h-12 rounded-3xl ' + (on ? 'bg-secondary-container text-on-secondary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-highest')}>
            <span className="ms text-[22px]">{x.icon}</span>
            <span className="flex-1">{x.name}</span>
            {dr > 0 && <span className="text-xs opacity-80">{dr} draft</span>}
          </button>
        );
      })}
      <div className="flex-1" />
      <a href="/" target="_blank" rel="noopener" className={navItem + ' h-12 rounded-3xl text-on-surface-variant no-underline hover:bg-surface-highest hover:text-on-surface-variant'}>
        <span className="ms text-[22px]">open_in_new</span>View site
      </a>
      <button type="button" onClick={() => be.signOut()} className={navItem + ' h-12 rounded-3xl bg-transparent text-on-surface-variant hover:bg-surface-highest'}>
        <span className="ms text-[22px]">logout</span>Sign out
      </button>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {sidebar}
      {menu && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMenu(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-4 bg-surface px-4 py-4 sm:px-8">
          <button type="button" onClick={() => setMenu(true)} aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant hover:bg-surface-highest lg:hidden"><span className="ms">menu</span></button>
          {screen !== 'dashboard' && (
            <button type="button" onClick={back} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant hover:bg-surface-highest"><span className="ms">arrow_back</span></button>
          )}
          <h1 className="m-0 min-w-[200px] flex-1 h-title text-[28px] leading-9">{titles[screen]}</h1>
          <div className={'flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium ' + (changed ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container')}>
            <span className="ms text-lg">{changed ? 'pending' : 'check_circle'}</span>
            {changed ? 'Unpublished changes' : 'All changes published'}
          </div>
          <button type="button" onClick={() => setDark(!dark)} aria-label="Theme" className="flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant hover:bg-surface-highest"><span className="ms">{dark ? 'light_mode' : 'dark_mode'}</span></button>
          <button type="button" onClick={publish} disabled={!changed || !!busy} className={'flex h-10 items-center gap-2 rounded-[20px] border-0 px-6 text-sm font-medium ' + (changed ? 'cursor-pointer bg-primary text-on-primary' : 'cursor-default bg-surface-highest text-on-surface-variant')}>
            <span className="ms text-xl">rocket_launch</span>{busy === 'publish' ? 'Publishing…' : 'Publish'}
          </button>
        </header>

        <main className="flex flex-col gap-6 px-4 pt-2 pb-[120px] sm:px-8">
          {screen === 'dashboard' && (
            <div className="flex flex-col gap-6">
              <button type="button" onClick={() => go('inline')} className="flex cursor-pointer flex-wrap items-center gap-5 rounded-[28px] border-0 bg-primary-container p-7 text-left text-on-primary-container hover:opacity-95">
                <span className="ms text-[40px]">edit_note</span>
                <div className="flex min-w-[240px] flex-1 flex-col gap-1">
                  <span className="h-title text-2xl leading-8">Edit on page</span>
                  <span>Click any text on a live copy of the page — hero, name, Now cards — and type.</span>
                </div>
                <span className="ms">arrow_forward</span>
              </button>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                {META.map((x) => {
                  const a = listOf(c, x.k);
                  const pub = a ? a.filter((i) => i.status === 'published').length : 1;
                  const dr = a ? a.length - pub : 0;
                  return (
                    <button key={x.k} type="button" onClick={() => openSec(x.k)} className="flex cursor-pointer flex-col gap-4 rounded-3xl border-0 bg-surface-high p-5 text-left text-on-surface hover:bg-surface-highest">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-secondary-container text-on-secondary-container"><span className="ms">{x.icon}</span></div>
                        <span className="text-base font-medium">{x.name}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="h-title text-4xl leading-10">{a ? a.length : 1}</span>
                        <span className="text-[13px] text-on-surface-variant">{a ? `${pub} published${dr ? ` · ${dr} draft` : ''}` : 'single record'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-outline-variant p-5">
                <span className="ms text-on-surface-variant">restore_page</span>
                <div className="flex min-w-[240px] flex-1 flex-col">
                  <span className="font-medium">Load content from code</span>
                  <span className="text-sm text-on-surface-variant">Replace your draft with the content built into the site (from your CV). Nothing goes live until you press Publish.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm('Replace your whole draft with the built-in content? Your unpublished edits will be lost; the live site stays as it is until you Publish.')) return;
                    commit(JSON.parse(JSON.stringify(seed)));
                    showToast('Draft replaced · review it, then Publish');
                  }}
                  className="flex h-10 cursor-pointer items-center rounded-[20px] border border-outline bg-transparent px-6 text-sm font-medium text-primary hover:bg-surface-mid"
                >
                  Load into draft
                </button>
              </div>
            </div>
          )}

          {screen === 'list' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex min-w-[220px] flex-1 items-center gap-2 text-on-surface-variant"><span className="ms text-xl">drag_indicator</span>Drag rows to reorder · tap a status to switch Draft / Published</span>
                <button type="button" onClick={() => { setForm(blank(sec)); setScreen('edit'); }} className="flex h-14 cursor-pointer items-center gap-3 rounded-2xl border-0 bg-primary-container pr-6 pl-4 text-sm font-medium text-on-primary-container shadow-[0_2px_6px_rgba(0,0,0,.2)] hover:opacity-[.94]">
                  <span className="ms">add</span><span>Add {m.one}</span>
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {list.map((it) => {
                  const pub = it.status === 'published';
                  const over = drag.over === it.id && drag.id && drag.id !== it.id;
                  const title = titleOf(ls, it);
                  return (
                    <div
                      key={it.id}
                      draggable
                      onDragStart={(e) => { try { e.dataTransfer.setData('text/plain', it.id); } catch {} setDrag({ id: it.id, over: null }); }}
                      onDragOver={(e) => { e.preventDefault(); if (drag.over !== it.id) setDrag((d) => ({ ...d, over: it.id })); }}
                      onDrop={(e) => { e.preventDefault(); reorder(drag.id, it.id); }}
                      onDragEnd={() => setDrag({ id: null, over: null })}
                      onKeyDown={(e) => { if (e.altKey && e.key === 'ArrowUp') { e.preventDefault(); move(it.id, -1); } if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); move(it.id, 1); } }}
                      className={'flex items-center gap-4 rounded-[20px] border-2 py-3 pr-4 pl-2 ' + (over ? 'border-primary bg-primary-container' : 'border-transparent bg-surface-low')}
                      style={{ opacity: drag.id === it.id ? 0.4 : 1 }}
                    >
                      <span className="ms cursor-grab text-on-surface-variant" title="Drag (or Alt+↑/↓) to reorder">drag_indicator</span>
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-[14px] bg-secondary-container text-on-secondary-container"><span className="ms">{sec === 'now' ? it.icon : m.icon}</span></div>
                      <button type="button" onClick={() => { setForm(toForm(sec, c, it.id)); setScreen('edit'); }} className="flex min-w-0 flex-1 cursor-pointer flex-col border-0 bg-transparent p-0 text-left text-on-surface">
                        <span className="overflow-hidden text-base font-medium text-ellipsis whitespace-nowrap">{title || '(untitled)'}</span>
                        <span className="overflow-hidden text-sm text-ellipsis whitespace-nowrap text-on-surface-variant">{subOf(ls, it)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setList(list.map((x) => (x.id === it.id ? { ...x, status: pub ? 'draft' : 'published' } : x))); showToast(pub ? 'Moved to drafts' : 'Marked published'); }}
                        className={'flex h-8 flex-none cursor-pointer items-center gap-1.5 rounded-lg border px-3.5 text-[13px] font-medium ' + (pub ? 'border-transparent bg-secondary-container text-on-secondary-container' : 'border-outline bg-transparent text-on-surface-variant')}
                      >
                        <span className="ms text-base">{pub ? 'public' : 'edit_off'}</span>{pub ? 'Published' : 'Draft'}
                      </button>
                      <button type="button" onClick={() => { setForm(toForm(sec, c, it.id)); setScreen('edit'); }} aria-label="Edit" className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant hover:bg-surface-highest"><span className="ms">edit</span></button>
                      <button
                        type="button"
                        aria-label="Delete"
                        onClick={() => { const idx = list.findIndex((x) => x.id === it.id); setLast({ sec: ls, it, idx }); setList(list.filter((x) => x.id !== it.id)); showToast(`Deleted “${title}”`, true); }}
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-0 bg-transparent text-error hover:bg-error-container"
                      >
                        <span className="ms">delete</span>
                      </button>
                    </div>
                  );
                })}
                {list.length === 0 && <div className="rounded-3xl bg-surface-low p-12 text-center text-on-surface-variant">Nothing here yet. Add the first one.</div>}
              </div>
            </div>
          )}

          {screen === 'edit' && form && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-6">
              <div className="flex flex-col gap-4 rounded-[28px] bg-surface-low p-7">
                {FIELDS[sec].map((f) => (
                  <FieldInput key={f.k} f={f} v={form[f.k]} set={(v) => setField(f.k, v)} upload={(file) => upload(file, f.k, f.type === 'images')} uploading={busy === 'upload:' + f.k} />
                ))}
                {!m.single && (
                  <button type="button" onClick={() => setField('status', pubNow ? 'draft' : 'published')} role="switch" aria-checked={pubNow} className="mt-1 flex cursor-pointer items-center gap-4 border-0 border-t border-solid border-outline-variant bg-transparent px-1 py-3 text-left text-on-surface">
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium">{pubNow ? 'Published' : 'Draft'}</span>
                      <span className="text-sm text-on-surface-variant">{pubNow ? 'Visible on the live site after you publish' : 'Hidden from the site'}</span>
                    </div>
                    <div className={'relative box-border h-8 w-[52px] flex-none rounded-2xl border-2 transition-colors duration-200 ' + (pubNow ? 'border-primary bg-primary' : 'border-outline bg-surface-highest')}>
                      <div
                        className={'absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full text-on-primary-container transition-all duration-200 ' + (pubNow ? 'bg-on-primary' : 'bg-outline')}
                        style={{ left: pubNow ? 22 : 6, width: pubNow ? 24 : 16, height: pubNow ? 24 : 16 }}
                      >
                        {pubNow && <span className="ms text-base font-bold">check</span>}
                      </div>
                    </div>
                  </button>
                )}
                <div className="mt-2 flex flex-wrap justify-end gap-3">
                  <button type="button" onClick={() => setScreen(m.single ? 'dashboard' : 'list')} className="flex h-10 cursor-pointer items-center rounded-[20px] border border-outline bg-transparent px-6 text-sm font-medium text-primary hover:bg-surface-mid">Discard</button>
                  <button type="button" onClick={save} className="flex h-10 cursor-pointer items-center gap-2 rounded-[20px] border-0 bg-primary px-6 text-sm font-medium text-on-primary hover:opacity-[.92]"><span className="ms text-xl">check</span>Save</button>
                </div>
              </div>
              <Preview sec={sec} f={form} showDraft={!m.single && !pubNow} />
            </div>
          )}

          {screen === 'inline' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 rounded-2xl bg-tertiary-container px-5 py-3 text-sm font-medium text-on-tertiary-container">
                <span className="ms">ads_click</span>Click any text below to edit it. Changes are saved as unpublished edits until you press Publish.
              </div>
              <div className="overflow-hidden rounded-[28px] border border-outline-variant bg-surface">
                <div className="flex flex-col items-start gap-5 px-10 py-12">
                  <div className="flex h-8 items-center gap-2 rounded-lg bg-tertiary-container pr-3 pl-2 text-sm font-medium text-on-tertiary-container">
                    <span className="ms text-lg">flight_takeoff</span>
                    <input aria-label="Availability badge" value={c.profile.avail.en} onChange={(e) => commit({ ...c, profile: { ...c.profile, avail: setEn(c.profile.avail, e.target.value) } })} className="border-0 bg-transparent p-0 text-sm font-medium text-inherit outline-0" style={{ width: Math.max(120, c.profile.avail.en.length * 8) }} />
                  </div>
                  <input aria-label="Display name" value={c.profile.displayName.en} onChange={(e) => commit({ ...c, profile: { ...c.profile, displayName: setEn(c.profile.displayName, e.target.value) } })} className={inlineEdit + ' w-full rounded-xl h-display text-[clamp(48px,8vw,88px)] leading-none text-on-surface'} />
                  <input aria-label="Role line" value={c.profile.heroRole.en} onChange={(e) => commit({ ...c, profile: { ...c.profile, heroRole: setEn(c.profile.heroRole, e.target.value) } })} className={inlineEdit + ' w-full text-lg font-medium text-primary'} />
                  <textarea aria-label="Positioning sentence" rows={3} value={c.profile.heroPos.en} onChange={(e) => commit({ ...c, profile: { ...c.profile, heroPos: setEn(c.profile.heroPos, e.target.value) } })} className={inlineEdit + ' w-full max-w-[720px] resize-none text-[22px] leading-8 text-on-surface'} />
                </div>
                <div className="flex flex-col gap-6 bg-surface-low p-10">
                  <span className="h-display text-4xl leading-[44px]">Right now</span>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {c.now.map((n) => {
                      const patch = (k: 'label' | 'text', v: string) =>
                        commit({ ...c, now: c.now.map((x) => (x.id === n.id ? { ...x, [k]: setEn(x[k], v) } : x)), profile: { ...c.profile, nowUpdated: new Date().toISOString().slice(0, 10) } });
                      return (
                        <div key={n.id} className="flex flex-col gap-3 rounded-[28px] bg-primary-container p-6 text-on-primary-container" style={{ opacity: n.status === 'draft' ? 0.55 : 1 }}>
                          <span className="ms text-[28px]">{n.icon}</span>
                          <input aria-label="Label" value={n.label.en} onChange={(e) => patch('label', e.target.value)} className="kicker w-full rounded-md border-0 bg-transparent p-0 text-inherit outline-0 hover:shadow-[0_0_0_2px_currentColor] focus:shadow-[0_0_0_2px_currentColor]" />
                          <textarea aria-label="Text" rows={3} value={n.text.en} onChange={(e) => patch('text', e.target.value)} className="w-full resize-none rounded-md border-0 bg-transparent p-0 text-lg leading-[26px] text-inherit outline-0 hover:shadow-[0_0_0_2px_currentColor] focus:shadow-[0_0_0_2px_currentColor]" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-7 left-1/2 z-50 flex min-h-12 -translate-x-1/2 items-center gap-4 rounded-xl bg-inverse pr-2 pl-5 text-sm text-on-inverse shadow-[0_4px_12px_rgba(0,0,0,.3)]">
          <span className="py-3">{toast.msg}</span>
          {toast.undo && last && (
            <button
              type="button"
              onClick={() => {
                const a = [...(c[last.sec] as any[])];
                a.splice(last.idx, 0, last.it);
                commit({ ...c, [last.sec]: a } as Content);
                setLast(null);
                setToastState(null);
              }}
              className="flex h-9 items-center rounded-[18px] border-0 bg-transparent px-3 font-semibold text-inverse-primary"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FieldInput({ f, v, set, upload, uploading }: { f: Field; v: any; set: (v: any) => void; upload: (f: File | undefined) => void; uploading: boolean }) {
  const label = f.label + (f.type === 'tags' ? ' · comma-separated' : f.type === 'lines' ? ' · one per line' : '');
  if (f.type === 'text' || f.type === 'tags')
    return (
      <label className={fieldBox}>
        <span className="text-xs text-on-surface-variant">{label}</span>
        <input value={v ?? ''} placeholder={f.hint} onChange={(e) => set(e.target.value)} className={fieldInput} />
      </label>
    );
  if (f.type === 'area' || f.type === 'lines')
    return (
      <label className={fieldBox}>
        <span className="text-xs text-on-surface-variant">{label}</span>
        <textarea rows={f.type === 'lines' ? 4 : 3} value={v ?? ''} onChange={(e) => set(e.target.value)} className={fieldInput + ' resize-y'} />
      </label>
    );
  if (f.type === 'select')
    return (
      <div className="flex flex-col gap-1.5">
        <span className="pl-1 text-xs text-on-surface-variant">{f.label}</span>
        <div className="flex flex-wrap gap-2">
          {f.options!.map((o) => {
            const on = v === o;
            return (
              <button key={o} type="button" onClick={() => set(o)} aria-pressed={on} className={'box-border flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium ' + (on ? 'border-transparent bg-secondary-container text-on-secondary-container' : 'border-outline bg-transparent text-on-surface-variant')}>
                {on && <span className="ms text-lg">check</span>}
                {/^[a-z_]+$/.test(o) && f.k === 'icon' ? <span className="ms text-lg">{o}</span> : o}
              </button>
            );
          })}
        </div>
      </div>
    );
  if (f.type === 'file')
    return (
      <div className="flex flex-col gap-1.5">
        <label className={fieldBox}>
          <span className="text-xs text-on-surface-variant">{f.label} · path or uploaded URL</span>
          <input value={v ?? ''} onChange={(e) => set(e.target.value)} className={fieldInput} />
        </label>
        <label className="flex h-8 cursor-pointer items-center gap-1.5 self-start rounded-lg px-3 text-[13px] font-medium text-primary hover:bg-surface-mid">
          <span className="ms text-lg">upload_file</span>{uploading ? 'Uploading…' : 'Upload file'}
          <input type="file" accept={f.accept} className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        </label>
      </div>
    );
  const multi = f.type === 'images';
  const imgs: string[] = multi ? v || [] : v ? [v] : [];
  const drop = (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files?.[0]); }}
      className="relative flex h-40 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-[20px] border-2 border-dashed border-outline bg-cover bg-center text-on-surface-variant hover:bg-surface-mid"
      style={!multi && v ? { backgroundImage: `url(${v})` } : undefined}
    >
      {(multi || !v) && (
        <>
          <span className="ms text-[32px]">{uploading ? 'hourglass_top' : 'upload'}</span>
          <span className="text-sm">{uploading ? 'Uploading…' : 'Drop an image or click to browse'}</span>
        </>
      )}
      <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
    </label>
  );
  return (
    <div className="flex flex-col gap-1.5">
      <span className="pl-1 text-xs text-on-surface-variant">{f.label}</span>
      {multi && imgs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {imgs.map((src, i) => (
            <div key={src + i} className={'relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-surface-highest bg-cover bg-center font-mono text-[10px] text-on-surface-variant' + (src ? '' : ' stripes')} style={src ? { backgroundImage: `url(${src})` } : undefined}>
              {!src && 'placeholder'}
              <button type="button" aria-label="Remove image" onClick={() => set(imgs.filter((_, j) => j !== i))} className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border-0 bg-surface text-error"><span className="ms text-base">close</span></button>
            </div>
          ))}
        </div>
      )}
      {drop}
      {!multi && v && (
        <button type="button" onClick={() => set('')} className="flex h-8 items-center gap-1.5 self-start rounded-lg border-0 bg-transparent px-3 text-[13px] font-medium text-error">
          <span className="ms text-lg">delete</span>Remove image
        </button>
      )}
    </div>
  );
}

function Preview({ sec, f, showDraft }: { sec: Section; f: Form; showDraft: boolean }) {
  let pv = { tone: 'bg-surface-low text-on-surface border-outline-variant', kicker: '', title: '', body: '', meta: '', tags: [] as string[], icon: '', cover: false, img: '', titleSize: '24px' };
  const set = (o: Partial<typeof pv>) => (pv = { ...pv, ...o });
  const prim = 'bg-primary-container text-on-primary-container border-transparent';
  if (sec === 'profile') set({ tone: prim, kicker: f.avail, title: f.displayName, titleSize: '56px', body: f.heroPos, meta: f.heroRole, tags: tags(f.stack), cover: !!f.portrait, img: f.portrait });
  if (sec === 'now') set({ tone: { primary: prim, secondary: 'bg-secondary-container text-on-secondary-container border-transparent', tertiary: 'bg-tertiary-container text-on-tertiary-container border-transparent' }[f.tone as 'primary'] ?? prim, icon: f.icon, kicker: f.label, body: f.text });
  if (sec === 'experience') set({ kicker: `${f.start || ''} – ${f.end || ''}`, title: f.role, body: f.summary, meta: f.org + (f.location ? ` · ${f.location}` : ''), tags: tags(f.skills) });
  if (sec === 'projects') set({ tone: 'bg-surface-high text-on-surface border-transparent', cover: true, img: f.images?.[0] || '', title: f.name, body: f.desc, tags: tags(f.stack) });
  if (sec === 'classes') set({ tone: 'bg-surface-high text-on-surface border-transparent', kicker: `${f.level || ''} · ${f.weeks || '–'} weeks · ${f.batches || '–'} batches`, title: f.name, body: f.desc, meta: f.outcome ? `Students build: ${f.outcome}` : '', tags: tags(f.topics), icon: f.icon });
  if (sec === 'research') set({ tone: 'bg-tertiary-container text-on-tertiary-container border-transparent', cover: true, img: f.image, kicker: `${f.kind || ''} · ${f.venue || ''}`, title: f.title, body: f.summary, tags: tags(f.tags) });
  if (sec === 'education') set({ tone: f.highlight === 'Yes' ? 'bg-tertiary-container text-on-tertiary-container border-transparent' : pv.tone, kicker: f.tag, title: f.level, body: f.inst, meta: f.result });
  if (sec === 'contact') set({ tone: 'bg-secondary-container text-on-secondary-container border-transparent', kicker: 'Contact', title: f.email, titleSize: '28px', body: [f.github, f.linkedin].filter(Boolean).join('\n'), meta: f.cv });
  return (
    <div className="sticky top-[88px] flex flex-col gap-3">
      <div className="kicker flex items-center gap-2 text-on-surface-variant"><span className="ms text-lg">visibility</span>Live preview · as visitors see it</div>
      {showDraft && (
        <div className="flex h-9 items-center gap-2 rounded-xl bg-surface-highest px-3.5 text-[13px] font-medium"><span className="ms text-lg">visibility_off</span>Draft — hidden from the site</div>
      )}
      <div className={'flex flex-col overflow-hidden rounded-[28px] border ' + pv.tone}>
        {pv.cover && (
          <div className="stripes flex h-40 items-center justify-center bg-primary-container bg-cover bg-center font-mono text-xs text-on-primary-container" style={pv.img ? { backgroundImage: `url(${pv.img})` } : undefined}>
            {!pv.img && 'no image yet'}
          </div>
        )}
        <div className="flex flex-col gap-3 p-6">
          {pv.icon && <span className="ms text-[32px]">{pv.icon}</span>}
          {pv.kicker && <span className="kicker">{pv.kicker}</span>}
          {pv.title && <span className="h-title leading-[1.15] text-balance" style={{ fontSize: pv.titleSize }}>{pv.title}</span>}
          {pv.body && <span className="whitespace-pre-line text-pretty">{pv.body}</span>}
          {pv.meta && <span className="text-sm opacity-85">{pv.meta}</span>}
          {pv.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">{pv.tags.map((t) => <span key={t} className="flex h-[26px] items-center rounded-lg border border-current px-2.5 text-xs font-medium">{t}</span>)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function msg(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e);
  if (/auth\/(invalid-credential|wrong-password|user-not-found|invalid-email)/.test(m)) return 'Wrong email or password.';
  if (/auth\/operation-not-allowed/.test(m)) return 'Email/Password sign-in is turned off. Enable it in Firebase → Authentication → Sign-in method.';
  if (/auth\/too-many-requests/.test(m)) return 'Too many attempts. Wait a minute and try again.';
  if (/firestore-timeout|offline|unavailable/i.test(m))
    return 'Signed in, but Firestore didn’t respond. Create the Firestore database in the Firebase console (Databases and storage → Firestore).';
  if (/permission|insufficient/i.test(m))
    return 'Signed in, but the Firestore rules don’t allow this account yet. Put your User UID in the rules and publish them.';
  if (/not-found|NOT_FOUND|database .* does not exist/i.test(m)) return 'Signed in, but the Firestore database doesn’t exist yet. Create it in the Firebase console.';
  return m.replace(/^Firebase:\s*/, '');
}
