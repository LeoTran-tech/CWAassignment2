// app/Components/ThemeButton.tsx
'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-secondary ms-3"
    >
      {theme === 'light' && 'Light'}
      {theme === 'dark' && 'Dark'}
      {theme === 'solarized' && 'Solarized'}
    </button>
  );
}
