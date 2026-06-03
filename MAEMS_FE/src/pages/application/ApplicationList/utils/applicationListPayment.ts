import type { PaymentQrPayload } from "../types";

/** Lấy số tiền từ query `amount` trong URL QR (nếu backend nhúng vào link). */
export function getAmountFromPaymentUrl(url: string): number | null {
  try {
    const parsed = new URL(url);
    const raw = parsed.searchParams.get("amount");
    if (!raw) return null;
    const amount = Number(raw);
    return Number.isFinite(amount) ? amount : null;
  } catch {
    return null;
  }
}

/** Chỉ mở modal QR khi cả URL ảnh và mã giao dịch đều có giá trị — tránh object rỗng sau thanh toán cũ. */
export function hasPaymentQr(
  payload: PaymentQrPayload | null,
): payload is { url: string; transactionId: string } {
  if (!payload) return false;
  const qrUrl = payload.url?.trim();
  const transactionId = payload.transactionId?.trim();
  return Boolean(qrUrl && transactionId);
}
