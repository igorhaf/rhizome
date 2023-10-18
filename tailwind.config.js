/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
    ],
  theme: {
      extend: {
          colors: {
              'primary': '#1a202c',  // Cor primária personalizada
              'secondary': '#2d3748' // Cor secundária personalizada
          }
      }
  },
  plugins: [],
}

