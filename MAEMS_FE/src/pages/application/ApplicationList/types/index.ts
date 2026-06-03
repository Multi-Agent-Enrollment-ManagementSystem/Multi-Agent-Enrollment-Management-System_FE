import type { ApplicationStatus } from "@/types/application";

/** Giá trị bộ lọc trạng thái — bao gồm "all" để hiển thị mọi đơn. */
export type StatusFilterValue = ApplicationStatus | "all";

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
