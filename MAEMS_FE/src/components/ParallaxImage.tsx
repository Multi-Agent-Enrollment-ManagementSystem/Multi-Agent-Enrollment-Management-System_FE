import { useEffect, useMemo, useRef } from "react";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Wrapper để control overflow/height theo layout hiện tại. */
  wrapperClassName?: string;
  /**
   * Độ mạnh parallax (tỉ lệ so với scrollY). Nên giữ nhỏ để tránh “say” và tốn hiệu năng.
   * Ví dụ: 0.12 nghĩa là cuộn 100px thì ảnh dịch 12px.
   */
  strength?: number;
  /** Giới hạn dịch chuyển tối đa (px) để ảnh không “trôi” quá nhiều. */
  maxShiftPx?: number;
  /** Tắt hiệu ứng nếu cần (vd: một số banner không muốn parallax). */
  disabled?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Ảnh hero có hiệu ứng cuộn (parallax) nhẹ.
 * - Tự tắt khi người dùng bật “Reduce motion” hoặc màn hình nhỏ (mobile) để đảm bảo mượt.
 * - Không dùng thư viện animation để giữ code tối giản và tránh tăng bundle.
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  // Mặc định “mạnh” hơn để cảm nhận rõ, nhưng vẫn clamp để tránh chóng mặt.
  strength = 0.36,
  maxShiftPx = 240,
  disabled = false,
}: ParallaxImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const shouldEnable = useMemo(() => {
    if (disabled) return false;
    if (typeof window === "undefined") return false;
    // Mobile nhỏ: ưu tiên mượt và tránh giật khi scroll.
    if (window.innerWidth < 768) return false;
    // Tôn trọng “Reduce motion”.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
      return false;
    return true;
  }, [disabled]);

  useEffect(() => {
    if (!shouldEnable) return;
    const el = imgRef.current;
    if (!el) return;

    let raf = 0;
    let latestY = window.scrollY || 0;

    const apply = () => {
      raf = 0;
      const shift = clamp(latestY * strength, -maxShiftPx, maxShiftPx);
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
  }, [maxShiftPx, shouldEnable, strength]);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        // Khi dịch chuyển, cần đảm bảo ảnh vẫn phủ kín wrapper (scale nhẹ).
        className={`block w-full h-full object-cover will-change-transform ${shouldEnable ? "scale-[1.14]" : ""} ${className}`}
      />
    </div>
  );
}

