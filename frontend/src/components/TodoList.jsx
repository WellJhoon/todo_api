import React from 'react';
import { TodoItem } from './TodoItem';
import { Loader2 } from 'lucide-react';

export function TodoList({ todos, loading, error, onToggle, onDelete, onEdit }) {
  if (error) {
    return (
      <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
        <p className="text-muted-foreground text-sm">
          No active protocols found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
