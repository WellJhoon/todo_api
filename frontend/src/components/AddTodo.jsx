import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, completed: false });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div
        className={cn(
          "flex items-center gap-3 p-4",
          "glass dark:glass-dark rounded-2xl border transition-all duration-300",
          isFocused 
            ? "border-primary shadow-lg scale-[1.01]" 
            : "border-white/20 dark:border-white/10 ios-shadow"
        )}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Nueva tarea..."
          className={cn(
            "flex-1 bg-transparent outline-none text-base font-medium",
            "placeholder:text-muted-foreground/60"
          )}
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-full",
            "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
            "transition-all duration-200 hover:scale-110 hover:shadow-lg",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
