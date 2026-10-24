/** The "M" tile used as the site and admin logo. */
export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div className="flex flex-none items-center justify-center bg-primary font-[Inter_Tight] font-bold tracking-[-.03em] text-on-primary" style={{ width: size, height: size, borderRadius: size * 0.3, fontSize: size / 2 }}>
      M
    </div>
  );
}
