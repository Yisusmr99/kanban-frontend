/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Asegúrate de incluir la carpeta `app`
    "./src/**/*.{js,ts,jsx,tsx}", // Incluye la carpeta `src` si estás usándola
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          600: '#79AC78', // Cambia el color indigo-600 por el nuevo color
          500: '#618264'
        },
      },
    },
  },
  plugins: [],
};