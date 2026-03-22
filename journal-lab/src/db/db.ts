import Dexie, { type Table } from 'dexie';

export interface ThoughtObject {
    id?: number;
    canvasId: string; // ID of the thought in the Excalidraw element tree
    content: any; // TipTap JSON document
    snippet: string; // Plain text preview
    type: 'text' | 'voice' | 'scribble';
    notebookId?: number; // Link to a notebook
    createdAt: number;
    updatedAt: number;
    metadata?: any;
}

export interface CanvasState {
    id: string; // e.g., 'primary-journal'
    elements: any[];
    appState: any;
    files: any;
    updatedAt: number;
}

export interface Notebook {
    id?: number;
    name: string;
    icon?: string;
    color?: string;
    isDefault?: boolean;
    createdAt: number;
}

export class EmotionalJournalDB extends Dexie {
    thoughts!: Table<ThoughtObject>;
    canvas!: Table<CanvasState>;
    notebooks!: Table<Notebook>;

    constructor() {
        super('EmotionalJournalDB');
        this.version(2).stores({
            thoughts: '++id, canvasId, type, notebookId, createdAt, updatedAt',
            canvas: 'id, updatedAt',
            notebooks: '++id, name, isDefault'
        });

        // Populate default notebook if empty
        this.on('populate', () => {
            this.notebooks.add({
                name: 'General',
                icon: 'Book',
                color: '#2dd4bf',
                isDefault: true,
                createdAt: Date.now()
            });
        });
    }
}

export const db = new EmotionalJournalDB();
