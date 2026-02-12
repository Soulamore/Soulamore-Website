import { useState, useEffect } from 'react';
import Journal from './components/layout/Journal'
import Dashboard from './components/dashboard/Dashboard'
import Atmosphere from './components/layout/Atmosphere'
import Sidebar from './components/dashboard/Sidebar'

function App() {
  const [view, setView] = useState<string>('home');
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [journalMode, setJournalMode] = useState<'grounding' | 'expansion'>('grounding');
  const [newNoteNotebookId, setNewNoteNotebookId] = useState<number | undefined>(undefined);

  // Debug Version
  useEffect(() => {
    console.log('Soulbot Journal v2.2 - Sidebar Integration Fixed');
  }, []);

  const handleNewNote = (mode: 'grounding' | 'expansion' = 'grounding') => {
    // Capture persistence of notebook context
    if (view.startsWith('notebook-')) {
      setNewNoteNotebookId(parseInt(view.split('-')[1]));
    } else {
      setNewNoteNotebookId(undefined);
    }

    setSelectedNoteId(null);
    setJournalMode(mode);
    setView('reflection');
  };

  const handleOpenNote = (id: number) => {
    setSelectedNoteId(id);
    setJournalMode('grounding');
    setView('reflection');
  };

  const handleExitToDashboard = () => {
    setView('dashboard');
    setSelectedNoteId(null);
  };

  /* 
  const handleExitJournal = () => {
    // Navigate back to main website
    window.location.href = '../index.html';
  };
  */

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-midnight text-starlight font-body flex transition-colors duration-700">
      {/* Deep Space Background Layer */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-noise" />

      <Atmosphere />

      {/* Persistent Sidebar */}
      <Sidebar
        currentView={view}
        onNavigate={(v, _id) => {
          if (v === 'new-note') {
            handleNewNote('grounding');
          } else {
            setView(v as any);
            // logic for notebook id selection could go here
          }
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 h-full overflow-hidden">
        {view === 'reflection' ? (
          <Journal
            noteId={selectedNoteId}
            initialMode={journalMode}
            onClose={handleExitToDashboard}
            defaultNotebookId={newNoteNotebookId}
          />
        ) : (
          <Dashboard
            view={view}
            onOpenNote={handleOpenNote}
            onCreateNote={() => handleNewNote('grounding')}
          />
        )}
      </main>

    </div>
  )
}

export default App
