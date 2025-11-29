import React from 'react';
import { TodoItem } from './TodoItem';
import { Loader2 } from 'lucide-react';

export function TodoList({ todos, loading, error, onToggle, onDelete, onEdit }) {
  if (error) {
    return (
      <div className="px-4 py-3 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 border-b border-border/30">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-muted-foreground text-sm">
          No tasks yet
        </p>
      </div>
    );
  }

  return (
    <div>
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
