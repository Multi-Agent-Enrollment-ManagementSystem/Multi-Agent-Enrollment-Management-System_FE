import { forwardRef, useCallback, useState } from "react"

// --- Icons ---
import { ChevronDownIcon } from "@tiptap-ui/components/tiptap-icons/chevron-down-icon"

// --- Hooks ---
import { useTiptapEditor } from "@tiptap-ui/hooks/use-tiptap-editor"

// --- Tiptap UI ---
import { HeadingButton } from "@tiptap-ui/components/tiptap-ui/heading-button"
import type { UseHeadingDropdownMenuConfig } from "@tiptap-ui/components/tiptap-ui/heading-dropdown-menu"
import { useHeadingDropdownMenu } from "@tiptap-ui/components/tiptap-ui/heading-dropdown-menu"

// --- UI Primitives ---
import type { ButtonProps } from "@tiptap-ui/components/tiptap-ui-primitive/button"
import { Button } from "@tiptap-ui/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@tiptap-ui/components/tiptap-ui-primitive/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tiptap-ui/components/tiptap-ui-primitive/tooltip"

export interface HeadingDropdownMenuProps
  extends Omit<ButtonProps, "type">, UseHeadingDropdownMenuConfig {
  /**
   * Callback for when the dropdown opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void
  /**
   * Whether the dropdown should use a modal
   */
  modal?: boolean
  /**
   * Nhãn tooltip khi hover nút mở menu
   */
  tooltip?: React.ReactNode
}

/**
 * Dropdown menu component for selecting heading levels in a Tiptap editor.
 *
 * For custom dropdown implementations, use the `useHeadingDropdownMenu` hook instead.
 */
export const HeadingDropdownMenu = forwardRef<
  HTMLButtonElement,
  HeadingDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
      levels = [1, 2, 3, 4, 5, 6],
      hideWhenUnavailable = false,
      onOpenChange,
      children,
      modal = true,
      tooltip = "Tiêu đề",
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { isVisible, isActive, canToggle, Icon } = useHeadingDropdownMenu({
      editor,
      levels,
      hideWhenUnavailable,
    })

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!editor) return
        // Chỉ chặn mở menu khi không thao tác được; vẫn cho phép đóng
        if (open && !canToggle) return
        setIsOpen(open)
        onOpenChange?.(open)
      },
      [canToggle, editor, onOpenChange]
    )

    if (!isVisible) {
      return null
    }

    return (
      <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOpenChange}>
        <Tooltip delay={300} useDelayGroup>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                data-active-state={isActive ? "on" : "off"}
                role="button"
                tabIndex={-1}
                disabled={!canToggle}
                data-disabled={!canToggle}
                aria-label="Chọn cấp tiêu đề"
                aria-pressed={isActive}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                showTooltip={false}
                {...buttonProps}
                ref={ref}
              >
                {children ? (
                  children
                ) : (
                  <>
                    <Icon className="tiptap-button-icon" />
                    <ChevronDownIcon className="tiptap-button-dropdown-small" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {levels.map((level) => (
              <DropdownMenuItem
                key={`heading-${level}`}
                asChild
                onSelect={() => setIsOpen(false)}
              >
                <HeadingButton
                  editor={editor}
                  level={level}
                  text={`Tiêu đề ${level}`}
                  showTooltip={false}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

HeadingDropdownMenu.displayName = "HeadingDropdownMenu"

export default HeadingDropdownMenu
