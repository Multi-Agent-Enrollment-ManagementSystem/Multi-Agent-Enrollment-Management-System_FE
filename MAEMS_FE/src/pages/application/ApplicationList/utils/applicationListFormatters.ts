import { ensureUtc } from "@/utils/date";

/** Thời gian hiệu lực mã QR thanh toán (giây). */
export const QR_TIMEOUT_SEC = 5 * 60;

/** Định dạng ngày ISO sang locale vi-VN; backend có thể thiếu 'Z' nên dùng ensureUtc. */
export function formatApplicationDate(iso: string) {
  if (!iso) return "—";
  return new Date(ensureUtc(iso)).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Hiển thị thời gian tương đối (vừa xong, X giờ/ngày trước) cho cột cập nhật. */
export function relativeApplicationTime(iso: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(ensureUtc(iso)).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (h < 1) return "vừa xong";
  if (h < 24) return `${h} giờ trước`;
  if (d < 30) return `${d} ngày trước`;
  return formatApplicationDate(iso);
}

/** Định dạng số tiền VND cho modal thanh toán QR. */
export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}
