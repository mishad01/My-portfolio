import { useEffect, useRef, useState } from 'react';

interface Frame { id: string; label: string; src: string; w: number; h: number; radius: number; fixed?: boolean }

const D = { w: 1280, h: 900, radius: 24 };
const A = { w: 1280, h: 860, radius: 24, fixed: true };

const rows = (classId: string): Frame[][] => [
  [
    { id: '1a', label: 'Desktop · English · light', src: '/?theme=light', ...D },
    { id: '1b', label: 'Desktop · English · dark', src: '/?theme=dark', ...D },
    { id: '1c', label: 'Mobile · 390px', src: '/?theme=light', w: 390, h: 844, radius: 40 },
    { id: '2a', label: 'Classes page · tap a class card →', src: '/teaching/?theme=light', ...D },
    { id: '2b', label: 'Class detail page', src: `/teaching/${classId}/?theme=light`, ...D },
    { id: '3a', label: 'Experience page · Load more', src: '/experience/?theme=light', ...D },
    { id: '3b', label: 'Projects page · Load more', src: '/projects/?theme=light', ...D },
    { id: '3c', label: 'Research page · Load more', src: '/research/?theme=light', ...D },
    { id: '4a', label: 'Admin · Login', src: '/admin/?demo=1&screen=login', ...A },
    { id: '4b', label: 'Admin · Dashboard', src: '/admin/?demo=1&screen=dashboard&changed=1', ...A },
    { id: '4c', label: 'Admin · List (drag to reorder, draft / publish)', src: '/admin/?demo=1&screen=list&sec=experience', ...A },
    { id: '4d', label: 'Admin · Edit + live preview + image upload', src: '/admin/?demo=1&screen=edit&sec=projects&id=edubridge', ...A },
    { id: '4e', label: 'Admin · Edit on page (click any text)', src: '/admin/?demo=1&screen=inline&changed=1', ...A },
  ],
  [
    { id: '1d', label: 'Bangla · /bn/', src: '/bn/?theme=light', w: 1000, h: 844, radius: 24 },
    { id: '1e', label: 'German · /de/', src: '/de/?theme=light', w: 1000, h: 844, radius: 24 },
  ],
];

const clamp = (z: number) => Math.min(2, Math.max(0.05, z));

export default function Canvas({ classId }: { classId: string }) {
  const [view, setView] = useState({ x: 40, y: 40, z: 0.3 });
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [panning, setPanning] = useState(false);
  const [space, setSpace] = useState(false);
  const frames = useRef<Record<string, HTMLIFrameElement | null>>({});
  const viewRef = useRef(view);
  viewRef.current = view;

  const zoomAt = (factor: number, cx: number, cy: number) =>
    setView((v) => {
      const z = clamp(v.z * factor);
      return { z, x: cx - ((cx - v.x) * z) / v.z, y: cy - ((cy - v.y) * z) / v.z };
    });
  const wheel = (dx: number, dy: number, ctrl: boolean, cx: number, cy: number) => {
    if (ctrl) zoomAt(Math.exp(-dy * 0.01), cx, cy);
    else setView((v) => ({ ...v, x: v.x - dx, y: v.y - dy }));
  };

  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
    document.body.style.overflow = 'hidden';
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== location.origin || !e.data) return;
      const entry = Object.entries(frames.current).find(([, f]) => f?.contentWindow === e.source);
      if (!entry) return;
      const [id, el] = entry;
      if (e.data.pfHeight) setHeights((h) => (h[id] === e.data.pfHeight ? h : { ...h, [id]: e.data.pfHeight }));
      if (e.data.pfWheel && el) {
        const r = el.getBoundingClientRect(), z = viewRef.current.z, w = e.data.pfWheel;
        wheel(w.dx, w.dy, w.ctrl, r.left + w.x * z, r.top + w.y * z);
      }
    };
    const onWheel = (e: WheelEvent) => { e.preventDefault(); wheel(e.deltaX, e.deltaY, e.ctrlKey || e.metaKey, e.clientX, e.clientY); };
    const kd = (e: KeyboardEvent) => { if (e.code === 'Space' && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); setSpace(true); } };
    const ku = (e: KeyboardEvent) => { if (e.code === 'Space') setSpace(false); };
    window.addEventListener('message', onMsg);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('message', onMsg);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, []);

  const startPan = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    const sx = e.clientX, sy = e.clientY, v0 = viewRef.current;
    setPanning(true);
    const move = (m: PointerEvent) => setView({ ...v0, x: v0.x + m.clientX - sx, y: v0.y + m.clientY - sy });
    const up = () => { setPanning(false); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const btn = 'flex h-10 min-w-10 items-center justify-center rounded-full border-0 bg-transparent px-2 text-sm font-medium text-[#161D1D] hover:bg-[#DDE4E3]';
  const centre = () => [innerWidth / 2, innerHeight / 2] as const;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#E8EFEE] font-body" style={{ cursor: panning ? 'grabbing' : space ? 'grab' : 'default' }} onPointerDown={(e) => { if (e.target === e.currentTarget || space) startPan(e); }}>
      <div
        className="absolute top-0 left-0 box-border flex origin-top-left flex-col gap-14 p-20"
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})`, width: 16400 }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) startPan(e); }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="m-0 h-display text-5xl leading-[52px] text-[#161D1D]">Mishad — Portfolio · Material 3</h1>
          <p className="m-0 text-lg text-[#3F4948]">Every frame is the live site — scroll inside it, switch language, filter projects, open the lightbox. Pan and zoom the canvas to compare.</p>
        </div>
        {rows(classId).map((row, i) => (
          <div key={i} className="flex items-start gap-16" onPointerDown={(e) => { if (e.target === e.currentTarget) startPan(e); }}>
            {row.map((f) => (
              <div key={f.id} id={f.id} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 items-center rounded-[14px] bg-[#006A6A] px-3 text-sm font-semibold text-white">{f.id}</span>
                  <span className="text-lg font-medium text-[#161D1D]">{f.label}</span>
                </div>
                <iframe
                  ref={(el) => { frames.current[f.id] = el; }}
                  src={f.src}
                  title={f.label}
                  loading="lazy"
                  className="border border-solid border-[#BEC9C8] bg-white"
                  style={{ width: f.w, height: f.fixed ? f.h : heights[f.id] || f.h, borderRadius: f.radius, pointerEvents: space || panning ? 'none' : 'auto' }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="fixed right-4 bottom-4 flex items-center gap-1 rounded-[28px] bg-[#F4FAF9] p-1 shadow-[0_2px_8px_rgba(0,0,0,.2)]">
        <button type="button" aria-label="Zoom out" className={btn} onClick={() => zoomAt(1 / 1.25, ...centre())}><span className="ms">remove</span></button>
        <button type="button" aria-label="Reset zoom" className={btn + ' w-16'} onClick={() => setView({ x: 40, y: 40, z: 1 })}>{Math.round(view.z * 100)}%</button>
        <button type="button" aria-label="Zoom in" className={btn} onClick={() => zoomAt(1.25, ...centre())}><span className="ms">add</span></button>
        <button type="button" aria-label="Fit" className={btn} onClick={() => setView({ x: 40, y: 40, z: 0.3 })}><span className="ms">fit_screen</span></button>
      </div>
      <div className="fixed bottom-4 left-4 rounded-xl bg-[#F4FAF9]/90 px-3 py-2 text-xs text-[#3F4948]">Scroll to pan · Ctrl/⌘ + scroll to zoom · hold Space and drag to move</div>
    </div>
  );
}
