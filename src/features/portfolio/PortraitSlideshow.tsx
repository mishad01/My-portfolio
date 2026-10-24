import { useEffect, useRef, useState } from 'react';

const INTERVAL_MS = 5000;

/** Hero photo with 2+ images: auto-advances on a timer, and on tap. */
export default function PortraitSlideshow({ images, className }: { images: { src: string; alt: string }[]; className: string }) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const restart = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIndex((i) => (i + 1) % images.length), INTERVAL_MS);
  };

  useEffect(() => {
    restart();
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  const next = () => {
    setIndex((i) => (i + 1) % images.length);
    restart();
  };

  return (
    <button type="button" onClick={next} aria-label="Next photo" className={className + ' relative cursor-pointer overflow-hidden border-0 bg-transparent p-0'}>
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={'absolute inset-0 h-full w-full object-cover transition-opacity duration-700' + (i === index ? ' opacity-100' : ' opacity-0')}
        />
      ))}
    </button>
  );
}
