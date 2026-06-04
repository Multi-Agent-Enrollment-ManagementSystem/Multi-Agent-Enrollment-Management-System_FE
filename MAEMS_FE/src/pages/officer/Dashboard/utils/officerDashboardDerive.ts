import type { Application, ApplicationStatus } from "@/types/application";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_HEX,
} from "@/types/application";
import type {
  MajorChartSlice,
  OfficerDashboardStats,
  StatusChartSlice,
} from "../types";

/** Gom số liệu tổng quan từ toàn bộ hồ sơ đã tải. */
export function computeDashboardStats(
  applications: Application[],
): OfficerDashboardStats {
  const total = applications.length;
  const pending = applications.filter(
    (a) => a.status === "submitted" || a.status === "draft",
  ).length;
  const needsCheck = applications.filter(
    (a) => a.status === "under_review" || a.requiresReview,
  ).length;
  const approved = applications.filter((a) => a.status === "approved").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;
  return { total, pending, needsCheck, approved, rejected };
}

/** Dữ liệu biểu đồ tròn theo trạng thái hồ sơ. */
export function buildStatusChartData(
  applications: Application[],
): StatusChartSlice[] {
  const counts: Record<string, number> = {};
  for (const a of applications) {
    counts[a.status] = (counts[a.status] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([status, value]) => ({
      name:
        status in APPLICATION_STATUS
          ? APPLICATION_STATUS[status as ApplicationStatus]
          : status,
      value,
      color:
        status in APPLICATION_STATUS_HEX
          ? APPLICATION_STATUS_HEX[status as ApplicationStatus]
          : "#6366f1",
    }))
    .sort((a, b) => b.value - a.value);
}

/** Top 8 ngành có nhiều hồ sơ nhất — biểu đồ cột. */
export function buildMajorChartData(
  applications: Application[],
): MajorChartSlice[] {
  const counts: Record<string, number> = {};
  for (const a of applications) {
    counts[a.programName] = (counts[a.programName] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

/** Tối đa 5 hồ sơ ưu tiên xử lý trên dashboard. */
export function buildEscalatedList(applications: Application[]): Application[] {
  return applications
    .filter((a) => a.status === "under_review" || a.requiresReview)
    .slice(0, 5);
}
