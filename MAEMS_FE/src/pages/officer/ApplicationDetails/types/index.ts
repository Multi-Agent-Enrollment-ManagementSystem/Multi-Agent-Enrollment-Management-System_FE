import {
  APPLICATION_STATUS,
  type ApplicationStatus,
} from "../../../../types/application";
import type { DocumentStatus } from "../../../../types/enums";

/** Màu Tag Ant Design theo trạng thái hồ sơ — dùng thống nhất trên trang chi tiết */
export const STATUS_TAG_COLOR: Record<ApplicationStatus, string> = {
  draft: "default",
  submitted: "blue",
  under_review: "processing",
  approved: "success",
  rejected: "error",
  document_required: "warning",
};

/** Nhãn + màu hiển thị trạng thái hồ sơ cho cán bộ */
export const STATUS_CFG: Record<
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

/** Cấu hình badge xác minh tài liệu */
export const DOCUMENT_VERIFICATION: Record<
  DocumentStatus,
  { text: string; status: "success" | "warning" | "error" }
> = {
  pending: { text: "Chờ xác minh", status: "warning" },
  verified: { text: "Đã xác minh", status: "success" },
  rejected: { text: "Không hợp lệ", status: "error" },
};
