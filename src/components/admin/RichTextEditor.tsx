'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useEffect } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-stone max-w-none min-h-[180px] px-4 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
  })

  // Keep editor in sync if the value is replaced externally (e.g. switching villa).
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="rounded-xl border border-stone-300 bg-white overflow-hidden focus-within:border-villa-green">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) =>
    `px-2.5 py-1 rounded text-sm font-medium transition ${
      active ? 'bg-villa-green text-white' : 'text-stone-600 hover:bg-stone-100'
    }`

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-stone-200 bg-stone-50 px-2 py-1.5">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Bold">
        <strong>B</strong>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Italic">
        <em>I</em>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))} title="Underline">
        <span className="underline">U</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))} title="Strikethrough">
        <span className="line-through">S</span>
      </button>

      <span className="mx-1 h-5 w-px bg-stone-300" />

      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="Heading">
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="Subheading">
        H3
      </button>
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={btn(editor.isActive('paragraph'))} title="Paragraph">
        ¶
      </button>

      <span className="mx-1 h-5 w-px bg-stone-300" />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Bullet list">
        • List
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Numbered list">
        1. List
      </button>

      <span className="mx-1 h-5 w-px bg-stone-300" />

      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)} title="Undo">
        ↶
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)} title="Redo">
        ↷
      </button>
    </div>
  )
}
