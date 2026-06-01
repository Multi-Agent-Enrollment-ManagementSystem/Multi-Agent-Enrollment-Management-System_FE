import { memo } from "react"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

/** Gạch ngang — giảm cỡ chữ */
export const MinusIcon = memo(({ className, ...props }: SvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
})

MinusIcon.displayName = "MinusIcon"
