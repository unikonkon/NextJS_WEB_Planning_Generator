'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative rounded-full transition-all duration-300 hover:bg-white/10 ${className}`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun 
        className={`h-5 w-5 transition-all duration-300 ${
          theme === 'dark' 
            ? 'rotate-0 scale-100 text-yellow-400' 
            : 'rotate-90 scale-0'
        }`} 
      />
      <Moon 
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark' 
            ? 'rotate-90 scale-0' 
            : 'rotate-0 scale-100 text-slate-700'
        }`} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

