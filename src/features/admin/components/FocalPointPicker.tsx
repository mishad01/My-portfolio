import { useRef } from 'react';
import { cx } from '@/ui';

interface Props {
  src: string;
  /** CSS object-position, "x% y%". */
  pos: string;
  onChange: (pos: string) => void;
  /** Tailwind height class, matched to the live tile so the preview is WYSIWYG. */
  h: string;
}

const parse = (pos: string): [number, number] => {
  const [x, y] = pos.split(' ').map((v) => parseFloat(v));
  return [Number.isFinite(x) ? x : 50, Number.isFinite(y) ? y : 50];
};

/** Drag a focal point on the photo to set what stays visible when the tile crops it. */
export function FocalPointPicker({ src, pos, onChange, h }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [x, y] = parse(pos);

  const setFromPoint = (clientX: number, clientY: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    const py = Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100));
    onChange(`${px.toFixed(1)}% ${py.toFixed(1)}%`);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromPoint(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    setFromPoint(e.clientX, e.clientY);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className={cx('relative w-full cursor-crosshair touch-none overflow-hidden rounded-[16px] bg-surface-highest select-none', h)}
      >
        <img src={src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: `${x}% ${y}%` }} />
        <div
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-[0_0_0_1.5px_rgba(0,0,0,.45)]"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      </div>
      <span className="text-xs text-on-surface-variant">Drag the dot to pick what stays visible when this tile crops the photo.</span>
    </div>
  );
}
