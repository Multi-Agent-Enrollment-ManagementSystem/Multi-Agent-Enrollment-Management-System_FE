import { ensureUtc } from "@/utils/date";

/** Định dạng ngày ISO từ backend sang chuỗi tiếng Việt cho UI hồ sơ. */
export function formatProfileDate(iso: string) {
  return new Date(ensureUtc(iso)).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
