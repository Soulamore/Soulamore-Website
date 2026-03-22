import { useEffect, useRef } from 'react';
import { db } from '../db/db';

export function usePersistence(canvasId: string, elements: any[], appState: any, files: any) {
    const timerRef = useRef<any>(null);

    useEffect(() => {
        // Ghost-style debounced autosave
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            if (elements.length > 0) {
                db.canvas.put({
                    id: canvasId,
                    elements,
                    appState: {
                        ...appState,
                        collaborators: [] // Ensure privacy
                    },
                    files,
                    updatedAt: Date.now()
                });
            }
        }, 1000); // 1s debounce

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [canvasId, elements, appState, files]);
}
