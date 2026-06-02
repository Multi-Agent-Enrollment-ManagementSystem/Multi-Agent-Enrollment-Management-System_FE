"use client"

import { FloatingDelayGroup } from "@floating-ui/react"
import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { TextStyle, FontSize } from "@tiptap/extension-text-style"

// --- UI Primitives ---
import { Button } from "@tiptap-ui/components/tiptap-ui-primitive/button"
import { Spacer } from "@tiptap-ui/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@tiptap-ui/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@tiptap-ui/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@tiptap-ui/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@tiptap-ui/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@tiptap-ui/components/tiptap-node/code-block-node/code-block-node.scss"
import "@tiptap-ui/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@tiptap-ui/components/tiptap-node/list-node/list-node.scss"
import "@tiptap-ui/components/tiptap-node/image-node/image-node.scss"
import "@tiptap-ui/components/tiptap-node/heading-node/heading-node.scss"
import "@tiptap-ui/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@tiptap-ui/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@tiptap-ui/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@tiptap-ui/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@tiptap-ui/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@tiptap-ui/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@tiptap-ui/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@tiptap-ui/components/tiptap-ui/link-popover"
import { MarkButton } from "@tiptap-ui/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@tiptap-ui/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@tiptap-ui/components/tiptap-ui/undo-redo-button"
import { FontSizeControls } from "@tiptap-ui/components/tiptap-ui/font-size-controls"

// --- Icons ---
import { ArrowLeftIcon } from "@tiptap-ui/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@tiptap-ui/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@tiptap-ui/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@tiptap-ui/hooks/use-is-breakpoint"
import { useWindowSize } from "@tiptap-ui/hooks/use-window-size"
import { useCursorVisibility } from "@tiptap-ui/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@tiptap-ui/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@tiptap-ui/lib/tiptap-utils"

// --- Styles ---
import "@tiptap-ui/components/tiptap-templates/simple/simple-editor.scss"

import content from "@tiptap-ui/components/tiptap-templates/simple/data/content.json"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" tooltip="Hoàn tác" />
        <UndoRedoButton action="redo" tooltip="Làm lại" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu
          modal={false}
          levels={[1, 2, 3, 4]}
          tooltip="Tiêu đề"
        />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
          tooltip="Danh sách"
        />
        <BlockquoteButton tooltip="Trích dẫn" />
        <CodeBlockButton tooltip="Khối mã" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" tooltip="In đậm" />
        <MarkButton type="italic" tooltip="In nghiêng" />
        <MarkButton type="strike" tooltip="Gạch ngang" />
        <MarkButton type="code" tooltip="Mã nội dòng" />
        <MarkButton type="underline" tooltip="Gạch chân" />
        <FontSizeControls />
        {!isMobile ? (
          <ColorHighlightPopover tooltip="Tô màu nền" />
        ) : (
          <ColorHighlightPopoverButton
            onClick={onHighlighterClick}
            tooltip="Tô màu nền"
          />
        )}
        {!isMobile ? (
          <LinkPopover tooltip="Chèn liên kết" />
        ) : (
          <LinkButton onClick={onLinkClick} tooltip="Chèn liên kết" />
        )}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" tooltip="Chỉ số trên" />
        <MarkButton type="subscript" tooltip="Chỉ số dưới" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" tooltip="Căn trái" />
        <TextAlignButton align="center" tooltip="Căn giữa" />
        <TextAlignButton align="right" tooltip="Căn phải" />
        <TextAlignButton align="justify" tooltip="Căn đều" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Thêm ảnh" tooltip="Chèn ảnh" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export type SimpleEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  embedded?: boolean;
};

export function SimpleEditor({
  value,
  onChange,
  editable = true,
  embedded = false,
}: SimpleEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const toolbarRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      FontSize,
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: value ?? content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  useEffect(() => {
    if (!editor) return
    if (value == null) return
    const current = editor.getHTML()
    if (current === value) return
    editor.commands.setContent(value)
  }, [editor, value])

  return (
    <FloatingDelayGroup delay={{ open: 400, close: 80 }} timeoutMs={250}>
    <div
      className={`simple-editor-wrapper ${embedded ? "simple-editor-wrapper--embedded" : ""}`}
    >
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
    </FloatingDelayGroup>
  )
}
