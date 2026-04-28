import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo, Strikethrough } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rich-content min-h-[220px] p-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="rounded-lg border border-input bg-background">
        <div className="h-[280px] animate-pulse bg-muted/50" />
      </div>
    );
  }

  const Btn = ({ onClick, active, children, label }: { onClick: () => void; active?: boolean; children: React.ReactNode; label: string }) => (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        "rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        active && "bg-primary/10 text-primary"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-1.5">
        <Btn label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold className="h-4 w-4" /></Btn>
        <Btn label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic className="h-4 w-4" /></Btn>
        <Btn label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}><Strikethrough className="h-4 w-4" /></Btn>
        <div className="mx-1 h-5 w-px bg-border" />
        <Btn label="Heading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 className="h-4 w-4" /></Btn>
        <Btn label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List className="h-4 w-4" /></Btn>
        <Btn label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered className="h-4 w-4" /></Btn>
        <Btn label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote className="h-4 w-4" /></Btn>
        <div className="ml-auto flex gap-0.5">
          <Btn label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo className="h-4 w-4" /></Btn>
          <Btn label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo className="h-4 w-4" /></Btn>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}