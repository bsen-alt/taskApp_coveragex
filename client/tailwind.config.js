/** @type {import('tailwindcss').Config} */
export default {
  darkMode:"class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ["Inter", "serif"],
      },
      colors: {
        // Light mode colors
        'primary-light': '#FF6F00', 
        'secondary-light': '#FFC107', 
        'background-light': '#F9F9F9',
        'surface-light': '#FFFFFF',
        'text-primary-light': '#333333',
        'text-secondary-light': '#666666',
        'accent-light': '#00B0FF',
        'border-light': '#DDDDDD',
        'primary-button-light': '#FF6F00',
        'secondary-button-light': '#4CAF50',

        // Dark mode colors
        'primary-dark': '#FF6F00',
        'secondary-dark': '#FFC107',
        'background-dark': '#121212',
        'surface-dark': '#1E1E1E',
        'text-primary-dark': '#E5E5E5',
        'text-secondary-dark': '#A1A1A1',
        'accent-dark': '#00B0FF',
        'border-dark': '#444444',
        'primary-button-dark': '#FF6F00',
        'secondary-button-dark': '#4CAF50',

        // Hold & completed task background colors
        'hold-task-light': '#F4E1A1',
        'completed-task-light': '#B9E6B6',

        'hold-task-dark': '#F4E1A1',
        'completed-task-dark': '#B9E6B6',
      },
      backgroundColor: {
        'light-mode': '#F9F9F9',
        'dark-mode': '#121212',
      },
      textColor: {
        'primary-light': '#333333',
        'secondary-light': '#666666',
        'primary-dark': '#E5E5E5',
        'secondary-dark': '#A1A1A1',
      },
      borderColor: {
        'light-mode': '#DDDDDD',
        'dark-mode': '#444444',
      },

      ringColor: {
        'accent-light': '#00B0FF',
        'accent-dark': '#00B0FF',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}