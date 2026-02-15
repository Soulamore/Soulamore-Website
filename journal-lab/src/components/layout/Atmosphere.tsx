

const Atmosphere = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Deep Space Base */}
            <div className="absolute inset-0 bg-midnight transition-colors duration-1000" />

            {/* Breathing Auroras - DISABLED for Vegito Minimalist Theme */
            /*
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-20%] left-[-10%] w-[80vh] h-[80vh] bg-teal-DEFAULT/20 rounded-full blur-[120px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-[-20%] right-[-10%] w-[90vh] h-[90vh] bg-peach-DEFAULT/10 rounded-full blur-[140px]"
            />
            */}

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default Atmosphere;
