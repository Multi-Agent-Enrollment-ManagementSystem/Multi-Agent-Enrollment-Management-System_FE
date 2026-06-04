import {
  APPLICATION_NEED_ACTION_PRESET_COMBO_LABEL,
  APPLICATION_PENDING_PRESET_COMBO_LABEL,
  type ApplicationStatus,
} from "@/types/application";
import type { DashboardListPreset } from "../types";
import { isApplicationStatus } from "./officerApplicationListStatus";

const DASHBOARD_PRESET_HINT_SUFFIX = " (từ dashboard)";

/** Đọc query lần đầu — tránh race load API trước khi useEffect đồng bộ URL. */
export function parseListQueryState(sp: URLSearchParams): {
  dashboardPreset: DashboardListPreset | null;
  filterStatus: ApplicationStatus | "all";
} {
  const preset = sp.get("preset");
  if (preset === "pending" || preset === "need_action") {
    return { dashboardPreset: preset, filterStatus: "all" };
  }
  const st = sp.get("status");
  if (st && isApplicationStatus(st)) {
    return { dashboardPreset: null, filterStatus: st };
  }
  return { dashboardPreset: null, filterStatus: "all" };
}

export function dashboardPresetHint(
  preset: DashboardListPreset | null,
): string | null {
  if (preset === "pending")
    return `Đang lọc: ${APPLICATION_PENDING_PRESET_COMBO_LABEL}${DASHBOARD_PRESET_HINT_SUFFIX}`;
  if (preset === "need_action")
    return `Đang lọc: ${APPLICATION_NEED_ACTION_PRESET_COMBO_LABEL}${DASHBOARD_PRESET_HINT_SUFFIX}`;
  return null;
}

/** Chuẩn hoá danh sách tài liệu bắt buộc từ admission type (JSON hoặc plain text). */
export function normalizeRequiredDocumentList(raw: string | null | undefined) {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter(Boolean)
        .join(", ");
    }
  } catch {
    // Giữ nguyên text nếu không phải JSON.
  }
  return String(raw).trim();
}
