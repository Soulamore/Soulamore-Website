import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

interface ReflectionTimelineProps {
    entries: any[];
    onOpen: (id: number) => void;
}

const ReflectionTimeline: React.FC<ReflectionTimelineProps> = ({ entries, onOpen }) => {
    if (entries.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h3 className="text-starlight/40 font-heading uppercase tracking-widest text-xs mb-8 pl-2">
                Earlier Reflections
            </h3>

            <div className="space-y-6">
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onOpen(entry.id)}
                        className="group relative pl-8 border-l border-soul-border hover:border-soul-teal/50 transition-colors cursor-pointer"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full bg-soul-midnight border border-soul-border group-hover:border-soul-teal group-hover:bg-soul-teal transition-colors" />

                        <div className="py-4 pr-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono text-starlight/40 group-hover:text-soul-teal transition-colors">
                                    {new Date(entry.updatedAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <MoreHorizontal className="w-4 h-4 text-starlight/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-starlight/80 font-body text-base line-clamp-2 leading-relaxed group-hover:text-starlight transition-colors">
                                {entry.snippet || "Untitled Reflection"}
                            </p>
                            {/* Emotional Tag Placeholder */}
                            {/* <div className="mt-3 inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-[10px] text-starlight/50 uppercase tracking-wide">
                    Neutral
                </div> */}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ReflectionTimeline;
