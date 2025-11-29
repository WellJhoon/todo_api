import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Check, Pencil, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editTitle.trim() !== todo.title) {
      onEdit(todo.id, editTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-4 px-6 py-5 bg-background border-b border-border/30 last:border-b-0">
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground"
        />
        <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground p-1">
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-4 px-6 py-5 bg-background hover:bg-muted/30 transition-colors border-b border-border/30 last:border-b-0">
      <button
        onClick={() => onToggle(todo)}
        className={cn(
          "flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full border transition-all duration-200",
          todo.completed 
            ? "bg-primary border-primary text-primary-foreground" 
            : "border-muted-foreground/40 hover:border-primary"
        )}
      >
        <Check className={cn("h-3 w-3", todo.completed ? "scale-100" : "scale-0")} />
      </button>
      
      <span
        onDoubleClick={() => setIsEditing(true)}
        className={cn(
          "flex-1 text-base font-normal cursor-pointer select-none transition-all",
          todo.completed ? "line-through text-muted-foreground" : "text-foreground"
        )}
      >
        {todo.title}
      </span>
      
      <div className="flex items-center gap-1 opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
