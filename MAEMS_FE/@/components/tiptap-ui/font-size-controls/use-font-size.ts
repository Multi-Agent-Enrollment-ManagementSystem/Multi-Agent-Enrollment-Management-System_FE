import { useCallback, useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"

import { useTiptapEditor } from "@tiptap-ui/hooks/use-tiptap-editor"
import { isNodeTypeSelected } from "@tiptap-ui/lib/tiptap-utils"
import {
  type FontSizeStep,
  resolveCurrentFontSize,
  stepFontSize,
} from "@tiptap-ui/lib/font-size-steps"

export type FontSizeDirection = "up" | "down"

export interface UseFontSizeConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onChanged?: (size: FontSizeStep) => void
}

function canChangeFontSize(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (isNodeTypeSelected(editor, ["image"])) return false
  return (
    typeof editor.commands.setFontSize === "function" &&
    editor.can().setFontSize("16px")
  )
}

function getSelectionFontSize(editor: Editor | null): FontSizeStep {
  if (!editor) return resolveCurrentFontSize(null)
  const raw = editor.getAttributes("textStyle").fontSize as string | undefined
  return resolveCurrentFontSize(raw)
}

export function useFontSize(config: UseFontSizeConfig = {}) {
  const { editor: providedEditor, hideWhenUnavailable = false, onChanged } =
    config

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState(true)
  const [currentSize, setCurrentSize] = useState<FontSizeStep>(
    resolveCurrentFontSize(null)
  )

  const canChange = canChangeFontSize(editor)

  useEffect(() => {
    if (!editor) return

    const sync = () => {
      setCurrentSize(getSelectionFontSize(editor))
      if (hideWhenUnavailable) {
        setIsVisible(canChangeFontSize(editor))
      }
    }

    sync()
    editor.on("selectionUpdate", sync)
    editor.on("transaction", sync)

    return () => {
      editor.off("selectionUpdate", sync)
      editor.off("transaction", sync)
    }
  }, [editor, hideWhenUnavailable])

  const changeSize = useCallback(
    (direction: FontSizeDirection) => {
      if (!editor || !canChange) return false

      const current = getSelectionFontSize(editor)
      const next = stepFontSize(current, direction)
      if (!next) return false

      const ok = editor.chain().focus().setFontSize(next).run()
      if (ok) {
        setCurrentSize(next)
        onChanged?.(next)
      }
      return ok
    },
    [editor, canChange, onChanged]
  )

  const canIncrease = stepFontSize(currentSize, "up") !== null
  const canDecrease = stepFontSize(currentSize, "down") !== null

  return {
    isVisible,
    canChange,
    currentSize,
    changeSize,
    canIncrease,
    canDecrease,
  }
}
