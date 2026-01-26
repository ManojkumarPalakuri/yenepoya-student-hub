/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                yen: {
                    primary: '#D32F2F', // Red (Admissions/Fee buttons)
                    green: '#84BD00',   // Brand Green
                    blue: '#005596',    // Brand Blue
                    gray: '#F8F9FA',    // Light Gray bg
                }
            }
        },
    },
    plugins: [],
}
