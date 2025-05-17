import React, { useEffect, useState } from "react"
import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { styled } from "@mui/material/styles"
import Link from "@tiptap/extension-link"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"

const StyledEditorContent = styled(EditorContent)(({ theme }) => ({
  "& .ProseMirror": {
    padding: theme.spacing(2),
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[300]
    }`,
    borderRadius: theme.shape.borderRadius,
    minHeight: "150px",
    outline: "none",
    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
    "& p.is-editor-empty:first-child::before": {
      content: "attr(data-placeholder)",
      float: "left",
      color: theme.palette.text.disabled,
      pointerEvents: "none",
      height: 0,
    },
  },
  // Basic formatting styles
  "& .ProseMirror p": {
    margin: theme.spacing(1, 0),
  },
  "& .ProseMirror h1": {
    fontSize: "1.75rem",
    fontWeight: 600,
  },
  "& .ProseMirror h2": {
    fontSize: "1.5rem",
    fontWeight: 600,
  },
  "& .ProseMirror h3": {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  "& .ProseMirror ul, & .ProseMirror ol": {
    padding: theme.spacing(0, 0, 0, 3),
  },
  "& .ProseMirror blockquote": {
    borderLeft: `4px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(0, 0, 0, 2),
    margin: theme.spacing(1, 0),
  },
  "& .ProseMirror code": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[100],
    padding: theme.spacing(0.25, 0.5),
    borderRadius: "3px",
    fontFamily: "monospace",
  },
  "& .ProseMirror .tiptap-link": {
    color: theme.palette.primary.main,
    textDecoration: "underline",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
    },
  },
}))

// Toolbar item style
interface ToolbarItemProps {
  active?: boolean
}

const ToolbarItem = styled("button")<ToolbarItemProps>(({ theme, active }) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:disabled": {
    color: theme.palette.text.disabled,
    cursor: "not-allowed",
  },
}))

// Toolbar container
const ToolbarContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[100],
}))

interface EditorToolbarProps {
  editor: Editor | null
  onOpenLinkDialog: () => void
}

// Editor toolbar component
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onOpenLinkDialog,
}) => {
  if (!editor) {
    return null
  }

  return (
    <ToolbarContainer>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBold().run()
        }}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <strong>B</strong>
      </ToolbarItem>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleItalic().run()
        }}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <em>I</em>
      </ToolbarItem>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading"
      >
        H2
      </ToolbarItem>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }}
        active={editor.isActive("heading", { level: 3 })}
        title="Subheading"
      >
        H3
      </ToolbarItem>
      <ToolbarItem
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        • List
      </ToolbarItem>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBulletList().run()
        }}
        active={editor.isActive("orderedList")}
        title="Numbered List"
      >
        1. List
      </ToolbarItem>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBlockquote().run()
        }}
        active={editor.isActive("blockquote")}
        title="Quote"
      >
        &quot;Quote&quot;
      </ToolbarItem>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().setHorizontalRule().run()
        }}
        title="Horizontal Rule"
      >
        —
      </ToolbarItem>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().undo().run()
        }}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        ↩
      </ToolbarItem>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().redo().run()
        }}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        ↪
      </ToolbarItem>
      <ToolbarItem
        type="button"
        onClick={(e) => {
          e.preventDefault()
          onOpenLinkDialog()
        }}
        active={editor.isActive("link")}
        title="Link"
      >
        🔗
      </ToolbarItem>
    </ToolbarContainer>
  )
}

interface TiptapProps {
  content?: string
  onUpdate?: (_props: { editor: Editor }) => void
  placeholder?: string
}

const Tiptap: React.FC<TiptapProps> = ({
  content = "",
  onUpdate,
  placeholder = "Start typing...",
}) => {
  const [linkUrl, setLinkUrl] = useState<string>("")
  const [linkDialogOpen, setLinkDialogOpen] = useState<boolean>(false)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "tiptap-link",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content,
    onUpdate,
  })

  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleSetLink = () => {
    if (!editor) return

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // Add https:// if not present and not using another protocol
    const url = linkUrl.trim()
    const fullUrl = /^(https?:\/\/|mailto:|tel:)/.test(url)
      ? url
      : `https://${url}`

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: fullUrl })
      .run()

    setLinkUrl("")
    setLinkDialogOpen(false)
  }
  const handleOpenLinkDialog = () => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href || ""
    setLinkUrl(previousUrl)
    setLinkDialogOpen(true)
  }

  return (
    <div>
      <EditorToolbar editor={editor} onOpenLinkDialog={handleOpenLinkDialog} />
      <StyledEditorContent editor={editor} />

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            variant="outlined"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSetLink()
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setLinkUrl("")
              editor?.chain().focus().unsetLink().run()
              setLinkDialogOpen(false)
            }}
            color="secondary"
            disabled={!editor?.isActive("link")}
          >
            Remove Link
          </Button>
          <Button onClick={handleSetLink} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Tiptap
