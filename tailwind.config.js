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
            // Cores personalizadas
            colors: {
                'desktop-bg': '#f3f4f6', // Cor de fundo, semelhante a uma interface de desktop
                'toolbar': '#e2e8f0', // Cor da barra de ferramentas
                'accent': '#4f46e5', // Cor de destaque/acento
                // Adicione outras cores conforme necessário
            },
            // Bordas e sombras
            boxShadow: {
                'toolbar': '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Sombra para a barra de ferramentas
                // Adicione outras sombras conforme necessário
            },
            borderRadius: {
                'button': '4px', // Raio da borda para botões
                // Adicione outros raios de borda conforme necessário
            },
            // Espaçamento
            spacing: {
                '1': '8px', // Pequeno espaçamento
                '2': '12px', // Espaçamento médio
                // Adicione outros espaçamentos conforme necessário
            },
            // Adicione outras personalizações conforme necessário
        },
    },
  plugins: [],
}

