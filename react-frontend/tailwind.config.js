module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
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
        },
        borderColor: {
            DEFAULT: '#ffffff', // Contorno branco
        },
        outline: {
            none: 'none', // Remove outlines padrão
            blue: '2px solid #3b82f6', // Outline azul em foco
        },
    },
  },
  variants: {
      extend: {
          borderColor: ['responsive', 'hover', 'focus', 'focus-visible'], // Variantes para cor de borda
          ringWidth: ['focus-visible'], // Variantes para largura do anel
          outline: ['focus-visible'], // Variantes para outline
      },
  },
  plugins: [],
};
