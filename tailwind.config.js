/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./demos/restaurant/index.html'],
    theme: {
        extend: {
            colors: {
                pop: {
                    red: '#ef4444',       /* Vermilion Red */
                    orange: '#f97316',    /* Papaya Orange */
                    green: '#10b981',     /* Jade Green */
                    yellow: '#eab308',    /* Gold Yellow */
                    light: '#f8fafc',     /* Bright Off-White */
                    dark: '#1e293b',      /* Slate Dark */
                },
            },
            fontFamily: {
                display: ['"Montserrat"', 'sans-serif'],
                body: ['"Open Sans"', 'sans-serif'],
            },
            boxShadow: {
                'pop': '4px 4px 0px 0px rgba(0,0,0,0.1)',
                'pop-hover': '6px 6px 0px 0px rgba(0,0,0,0.15)',
            },
            borderRadius: {
                'blob': '30% 70% 70% 30% / 30% 30% 70% 70%',
            },
        },
    },
    plugins: [],
};
