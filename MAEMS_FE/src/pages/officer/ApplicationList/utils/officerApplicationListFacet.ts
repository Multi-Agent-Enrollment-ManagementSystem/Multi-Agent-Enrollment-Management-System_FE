import type { Application, ApplicationStatus } from "@/types/application";
import { ensureUtc } from "@/utils/date";
import type { FilterDimensionAvailability } from "../types";

export function emptyFilterAvailability(): FilterDimensionAvailability {
  return {
    statuses: new Set(),
    campusIds: new Set(),
    programIds: new Set(),
    admissionTypeIds: new Set(),
    anyRequiresReview: false,
  };
}

/** Một tập hồ sơ (vd. preset đã merge) — mọi chiều lọc lấy từ cùng response. */
export function buildAvailabilityFromApps(
  apps: Application[],
): FilterDimensionAvailability {
  const out = emptyFilterAvailability();
  for (const a of apps) {
    out.statuses.add(a.status);
    out.campusIds.add(a.campusId);
    out.programIds.add(a.programId);
    out.admissionTypeIds.add(a.admissionTypeId);
    if (a.requiresReview) out.anyRequiresReview = true;
  }
  return out;
}

/**
 * Bốn lát response API (mỗi lát bỏ một chiều lọc) để option không có trong
 * tập ứng viên thì disabled.
 */
export function mergeAvailabilityFromFacetSlices(
  statusItems: Application[],
  campusItems: Application[],
  programItems: Application[],
  admissionItems: Application[],
): FilterDimensionAvailability {
  const statuses = new Set<ApplicationStatus>();
  for (const a of statusItems) statuses.add(a.status);
  const campusIds = new Set<number>();
  for (const a of campusItems) campusIds.add(a.campusId);
  const programIds = new Set<number>();
  for (const a of programItems) programIds.add(a.programId);
  const admissionTypeIds = new Set<number>();
  for (const a of admissionItems) admissionTypeIds.add(a.admissionTypeId);
  const scan = [
    ...statusItems,
    ...campusItems,
    ...programItems,
    ...admissionItems,
  ];
  const anyRequiresReview = scan.some((a) => a.requiresReview);
  return {
    statuses,
    campusIds,
    programIds,
    admissionTypeIds,
    anyRequiresReview,
  };
}

/** Option disabled khi chưa có trong response; luôn cho phép giá trị đang chọn. */
export function dimOptionDisabled(
  facetReady: boolean,
  presentInResponse: boolean,
  isCurrentlySelected: boolean,
): boolean {
  if (!facetReady) return false;
  return !presentInResponse && !isCurrentlySelected;
}

export function sortByLastUpdatedDesc(a: Application, b: Application) {
  return (
    new Date(ensureUtc(b.lastUpdated)).getTime() -
    new Date(ensureUtc(a.lastUpdated)).getTime()
  );
}

export function mergeApplicationsById(lists: Application[][]): Application[] {
  const map = new Map<number, Application>();
  for (const list of lists) {
    for (const app of list) {
      map.set(app.applicationId, app);
    }
  }
  return [...map.values()].sort(sortByLastUpdatedDesc);
}
