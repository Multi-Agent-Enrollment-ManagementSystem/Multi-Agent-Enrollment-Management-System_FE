/** Tính phần trăm làm tròn — hiển thị trên thẻ thống kê. */
export function pct(part: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}
