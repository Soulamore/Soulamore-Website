import React, { useState, useCallback } from 'react';
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { db } from '../../db/db';
import { useLiveQuery } from "dexie-react-hooks";
import { usePersistence } from '../../hooks/usePersistence';

interface NebulaProps {
    canvasId: string;
}

const Nebula: React.FC<NebulaProps> = ({ canvasId }) => {
    const [elements, setElements] = useState<any[]>([]);
    const [appState, setAppState] = useState<any>({});
    const [files, setFiles] = useState<any>({});

    // Persistence Hook
    usePersistence(canvasId, elements, appState, files);

    // Load initial data
    const initialData = useLiveQuery(() => db.canvas.get(canvasId), [canvasId]);

    const onExcalidrawChange = useCallback((newElements: readonly any[], newAppState: any, newFiles: any) => {
        setElements([...newElements]);
        setAppState(newAppState);
        setFiles(newFiles);
    }, []);

    return (
        <div className="w-full h-full relative" style={{ height: "100vh" }}>
            <Excalidraw
                theme="dark"
                initialData={{
                    elements: initialData?.elements || [],
                    appState: {
                        ...initialData?.appState,
                        theme: "dark",
                        viewBackgroundColor: "#0f172a"
                    },
                }}
                onChange={onExcalidrawChange}
                UIOptions={{
                    canvasActions: {
                        changeViewBackgroundColor: false,
                        clearCanvas: true,
                        export: false,
                        loadScene: false,
                        saveToActiveFile: false,
                        toggleTheme: false,
                    },
                    dockedSidebarBreakpoint: 0,
                }}
            >
                <MainMenu>
                    <MainMenu.DefaultItems.ClearCanvas />
                    <MainMenu.DefaultItems.SaveAsImage />
                </MainMenu>
            </Excalidraw>

            {/* Empty State Overlay */}
            {elements.length === 0 && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="text-center animate-fade-in-up">
                        <h2 className="font-heading text-4xl text-starlight tracking-tight drop-shadow-lg">
                            Nebula
                        </h2>
                        <p className="font-body text-teal-light opacity-60 italic text-lg mt-3 font-light">
                            Space for your thoughts to float.
                        </p>
                    </div>
                </div>
            )}

            {/* Subtle Emotional Overlay (Fading Memory Pattern) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-midnight via-transparent to-midnight/50 opacity-30"></div>
        </div>
    );
};

export default Nebula;
