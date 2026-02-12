import React, { useState } from 'react';
import {
    Home,
    FileText,
    Search,
    Plus,
    CheckCircle2,
    CalendarDays,
    Book,
    Settings,
    ChevronRight,
    ChevronDown,
    Hash,
    MoreHorizontal
} from 'lucide-react';
import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../db/db';

interface SidebarProps {
    onNavigate: (view: string, id?: number) => void;
    currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView }) => {
    const [isNotebooksOpen, setIsNotebooksOpen] = useState(true);

    // Fetch Notebooks
    const notebooks = useLiveQuery(async () => {
        return await db.notebooks.toArray();
    }) || [];

    return (
        <aside className="w-[260px] flex-shrink-0 h-full bg-[#131B2E] border-r border-[#ffffff0d] flex flex-col font-body text-starlight">

            {/* 1. Header & User */}
            <div className="p-4 flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-DEFAULT flex items-center justify-center font-bold text-midnight text-xs">
                    AD
                </div>
                <div className="text-sm font-bold opacity-90 truncate flex-1">Aditya's Journal</div>
                <Settings className="w-4 h-4 opacity-40 hover:opacity-100 cursor-pointer" />
            </div>

            {/* 2. Search Bar */}
            <div className="px-4 mb-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-starlight/40 group-focus-within:text-teal-DEFAULT transition-colors" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-white/5 border border-transparent focus:border-white/10 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:bg-white/10 transition-all placeholder:text-starlight/30"
                    />
                </div>
            </div>

            {/* 3. Action Row (New Note + Quick Actions) */}
            <div className="px-4 mb-6 flex items-center gap-2">
                {/* Primary: New Note */}
                <button
                    onClick={() => onNavigate('new-note')}
                    className="flex-1 bg-teal-DEFAULT hover:bg-teal-400 text-midnight font-bold py-2 px-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/10 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Note</span>
                </button>

                {/* Secondary: Task */}
                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 text-starlight/70 hover:text-teal-DEFAULT transition-all" title="New Task">
                    <CheckCircle2 className="w-5 h-5" />
                </button>

                {/* Secondary: Calendar */}
                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 text-starlight/70 hover:text-teal-DEFAULT transition-all" title="New Event">
                    <CalendarDays className="w-5 h-5" />
                </button>
            </div>

            {/* 4. Menu Items (Scrollable) */}
            <nav className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">

                <NavItem
                    icon={<Home className="w-4 h-4" />}
                    label="Home"
                    isActive={currentView === 'home' || currentView === 'dashboard'}
                    onClick={() => onNavigate('home')}
                />

                <NavItem
                    icon={<FileText className="w-4 h-4" />}
                    label="Notes"
                    isActive={currentView === 'notes'}
                    onClick={() => onNavigate('notes')}
                />

                <NavItem
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    label="Tasks"
                    isActive={currentView === 'tasks'}
                    onClick={() => onNavigate('tasks')}
                />

                {/* Notebooks Section */}
                <div className="mt-6">
                    <div
                        className="flex items-center justify-between px-3 py-1 text-xs font-bold uppercase tracking-wider opacity-50 cursor-pointer hover:opacity-100 transition-opacity"
                        onClick={() => setIsNotebooksOpen(!isNotebooksOpen)}
                    >
                        <span>Notebooks</span>
                        {isNotebooksOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>

                    {isNotebooksOpen && (
                        <div className="mt-1 space-y-0.5">
                            {notebooks?.map(nb => (
                                <button
                                    key={nb.id}
                                    onClick={() => onNavigate('notebook', nb.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${currentView === `notebook` ? 'bg-white/10 text-white' : 'text-starlight/60 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Book className="w-3.5 h-3.5 opacity-70" />
                                    <span className="truncate flex-1 text-left">{nb.name}</span>
                                    {nb.isDefault && <span className="text-[10px] bg-white/10 px-1.5 rounded opacity-50">DEF</span>}
                                </button>
                            ))}
                            {/* Create Notebook Trigger */}
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-starlight/40 hover:text-teal-DEFAULT transition-colors mt-1">
                                <Plus className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold uppercase tracking-wide">New Notebook</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Tags Section (Placeholder) */}
                <div className="mt-6">
                    <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider opacity-50">
                        <span>Tags</span>
                    </div>
                    <div className="mt-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-starlight/60 hover:bg-white/5 hover:text-white transition-all">
                            <Hash className="w-3.5 h-3.5 opacity-70" />
                            <span>Journaling</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-starlight/60 hover:bg-white/5 hover:text-white transition-all">
                            <Hash className="w-3.5 h-3.5 opacity-70" />
                            <span>Ideas</span>
                        </button>
                    </div>
                </div>

            </nav>

            {/* 5. Footer */}
            <div className="p-4 border-t border-[#ffffff0d]">
                <button className="flex items-center gap-3 w-full text-starlight/40 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-wider">
                    <MoreHorizontal className="w-4 h-4" />
                    <span>More</span>
                </button>
            </div>
        </aside>
    );
};

// Helper
const NavItem = ({ icon, label, isActive, onClick, badge }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-teal-DEFAULT/10 text-teal-DEFAULT' : 'text-starlight/70 hover:bg-white/5 hover:text-white'}`}
    >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {badge && <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-starlight/60">{badge}</span>}
    </button>
);

export default Sidebar;
