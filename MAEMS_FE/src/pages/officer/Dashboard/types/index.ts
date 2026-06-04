import type { ReactNode } from "react";
import type { ApplicationStatus } from "@/types/application";

/** Bộ lọc khi điều hướng sang trang danh sách hồ sơ. */
export type ApplicationListFilter =
  | { kind: "all" }
  | { kind: "preset"; preset: "pending" | "need_action" }
  | { kind: "status"; status: ApplicationStatus };

export type OfficerDashboardStats = {
  total: number;
  pending: number;
  needsCheck: number;
  approved: number;
  rejected: number;
};

export type StatusChartSlice = {
  name: string;
  value: number;
  color: string;
};

export type MajorChartSlice = {
  name: string;
  total: number;
};

export type QuickStatCardConfig = {
  label: string;
  value: number;
  bg: string;
  iconColor: string;
  border: string;
  trendDotClass: string;
  icon: ReactNode;
  trend: string;
};

export type QuickAccessLinkConfig = {
  title: string;
  subtitle: string;
  filter: ApplicationListFilter;
  icon: ReactNode;
  ring: string;
  bg: string;
  hoverBg: string;
  iconBg: string;
  titleClass: string;
  subtitleClass: string;
};
