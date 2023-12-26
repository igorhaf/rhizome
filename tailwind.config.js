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
            fontSize:{
                DEFAULT: '12px'
            },
            textColor: {
                DEFAULT: '#dfe1e5', // Define a cor padrão do texto para branco
            },

            backgroundColor: {
                DEFAULT: '#2b2d30',
            }
        },
    },
  plugins: [
      require('@tailwindcss/forms'),
  ],
}

