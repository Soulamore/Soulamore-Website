import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, Wind } from 'lucide-react';

const DailyInsight = () => {
    // Placeholder logic for emotional weather
    const weather = useMemo(() => {
        const hours = new Date().getHours();
        return hours < 12 ? { icon: Sun, label: 'Morning Clarity', desc: 'The mind is fresh. Seize the stillness.' }
            : hours < 18 ? { icon: Cloud, label: 'Afternoon Drift', desc: 'Energy peaks and dips. flowing with it.' }
                : { icon: Wind, label: 'Evening Reflection', desc: 'Unwinding threads of the day.' };
    }, []);

    const Icon = weather.icon;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="h-full bg-soul-glass border border-soul-border rounded-3xl p-6 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-24 h-24 text-soul-teal" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-soul-teal text-xs uppercase tracking-widest font-bold">
                        <Icon className="w-4 h-4" />
                        <span>Emotional Weather</span>
                    </div>
                    <h3 className="font-heading text-xl text-starlight mb-1">{weather.label}</h3>
                    <p className="text-starlight/60 text-sm leading-relaxed">{weather.desc}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-soul-border/50 flex justify-between items-center">
                    <span className="text-[10px] text-starlight/40 uppercase tracking-wider">Pattern Detected</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-soul-peach animate-pulse" />
                </div>
            </div>
        </motion.div>
    );
};

export default DailyInsight;
