import React, { useState } from 'react';
import { Book, Plus, Clock, Save, Bot } from 'lucide-react';
import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../db/db';
import InnerVoice from '../editor/InnerVoice';

interface DashboardProps {
    view: string;
    onOpenNote: (id: number) => void;
    onCreateNote: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ view, onOpenNote: _onOpenNote, onCreateNote }) => {
    // 1. Data Fetching
    const entries = useLiveQuery(async () => {
        return await db.thoughts.orderBy('updatedAt').reverse().toArray();
    }, [view]);

    // 2. Selection State
    const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
    const activeNote = useLiveQuery(
        () => (activeNoteId ? db.thoughts.get(activeNoteId) : Promise.resolve(undefined)),
        [activeNoteId]
    ) as import('../../db/db').ThoughtObject | undefined;

    const handleNoteClick = (id: number) => {
        setActiveNoteId(id);
    };

    const handleSave = async (content: any) => {
        if (activeNoteId && activeNote) {
            await db.thoughts.update(activeNoteId, {
                content,
                updatedAt: Date.now()
            });
        }
    };

    // Default notebook/title for Header
    const pageTitle = view === 'home' ? 'Home' : view === 'notes' ? 'All Notes' : 'Notebook';

    return (
        <main className="flex-1 h-screen relative overflow-hidden flex flex-col bg-[#0f1623]">
            {/* Header Area */}
            <header className="flex-shrink-0 px-8 py-6 flex items-center justify-between border-b border-[#ffffff0d]">
                <div className="flex items-center gap-4">
                    <h1 className="font-heading font-bold text-xl text-starlight">{pageTitle}</h1>
                    <div className="text-sm opacity-40 px-3 py-1 bg-white/5 rounded-full">
                        {entries?.length || 0} notes
                    </div>
                </div>
            </header>

            {/* Split Content Area */}
            <div className="flex-1 overflow-hidden p-6">
                <div className="h-full grid grid-cols-[300px_1fr] gap-0 border border-[#ffffff0d] rounded-2xl bg-[#131B2E] overflow-hidden shadow-2xl">

                    {/* LEFT COLUMN: Sidebar List */}
                    <div className="flex flex-col border-r border-[#ffffff0d] bg-[#111827]/50">
                        {/* List Header */}
                        <div className="p-4 border-b border-[#ffffff0d] flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider opacity-50">Recent</span>
                            <button onClick={onCreateNote} className="text-teal-DEFAULT hover:text-white transition-colors" title="New Note">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Validated Entry List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {!entries ? (
                                <div className="p-8 text-center opacity-30 text-xs text-starlight/30">Loading...</div>
                            ) : entries.length === 0 ? (
                                <div className="p-8 text-center opacity-30 text-xs text-starlight/30">
                                    No entries yet.<br />
                                    <button onClick={onCreateNote} className="text-teal-400 hover:underline mt-2">Create one?</button>
                                </div>
                            ) : (
                                entries.map(entry => (
                                    <div
                                        key={entry.id}
                                        onClick={() => handleNoteClick(entry.id!)}
                                        className={`p-4 cursor-pointer transition-all border-b border-[#ffffff05] group ${activeNoteId === entry.id ? 'bg-white/5 border-l-2 border-l-teal-DEFAULT' : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'}`}
                                    >
                                        <div className={`font-bold text-sm mb-1 line-clamp-1 ${activeNoteId === entry.id ? 'text-white' : 'text-starlight/80'}`}>
                                            {entry.metadata?.title || 'Untitled Note'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] opacity-40">
                                            <span>{new Date(entry.updatedAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span className="line-clamp-1">{entry.snippet || "No preview"}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Editor Pane */}
                    <div className="flex flex-col relative bg-[#131B2E]">
                        {activeNote ? (
                            <div className="flex flex-col h-full">
                                {/* Editor Header */}
                                <div className="p-6 pb-2">
                                    <input
                                        type="text"
                                        defaultValue={activeNote.metadata?.title}
                                        onChange={(e) => db.thoughts.update(activeNoteId!, { 'metadata.title': e.target.value })}
                                        className="bg-transparent border-none text-3xl font-heading font-bold text-starlight focus:outline-none w-full placeholder:opacity-30"
                                        placeholder="Untitled"
                                    />
                                    <div className="flex items-center gap-3 mt-2 text-xs opacity-40">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Last edited {new Date(activeNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-teal-DEFAULT/70">
                                            <Save className="w-3 h-3" />
                                            <span>Saved</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actual Editor Integration */}
                                <div className="flex-1 relative overflow-hidden px-2">
                                    <InnerVoice
                                        key={activeNoteId} /* Force re-mount on ID change */
                                        initialContent={activeNote.content}
                                        onSave={handleSave}
                                        onExpand={() => { }}
                                        isExpanded={false}
                                    />
                                </div>
                            </div>
                        ) : (
                            /* Empty State for Right Pane */
                            <div className="flex-1 flex flex-col items-center justify-center opacity-20 text-starlight">
                                <Book className="w-16 h-16 mb-4" />
                                <div className="text-lg font-heading">Select a note to view</div>
                                <button onClick={onCreateNote} className="text-sm font-body mt-2 hover:text-teal-400 cursor-pointer underline decoration-teal-400/30 underline-offset-4">or create a new one</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* SoulBot FAB - Standard Teal Design */}
            <button
                onClick={() => window.location.href = '../tools/soulbot.html'}
                className="fixed bottom-8 right-8 w-[60px] h-[60px] bg-[#4ECDC4] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#0f172a] transition-all duration-300 hover:scale-110 hover:rotate-[10deg] hover:shadow-[0_15px_40px_rgba(78,205,196,0.4)] border-2 border-white/20 z-50 group"
            >
                <span className="sr-only">Open SoulBot</span>
                <Bot className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
            </button>
        </main>
    );
};

export default Dashboard;
