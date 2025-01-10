/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Файли в папці `pages`
    "./components/**/*.{js,ts,jsx,tsx}", // Файли в папці `components`
    "./app/**/*.{js,ts,jsx,tsx}", // Якщо у вас є папка `app`
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


