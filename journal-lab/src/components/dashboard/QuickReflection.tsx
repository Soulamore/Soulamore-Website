import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../db/db';

interface QuickReflectionProps {
    onComplete: () => void;
}

const QuickReflection: React.FC<QuickReflectionProps> = ({ onComplete }) => {
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Auto-save logic debouncer could go here
    // For MVP, we save on blur or specific action

    const handleSave = async () => {
        if (!content.trim()) return;

        setIsSaving(true);
        try {
            await db.thoughts.add({
                content: content,
                type: 'text',
                snippet: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
                createdAt: Date.now(),
                updatedAt: Date.now(),
                metadata: { title: 'Quick Reflection' },
                canvasId: 'quick-' + Date.now()
            });
            setContent('');
            onComplete(); // Refresh parent or notify
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl mx-auto mb-16 relative"
        >
            <div className="absolute inset-0 bg-soul-teal/5 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative bg-soul-glass border border-soul-border rounded-3xl p-8 backdrop-blur-xl shadow-2xl overflow-hidden group focus-within:border-soul-teal/30 focus-within:shadow-[0_0_40px_rgba(78,205,196,0.1)] transition-all duration-500">

                {/* Header Prompt */}
                <h2 className="text-soul-peach font-heading text-lg mb-6 font-medium tracking-wide opacity-80">
                    What is asking to be heard right now?
                </h2>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={handleSave} // Auto-save on blur for now
                    placeholder="Let it land here..."
                    className="w-full bg-transparent border-none text-starlight text-xl leading-relaxed resize-none focus:ring-0 focus:outline-none min-h-[120px] placeholder:text-starlight/20 font-body placeholder:font-light"
                />

                {/* Status Indicator */}
                <div className="flex justify-between items-center mt-4">
                    <div className={`text-xs font-mono tracking-widest uppercase transition-colors ${isSaving ? 'text-soul-teal animate-pulse' : 'text-starlight/20'}`}>
                        {isSaving ? 'Saving...' : 'Private & Local'}
                    </div>
                    {content.length > 0 && (
                        <button
                            onClick={handleSave}
                            className="text-xs text-soul-teal hover:text-white uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity"
                        >
                            Save Entry
                        </button>
                    )}
                </div>

            </div>
        </motion.div>
    );
};

export default QuickReflection;
