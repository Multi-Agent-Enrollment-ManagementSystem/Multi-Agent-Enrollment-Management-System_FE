"use client"

import { forwardRef, useCallback } from "react"

import { FontSizeAaIcon } from "@tiptap-ui/components/tiptap-icons/font-size-aa-icon"
import { MinusIcon } from "@tiptap-ui/components/tiptap-icons/minus-icon"
import { PlusIcon } from "@tiptap-ui/components/tiptap-icons/plus-icon"
import { useTiptapEditor } from "@tiptap-ui/hooks/use-tiptap-editor"
import type { ButtonProps } from "@tiptap-ui/components/tiptap-ui-primitive/button"
import { Button } from "@tiptap-ui/components/tiptap-ui-primitive/button"
import {
  type FontSizeDirection,
  type UseFontSizeConfig,
  useFontSize,
} from "@tiptap-ui/components/tiptap-ui/font-size-controls/use-font-size"

export interface FontSizeControlsProps
  extends Omit<ButtonProps, "type">,
    UseFontSizeConfig {}

/**
 * Cỡ chữ: − | Aa 16 | + (Aa và số đứng cạnh nhau, không tách A … 16 … a).
 */
export const FontSizeControls = forwardRef<HTMLDivElement, FontSizeControlsProps>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onChanged,
      className,
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const {
      isVisible,
      canChange,
      currentSize,
      changeSize,
      canIncrease,
      canDecrease,
    } = useFontSize({ editor, hideWhenUnavailable, onChanged })

    const handleClick = useCallback(
      (direction: FontSizeDirection) =>
        (event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault()
          changeSize(direction)
        },
      [changeSize]
    )

    if (!isVisible) return null

    const sizeLabel = currentSize.replace("px", "")

    return (
      <div
        ref={ref}
        className={["tiptap-font-size-controls", className].filter(Boolean).join(" ")}
        role="group"
        aria-label="Cỡ chữ"
      >
        <Button
          type="button"
          variant="ghost"
          disabled={!canChange || !canDecrease}
          data-disabled={!canChange || !canDecrease}
          aria-label="Giảm cỡ chữ"
          tooltip="Giảm cỡ chữ"
          onClick={handleClick("down")}
        >
          <MinusIcon className="tiptap-button-icon" />
        </Button>

        {/* Cụm Aa + số — đọc theo thứ tự "A a 16" */}
        <div className="tiptap-font-size-controls__preview" aria-hidden>
          <FontSizeAaIcon className="tiptap-font-size-controls__aa" />
          <span
            className="tiptap-font-size-controls__label"
            aria-live="polite"
            title="Cỡ chữ hiện tại"
          >
            {sizeLabel}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          disabled={!canChange || !canIncrease}
          data-disabled={!canChange || !canIncrease}
          aria-label="Tăng cỡ chữ"
          tooltip="Tăng cỡ chữ"
          onClick={handleClick("up")}
        >
          <PlusIcon className="tiptap-button-icon" />
        </Button>
      </div>
    )
  }
)

FontSizeControls.displayName = "FontSizeControls"

export default FontSizeControls
