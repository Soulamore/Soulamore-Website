import React, { useState, useEffect } from 'react';
import InnerVoice from '../editor/InnerVoice';
import Nebula from '../canvas/Nebula';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { db } from '../../db/db';

interface JournalProps {
    noteId: number | null;
    initialMode?: 'grounding' | 'expansion';
    onClose: () => void;
    defaultNotebookId?: number;
}

const Journal: React.FC<JournalProps> = ({ noteId, initialMode = 'grounding', onClose, defaultNotebookId }) => {
    // Mode: 'grounding' (Text) or 'expansion' (Canvas)
    const [mode, setMode] = useState<'grounding' | 'expansion'>(initialMode);
    const [noteData, setNoteData] = useState<any>(null);

    // Load entry if noteId is provided
    useEffect(() => {
        if (noteId) {
            db.thoughts.get(noteId).then(data => {
                if (data) setNoteData(data);
            });
        } else {
            setNoteData(null); // Reset for new note
        }
    }, [noteId]);

    const handleSave = (content: any) => {
        // Logic to extract title/snippet from tip-tap JSON would go here
        const snippet = "Draft saved...";
        const title = noteData?.metadata?.title || (new Date().toLocaleTimeString());

        // Use existing notebookId OR default passed from prop
        const notebookId = noteData?.notebookId || defaultNotebookId;

        db.thoughts.put({
            ...(noteData || {}),
            content,
            snippet,
            type: 'text',
            updatedAt: Date.now(),
            createdAt: noteData?.createdAt || Date.now(),
            canvasId: noteData?.canvasId || 'journal-' + Date.now(),
            notebookId, // Save the notebook ID
            metadata: { ...noteData?.metadata, title }
        }).then(id => {
            if (!noteData) db.thoughts.get(id).then(setNoteData);
        });
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden bg-midnight">

            {/* Ambient Spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Back Button */}
            <button
                onClick={onClose}
                className="absolute top-8 left-8 z-30 flex items-center gap-2 text-starlight/40 hover:text-white transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 border border-white/10">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-[0.2em]">Dashboard</span>
            </button>

            {/* 1. Header: Date & Gentle Prompt */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center z-20 mb-10"
            >
                <h1 className="text-starlight/40 font-heading text-sm tracking-[0.2em] uppercase mb-4">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h1>
                <p className="text-starlight font-heading text-3xl md:text-4xl tracking-tight drop-shadow-2xl">
                    {noteData?.metadata?.title || "What is asking to be heard?"}
                </p>
            </motion.div>

            {/* 2. Primary Layer: InnerVoice (Text) */}
            <motion.div
                className="w-full max-w-2xl z-10"
                layoutId="editor-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
                <InnerVoice
                    initialContent={noteData?.content}
                    onSave={handleSave}
                    onExpand={() => setMode('expansion')}
                    isExpanded={mode === 'expansion'}
                />
            </motion.div>

            {/* 3. Secondary Layer: Nebula (Canvas Overlay) */}
            <AnimatePresence>
                {mode === 'expansion' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50 bg-midnight/95 backdrop-blur-xl flex items-center justify-center"
                    >
                        {/* Close / Return to Grounding */}
                        <button
                            onClick={() => setMode('grounding')}
                            className="absolute top-8 left-8 z-50 text-starlight/40 hover:text-white transition-colors flex items-center gap-3 group"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all border border-white/5">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-mono tracking-widest uppercase">Ground</span>
                        </button>

                        <Nebula canvasId={noteData?.canvasId || 'journal-' + (noteData?.createdAt || Date.now())} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Journal;
