/** Bảng màu cố định cho tag ngành — tránh mỗi lần render gán màu ngẫu nhiên. */
const palette = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "bg-green-50 text-green-700 border-green-200",
];

const majorColors: Record<number, string> = {};

/** Gán màu ổn định theo majorId — cùng ngành luôn cùng màu trong phiên trang. */
export function getMajorColor(majorId: number): string {
  if (!majorColors[majorId]) {
    const idx = Object.keys(majorColors).length % palette.length;
    majorColors[majorId] = palette[idx];
  }
  return majorColors[majorId];
}
