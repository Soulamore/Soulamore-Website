import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'

interface InnerVoiceProps {
    initialContent?: any;
    onSave?: (content: any) => void;
    placeholder?: string;
    onExpand?: () => void;
    isExpanded?: boolean;
}

const InnerVoice: React.FC<InnerVoiceProps> = ({
    initialContent,
    onSave,
    placeholder = "What's unfolding right now?...",
    onExpand,
    isExpanded = false
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: {},
                orderedList: {},
            }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            onSave?.(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert focus:outline-none max-w-none text-starlight/90 font-body min-h-[300px] text-lg leading-relaxed',
            },
        },
    });

    useEffect(() => {
        if (editor && initialContent) {
            // Content sync logic
        }
    }, [initialContent, editor]);

    if (!editor) return null;

    return (
        <div className="bg-navy-glass-fallback rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:border-teal-light/20 glow-teal relative group max-w-2xl mx-auto w-full">

            <div className="absolute top-6 right-6 z-20">
                {!isExpanded && (
                    <button
                        onClick={onExpand}
                        className="bg-transparent border border-teal-500/30 text-teal-fallback px-3 py-1 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-teal-500/10 cursor-pointer"
                        title="Expand to Nebula"
                        style={{ color: '#4ECDC4', borderColor: 'rgba(78, 205, 196, 0.3)' }}
                    >
                        <span className="text-xs font-mono tracking-widest uppercase">Lay this out</span>
                        <span className="text-sm">↗</span>
                    </button>
                )}
            </div>

            <EditorContent editor={editor} placeholder={placeholder} />

            <div className="mt-6 text-[10px] text-slate-400 font-mono text-center tracking-widest uppercase opacity-60">
                Autosaved • Private
            </div>
        </div>
    );
};

export default InnerVoice;
