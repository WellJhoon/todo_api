import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, completed: false });
    setTitle('');
  };

  return (
    <div className="px-6 py-5 border-b border-border/30">
      <form onSubmit={handleSubmit} className="relative flex items-center p-0">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground p-0"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="ml-4 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
