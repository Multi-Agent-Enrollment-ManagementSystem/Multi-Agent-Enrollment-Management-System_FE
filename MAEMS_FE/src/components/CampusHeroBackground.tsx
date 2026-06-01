import { CAMPUS_HERO_BG } from "../constants/campusBackground";

type CampusHeroBackgroundProps = {
  /** Cố định theo viewport khi cuộn — phù hợp trang full-height như /auth. */
  fixed?: boolean;
  className?: string;
};

/**
 * Lớp ảnh khuôn viên + gradient + họa tiết chấm — tái sử dụng cho hero và nền trang.
 * Overlay cam/đen giúp chữ trắng trên header vẫn đọc được.
 */
export function CampusHeroBackground({
  fixed = false,
  className = "",
}: CampusHeroBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${fixed ? "fixed" : ""} ${className}`}
      aria-hidden
    >
      <img
        src={CAMPUS_HERO_BG}
        alt=""
        className="h-full w-full object-cover object-center"
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
