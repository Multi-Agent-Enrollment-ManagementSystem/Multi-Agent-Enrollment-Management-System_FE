import { Home, ChevronRight } from "lucide-react";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  PublicHeroReveal,
  PublicSectionReveal,
} from "@/components/public/PublicPageMotion";

type TuitionPageShellProps = {
  bannerSrc: string;
  bannerAlt: string;
  breadcrumbLabel: string;
  title: string;
  children: ReactNode;
};

/** Khung layout chung các trang học phí — banner, breadcrumb và animation đồng bộ. */
export function TuitionPageShell({
  bannerSrc,
  bannerAlt,
  breadcrumbLabel,
  title,
  children,
}: TuitionPageShellProps) {
  return (
    <>
      <PublicHeroReveal>
        <img
          src={bannerSrc}
          alt={bannerAlt}
          className="w-full block"
        />
      </PublicHeroReveal>

      <div className="max-w-[1200px] mx-auto px-4">
        <PublicSectionReveal delay={0.04}>
          <div className="flex items-center gap-2 py-4 text-sm">
            <Link to="/">
              <Home size={18} className="text-orange-500" fill="currentColor" />
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link to="/tuyen-sinh" className="text-orange-500 hover:underline">
              Tuyển sinh
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-600">{breadcrumbLabel}</span>
          </div>
        </PublicSectionReveal>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <PublicSectionReveal delay={0.08}>
          <h1
            className="text-3xl font-bold text-center mb-2"
            style={{ color: "#f97316" }}
          >
            {title}
          </h1>
        </PublicSectionReveal>
        <PublicSectionReveal delay={0.12}>{children}</PublicSectionReveal>
      </div>
    </>
  );
}
