import type { ApplicationStatus } from "@/types/application";
import type { SortOrder } from "antd/es/table/interface";

/** Giá trị bộ lọc trạng thái — bao gồm "all" để hiển thị mọi đơn. */
export type StatusFilterValue = ApplicationStatus | "all";

/** Cột cho phép sắp xếp trên bảng desktop. */
export type ApplicationListSortField =
  | "submittedAt"
  | "lastUpdated"
  | "applicationId";

export type ApplicationListSortState = {
  field: ApplicationListSortField;
  order: Exclude<SortOrder, null>;
};

/** State modal QR thanh toán khi nộp đơn thành công và backend trả mã QR. */
export type QrModalState = {
  url: string;
  transactionId: string;
  amount: number | null;
  programName: string;
};

/** Payload thanh toán từ API — có thể rỗng khi đơn đã thanh toán trước đó. */
export type PaymentQrPayload = {
  url?: string;
  transactionId?: string;
};
