import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center pt-12 sm:pt-20 px-4 pb-10 transition-colors duration-300">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[400px] space-y-6 relative">
        <div className="px-2">
          <h1 className="text-[34px] font-bold text-foreground tracking-tight leading-tight">
            Tasks
          </h1>
        </div>

        <div className="bg-card rounded-[20px] shadow-sm overflow-visible border border-border/40">
          {children}
        </div>
      </div>
    </div>
  );
}
