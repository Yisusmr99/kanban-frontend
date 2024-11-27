/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Asegúrate de incluir la carpeta `app`
    "./src/**/*.{js,ts,jsx,tsx}", // Incluye la carpeta `src` si estás usándola
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};