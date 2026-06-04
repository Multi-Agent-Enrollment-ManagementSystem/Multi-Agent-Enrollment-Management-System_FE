import {
  AlertTriangle,
  Check,
  ClipboardList,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  APPLICATION_NEED_ACTION_PRESET_COMBO_LABEL,
  APPLICATION_PENDING_PRESET_COMBO_LABEL,
  APPLICATION_STATUS,
  APPLICATION_STATUS_CARD_TW,
} from "@/types/application";
import type {
  OfficerDashboardStats,
  QuickAccessLinkConfig,
  QuickStatCardConfig,
} from "../types";
import { TOTAL_CARD_TW } from "./officerDashboardConstants";
import { pct } from "./officerDashboardMath";

/** Dựng config thẻ thống kê — tách JSX ra khỏi hook .ts. */
export function buildQuickStats(
  stats: OfficerDashboardStats,
): QuickStatCardConfig[] {
  return [
    {
      label: "Tổng hồ sơ",
      value: stats.total,
      ...TOTAL_CARD_TW,
      trendDotClass: "bg-blue-500",
      icon: <Users size={20} />,
      trend: `${stats.total} hồ sơ`,
    },
    {
      label: APPLICATION_PENDING_PRESET_COMBO_LABEL,
      value: stats.pending,
      ...APPLICATION_STATUS_CARD_TW.submitted,
      trendDotClass: "bg-amber-500",
      icon: <ClipboardList size={20} />,
      trend: `${pct(stats.pending, stats.total)} tổng hồ sơ`,
    },
    {
      label: APPLICATION_NEED_ACTION_PRESET_COMBO_LABEL,
      value: stats.needsCheck,
      ...APPLICATION_STATUS_CARD_TW.under_review,
      trendDotClass: "bg-violet-600",
      icon: <AlertTriangle size={20} />,
      trend: stats.needsCheck > 0 ? "Cần xử lý gấp" : "Không có",
    },
    {
      label: APPLICATION_STATUS.approved,
      value: stats.approved,
      ...APPLICATION_STATUS_CARD_TW.approved,
      trendDotClass: "bg-emerald-500",
      icon: <Check size={20} strokeWidth={2.5} />,
      trend: `${pct(stats.approved, stats.total)} tổng hồ sơ`,
    },
    {
      label: APPLICATION_STATUS.rejected,
      value: stats.rejected,
      ...APPLICATION_STATUS_CARD_TW.rejected,
      trendDotClass: "bg-red-500",
      icon: <X size={20} strokeWidth={2.5} />,
      trend: `${pct(stats.rejected, stats.total)} tổng hồ sơ`,
    },
  ];
}

/** Dựng config shortcut truy cập nhanh — phụ thuộc loading để hiển thị subtitle. */
export function buildQuickAccessLinks(
  stats: OfficerDashboardStats,
  loading: boolean,
): QuickAccessLinkConfig[] {
  return [
    {
      title: "Tất cả hồ sơ",
      subtitle: loading ? "—" : `${stats.total} hồ sơ`,
      filter: { kind: "all" },
      icon: <Users size={18} />,
      ring: "border-blue-100",
      bg: "bg-blue-50",
      hoverBg: "hover:bg-blue-100",
      iconBg: "bg-blue-500",
      titleClass: "text-blue-700",
      subtitleClass: "text-blue-400",
    },
    {
      title: APPLICATION_PENDING_PRESET_COMBO_LABEL,
      subtitle: loading ? "—" : `${stats.pending} hồ sơ`,
      filter: { kind: "preset", preset: "pending" },
      icon: <ClipboardList size={18} />,
      ring: "border-amber-100",
      bg: "bg-amber-50",
      hoverBg: "hover:bg-amber-100",
      iconBg: "bg-amber-500",
      titleClass: "text-amber-800",
      subtitleClass: "text-amber-600",
    },
    {
      title: APPLICATION_NEED_ACTION_PRESET_COMBO_LABEL,
      subtitle: loading ? "—" : `${stats.needsCheck} hồ sơ`,
      filter: { kind: "preset", preset: "need_action" },
      icon: <Zap size={18} />,
      ring: "border-violet-100",
      bg: "bg-violet-50",
      hoverBg: "hover:bg-violet-100",
      iconBg: "bg-violet-600",
      titleClass: "text-violet-700",
      subtitleClass: "text-violet-500",
    },
    {
      title: APPLICATION_STATUS.approved,
      subtitle: loading ? "—" : `${pct(stats.approved, stats.total)} tổng`,
      filter: { kind: "status", status: "approved" },
      icon: <Check size={18} strokeWidth={2.5} />,
      ring: "border-emerald-100",
      bg: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100",
      iconBg: "bg-emerald-500",
      titleClass: "text-emerald-700",
      subtitleClass: "text-emerald-500",
    },
    {
      title: APPLICATION_STATUS.rejected,
      subtitle: loading ? "—" : `${pct(stats.rejected, stats.total)} tổng`,
      filter: { kind: "status", status: "rejected" },
      icon: <X size={18} strokeWidth={2.5} />,
      ring: "border-red-100",
      bg: "bg-red-50",
      hoverBg: "hover:bg-red-100",
      iconBg: "bg-red-500",
      titleClass: "text-red-700",
      subtitleClass: "text-red-500",
    },
  ];
}
