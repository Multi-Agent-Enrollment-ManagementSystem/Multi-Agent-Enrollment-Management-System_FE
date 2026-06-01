import type { ReactNode } from "react"

/** Font sans đậm để hai chữ A hoa giống icon typography chuẩn */
export const FONT_SIZE_AA_FONT =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

/** Bố cục A + a (chữ thường) sát nhau — kiểu icon cỡ chữ chuẩn */
export const FONT_SIZE_AA_LAYOUT = {
  large: { x: 3, y: 17, size: 13 },
  small: { x: 10.5, y: 10, size: 7.5 },
} as const

type AaGlyphProps = {
  large?: { x: number; y: number; size: number }
  small?: { x: number; y: number; size: number }
}

/** Cụm A + a (một to, một nhỏ) — đứng trước số cỡ chữ trên toolbar */
export function FontSizeAaGlyphs({
  large = FONT_SIZE_AA_LAYOUT.large,
  small = FONT_SIZE_AA_LAYOUT.small,
}: AaGlyphProps): ReactNode {
  return (
    <>
      <text
        x={large.x}
        y={large.y}
        fontSize={large.size}
        fontWeight="700"
        fontFamily={FONT_SIZE_AA_FONT}
        fill="currentColor"
      >
        A
      </text>
      <text
        x={small.x}
        y={small.y}
        fontSize={small.size}
        fontWeight="600"
        fontFamily={FONT_SIZE_AA_FONT}
        fill="currentColor"
      >
        a
      </text>
    </>
  )
}
