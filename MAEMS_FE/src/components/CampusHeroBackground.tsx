import { useEffect, useMemo, useRef } from "react";
import { CAMPUS_HERO_BG } from "@/constants/campusBackground";

type CampusHeroBackgroundProps = {
  /** Cố định theo viewport khi cuộn — phù hợp trang full-height như /auth. */
  fixed?: boolean;
  /**
   * Hiệu ứng nền cuộn (parallax) nhẹ.
   * Mặc định bật cho hero thường; tự tắt khi `fixed` hoặc khi người dùng bật “Reduce motion”.
   */
  parallax?: boolean;
  className?: string;
};

/**
 * Lớp ảnh khuôn viên + gradient + họa tiết chấm — tái sử dụng cho hero và nền trang.
 * Overlay cam/đen giúp chữ trắng trên header vẫn đọc được.
 */
export function CampusHeroBackground({
  fixed = false,
  parallax = true,
  className = "",
}: CampusHeroBackgroundProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const shouldEnableParallax = useMemo(() => {
    if (!parallax) return false;
    if (fixed) return false;
    if (typeof window === "undefined") return false;
    // Mobile nhỏ: ưu tiên mượt và tránh giật khi scroll.
    if (window.innerWidth < 768) return false;
    // Tôn trọng “Reduce motion”.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
      return false;
    return true;
  }, [fixed, parallax]);

  useEffect(() => {
    if (!shouldEnableParallax) return;
    const el = imgRef.current;
    if (!el) return;

    let raf = 0;
    let latestY = window.scrollY || 0;

    const clamp = (n: number, min: number, max: number) =>
      Math.max(min, Math.min(max, n));

    const apply = () => {
      raf = 0;
      // Parallax nhẹ: dịch chậm hơn so với scroll và có giới hạn để không gây “say”.
      const shift = clamp(latestY * 0.36, -240, 240);
      el.style.transform = `translate3d(0, ${shift}px, 0)`;
    };

    const onScroll = () => {
      latestY = window.scrollY || 0;
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    // Đặt trạng thái ban đầu để tránh “nhảy” khi user đã cuộn.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [shouldEnableParallax]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${fixed ? "fixed" : ""} ${className}`}
      aria-hidden
    >
      <img
        ref={imgRef}
        src={CAMPUS_HERO_BG}
        alt=""
        // Scale nhẹ để khi parallax dịch chuyển vẫn không lộ viền.
        className={`h-full w-full object-cover object-center will-change-transform ${shouldEnableParallax ? "scale-[1.14]" : ""}`}
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/88 via-orange-800/72 to-gray-900/88" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}
