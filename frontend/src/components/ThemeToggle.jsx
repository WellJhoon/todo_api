import React, { useState } from 'react';
import { Moon, Sun, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const Icon = currentTheme.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Toggle theme"
      >
        <Icon className="h-4 w-4" />
        <ChevronDown className="h-3 w-3" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-[100] min-w-[120px]">
          {themes.map((themeOption) => {
            const ThemeIcon = themeOption.icon;
            return (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <ThemeIcon className="h-4 w-4" />
                {themeOption.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
