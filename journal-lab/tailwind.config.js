/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                midnight: "var(--soul-midnight)",
                void: "var(--soul-void)",
                glass: {
                    DEFAULT: "var(--glass-surface)",
                    border: "var(--glass-border)",
                    highlight: "var(--glass-highlight)",
                },
                aurora: {
                    teal: "var(--aurora-teal)",
                    peach: "var(--aurora-peach)",
                    violet: "var(--aurora-violet)",
                    blue: "var(--aurora-blue)",
                },
                starlight: "#f8fafc", // Fixed value for text to ensure contrast
            },
            fontFamily: {
                heading: ['Outfit', 'sans-serif'],
                body: ['Plus Jakarta Sans', 'sans-serif'],
            },
            borderRadius: {
                '3xl': 'var(--radius-main)',
                '2xl': 'var(--radius-sm)',
                'pill': 'var(--radius-pill)',
            },
            backdropBlur: {
                'panel': 'var(--blur-panel)',
            },
            backgroundImage: {
                'noise': "var(--noise-pattern)",
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
