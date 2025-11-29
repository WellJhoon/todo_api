import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center pt-12 px-4 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center pt-12 pb-6">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
            Tasks
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay organized
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-sm overflow-hidden divide-y divide-border border border-border/50">
          {children}
        </div>
        
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground/60 font-normal">
            Made with React & FastAPI
          </p>
        </div>
      </div>
    </div>
  );
}
