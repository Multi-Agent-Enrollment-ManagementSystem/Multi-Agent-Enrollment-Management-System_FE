import { memo } from "react"

import { FontSizeAaGlyphs } from "@tiptap-ui/components/tiptap-icons/font-size-aa-shared"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

/** Icon A + a (một cụm) — dùng cạnh số cỡ chữ, không tách ra hai nút */
export const FontSizeAaIcon = memo(({ className, ...props }: SvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <FontSizeAaGlyphs />
    </svg>
  )
})

FontSizeAaIcon.displayName = "FontSizeAaIcon"
