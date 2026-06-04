/** Đường dẫn trang danh sách hồ sơ officer — dùng cho link từ dashboard. */
export const OFFICER_APP_LIST_PATH = "/officer/review-applications";

export const TOTAL_CARD_TW = {
  bg: "bg-blue-50",
  iconColor: "text-blue-500",
  border: "border-blue-100",
} as const;

/** Rút gọn ghi chú dài trong bảng hồ sơ cần xử lý. */
export const TABLE_NOTE_ELLIPSIS = {
  rows: 3,
  expandable: "collapsible" as const,
  symbol: (isExpanded: boolean) => (isExpanded ? "Thu gọn" : "Xem thêm"),
};
