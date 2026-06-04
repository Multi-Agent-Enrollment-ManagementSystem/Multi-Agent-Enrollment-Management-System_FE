import type { ApplicationStatus } from "@/types/application";
import type { ApplicationLevel } from "@/types/enums";

/** Preset từ dashboard — API chỉ lọc một status/cờ, cần gộp nhiều request. */
export type DashboardListPreset = "pending" | "need_action";

/** Tập giá trị filter còn xuất hiện trong response (facet API phân trang). */
export type FilterDimensionAvailability = {
  statuses: Set<ApplicationStatus>;
  campusIds: Set<number>;
  programIds: Set<number>;
  admissionTypeIds: Set<number>;
  anyRequiresReview: boolean;
};

/** Option Select sắp xếp — map sang sortBy/sortDesc gửi API. */
export type ApplicationListSortOption =
  | "applicationId_desc"
  | "applicationId_asc"
  | "lastUpdated_desc"
  | "lastUpdated_asc";

export type ApplicationLevelKey = NonNullable<ApplicationLevel>;
