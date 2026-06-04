import {
  APPLICATION_STATUS,
  type Application,
  type ApplicationStatus,
} from "@/types/application";
import type { ApplicationLevelKey } from "../types";

/** Màu Tag Ant Design theo trạng thái — đồng bộ với các trang officer khác. */
export const STATUS_TAG_COLOR: Record<ApplicationStatus, string> = {
  draft: "default",
  submitted: "blue",
  under_review: "processing",
  approved: "success",
  rejected: "error",
  document_required: "warning",
};

/** Nhãn + màu hiển thị trạng thái trong bảng danh sách. */
export const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  draft: {
    label: APPLICATION_STATUS.draft,
    color: STATUS_TAG_COLOR.draft,
  },
  submitted: {
    label: APPLICATION_STATUS.submitted,
    color: STATUS_TAG_COLOR.submitted,
  },
  under_review: {
    label: APPLICATION_STATUS.under_review,
    color: STATUS_TAG_COLOR.under_review,
  },
  approved: {
    label: APPLICATION_STATUS.approved,
    color: STATUS_TAG_COLOR.approved,
  },
  rejected: {
    label: APPLICATION_STATUS.rejected,
    color: STATUS_TAG_COLOR.rejected,
  },
  document_required: {
    label: APPLICATION_STATUS.document_required,
    color: STATUS_TAG_COLOR.document_required,
  },
};

/** Ánh xạ mức xếp hạng sang màu Tag và nhãn tiếng Việt. */
export const LEVEL_TAG_CONFIG: Record<
  ApplicationLevelKey,
  { color: string; label: string }
> = {
  Normal: { color: "default", label: "Bình thường" },
  Good: { color: "geekblue", label: "Khá" },
  Great: { color: "green", label: "Tốt" },
  Excellent: { color: "gold", label: "Xuất sắc" },
};

const APPLICATION_STATUSES: ApplicationStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "document_required",
];

export function isApplicationStatus(s: string): s is ApplicationStatus {
  return APPLICATION_STATUSES.includes(s as ApplicationStatus);
}

/** Hồ sơ cần ưu tiên (đang xét duyệt hoặc cờ requiresReview). */
export function isEscalated(app: Application) {
  return app.status === "under_review" || app.requiresReview;
}
