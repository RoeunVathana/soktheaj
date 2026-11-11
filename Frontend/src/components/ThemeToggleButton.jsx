import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggleButton = ({ className = '', size = 18 }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-all duration-300 border-none cursor-pointer ${
        theme === 'dark'
          ? 'text-yellow-400 hover:bg-purple-900/40 hover:text-yellow-300'
          : 'text-amber-500 hover:bg-gray-200 hover:text-amber-600'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? <Sun size={size} /> : <Moon size={size} />}
    </button>
  );
};

export default ThemeToggleButton;