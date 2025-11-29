import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, completed: false });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Initialize new task protocol..."
        className={cn(
          "glass-input relative flex h-14 w-full rounded-xl border bg-black/20 px-5 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 pr-16 text-white"
        )}
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className={cn(
          "absolute right-2 top-2 bottom-2 aspect-square inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary/20 text-primary hover:bg-primary hover:text-white hover:neon-glow border border-primary/20"
        )}
      >
        <Plus className="h-5 w-5" />
      </button>
    </form>
  );
}
