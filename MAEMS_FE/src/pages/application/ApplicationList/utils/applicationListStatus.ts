import {
  APPLICATION_STATUS,
  type ApplicationStatus,
} from "@/types/application";

/** Thứ tự hiển thị trạng thái trong filter (chỉ render các mục đang có trong danh sách). */
export const STATUS_FILTER_ORDER: ApplicationStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "document_required",
];

/** Kiểm tra chuỗi có phải ApplicationStatus hợp lệ không — dùng khi build option filter. */
export function isApplicationStatus(s: string): s is ApplicationStatus {
  return (STATUS_FILTER_ORDER as readonly string[]).includes(s);
}

const STATUS_TAG_COLOR: Record<ApplicationStatus, string> = {
  draft: "default",
  submitted: "blue",
  under_review: "processing",
  approved: "success",
  rejected: "error",
  document_required: "warning",
};

/** Nhãn và màu Tag Ant Design theo từng trạng thái đơn. */
export const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  draft: { label: APPLICATION_STATUS.draft, color: STATUS_TAG_COLOR.draft },
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
