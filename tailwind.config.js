module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        facebook: "url('../src/assets/svg/facebook-icon.svg')",
        'gradient-iati': 'linear-gradient(0deg, #124555 4%, #155366 20%)',
        'header-image': "url('../src/assets/images/marque-white.png')",
        linkedin: "url('../src/assets/svg/linkedin-icon.svg')",
        'logo-colour': "url('../src/assets/svg/logo-colour.svg')",
        'logo-white': "url('../src/assets/svg/logo-white.svg')",
        'menu-icon': "url('../src/assets/icons/menu.svg')",
        'copy-icon': "url('../src/assets/icons/copy.svg')",
        'check-icon': "url('../src/assets/icons/check.svg')",
        twitter: "url('../src/assets/svg/twitter-icon.svg')",
        youtube: "url('../src/assets/svg/youtube-icon.svg')",
      },
      backgroundSize: { '50%': '50%', '90%': '90%' },
      colors: {
        'gray-7': '#121212',
        'iati-blue': '#81c3d6',
        'iati-green': '#155366',
        'iati-accent': '#1e7590',
        'iati-code': '#e83e8c',
        critical: '#a66ee9',
        error: '#f73357',
        success: '#18BC9C',
        warning: '#ff7264',
      },
      fontFamily: {
        sans: ['Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        tiny: '.9rem',
      },
      transitionDuration: {
        2000: '2000ms',
      },
      transitionProperty: {
        height: 'height',
      },
      zIndex: {
        5: '5',
      },
    },
  },
  plugins: [],
};
