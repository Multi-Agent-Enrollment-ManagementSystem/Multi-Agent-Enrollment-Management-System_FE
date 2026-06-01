/** Các bước cỡ chữ cố định — dùng cho nút tăng/giảm và dropdown */
export const FONT_SIZE_STEPS = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
] as const

export type FontSizeStep = (typeof FONT_SIZE_STEPS)[number]

/** Cỡ mặc định khi vùng chọn chưa có fontSize inline */
export const DEFAULT_FONT_SIZE: FontSizeStep = "16px"

/** Chuyển chuỗi px/rem sang số px để so sánh bước */
export function parseFontSizePx(value: string | null | undefined): number | null {
  if (!value) return null
  const trimmed = value.trim().toLowerCase()
  const pxMatch = trimmed.match(/^([\d.]+)px$/)
  if (pxMatch) return Number(pxMatch[1])
  const remMatch = trimmed.match(/^([\d.]+)rem$/)
  if (remMatch) return Number(remMatch[1]) * 16
  return null
}

/** Lấy bước gần nhất với giá trị px hiện tại */
export function nearestFontSizeStep(px: number): FontSizeStep {
  let closest: FontSizeStep = DEFAULT_FONT_SIZE
  let minDiff = Infinity
  for (const step of FONT_SIZE_STEPS) {
    const stepPx = parseFontSizePx(step)!
    const diff = Math.abs(stepPx - px)
    if (diff < minDiff) {
      minDiff = diff
      closest = step
    }
  }
  return closest
}

/** Cỡ chữ hiện tại của selection (hoặc mặc định nếu chưa set) */
export function resolveCurrentFontSize(
  raw: string | null | undefined
): FontSizeStep {
  const px = parseFontSizePx(raw)
  if (px == null) return DEFAULT_FONT_SIZE
  return nearestFontSizeStep(px)
}

/** Bước tiếp theo khi tăng/giảm; trả về null nếu đã ở min/max */
export function stepFontSize(
  current: FontSizeStep,
  direction: "up" | "down"
): FontSizeStep | null {
  const index = FONT_SIZE_STEPS.indexOf(current)
  if (index === -1) return null
  if (direction === "up") {
    return index < FONT_SIZE_STEPS.length - 1 ? FONT_SIZE_STEPS[index + 1] : null
  }
  return index > 0 ? FONT_SIZE_STEPS[index - 1] : null
}
