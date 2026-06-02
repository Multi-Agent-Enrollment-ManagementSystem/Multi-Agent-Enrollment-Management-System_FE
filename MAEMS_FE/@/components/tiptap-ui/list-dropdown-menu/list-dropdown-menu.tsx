import { useCallback, useState } from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@tiptap-ui/hooks/use-tiptap-editor"

// --- Icons ---
import { ChevronDownIcon } from "@tiptap-ui/components/tiptap-icons/chevron-down-icon"

// --- Tiptap UI ---
import { ListButton, type ListType } from "@tiptap-ui/components/tiptap-ui/list-button"

import { useListDropdownMenu } from "@tiptap-ui/components/tiptap-ui/list-dropdown-menu/use-list-dropdown-menu"

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

export interface ListDropdownMenuProps extends Omit<ButtonProps, "type"> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor
  /**
   * The list types to display in the dropdown.
   */
  types?: ListType[]
  /**
   * Whether the dropdown should be hidden when no list types are available
   * @default false
   */
  hideWhenUnavailable?: boolean
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

export function ListDropdownMenu({
  editor: providedEditor,
  types = ["bulletList", "orderedList", "taskList"],
  hideWhenUnavailable = false,
  onOpenChange,
  modal = true,
  tooltip = "Danh sách",
  ...props
}: ListDropdownMenuProps) {
  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = useState(false)

  const { filteredLists, canToggle, isActive, isVisible, Icon } =
    useListDropdownMenu({
      editor,
      types,
      hideWhenUnavailable,
    })

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      if (open && !canToggle) return
      setIsOpen(open)
      onOpenChange?.(open)
    },
    [canToggle, onOpenChange]
  )

  if (!isVisible) {
    return null
  }

  return (
    <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOnOpenChange}>
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
              aria-label="Chọn loại danh sách"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              showTooltip={false}
              {...props}
            >
              <Icon className="tiptap-button-icon" />
              <ChevronDownIcon className="tiptap-button-dropdown-small" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {filteredLists.map((option) => (
            <DropdownMenuItem
              key={option.type}
              asChild
              onSelect={() => setIsOpen(false)}
            >
              <ListButton
                editor={editor}
                type={option.type}
                text={option.label}
                showTooltip={false}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ListDropdownMenu
