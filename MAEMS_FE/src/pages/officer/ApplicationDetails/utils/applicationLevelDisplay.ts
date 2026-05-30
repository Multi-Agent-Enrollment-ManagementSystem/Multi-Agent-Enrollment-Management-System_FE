import type { ApplicationLevel } from "../../../../types/enums";

/** Nhãn tiếng Việt cho từng mức xếp hạng hồ sơ (trang chi tiết cán bộ) */
export const APPLICATION_LEVEL_LABEL: Record<
  NonNullable<ApplicationLevel>,
  string
> = {
  Normal: "Bình thường",
  Good: "Khá",
  Great: "Tốt",
  Excellent: "Xuất sắc",
};

/** Màu Tag Ant Design theo mức xếp hạng */
export const APPLICATION_LEVEL_TAG_COLOR: Record<
  NonNullable<ApplicationLevel>,
  string
> = {
  Normal: "default",
  Good: "geekblue",
  Great: "green",
  Excellent: "gold",
};

/** Hiển thị nhãn xếp hạng; null/undefined → gạch ngang */
export function formatApplicationLevel(
  level: ApplicationLevel | null | undefined,
): string {
  if (!level) return "—";
  return APPLICATION_LEVEL_LABEL[level] ?? level;
}
