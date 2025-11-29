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
      <div className="flex items-center gap-2 p-4 rounded-xl border border-primary/50 bg-white/10">
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder:text-white/30"
        />
        <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-primary/20 hover:bg-white/5",
        todo.completed ? "opacity-50" : "hover:neon-glow"
      )}
    >
      <div className="flex items-center gap-4 overflow-hidden flex-1">
        <button
          onClick={() => onToggle(todo)}
          className={cn(
            "flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-md border-2 transition-all duration-300",
            todo.completed 
              ? "bg-primary border-primary text-white neon-glow" 
              : "border-white/30 hover:border-primary text-transparent hover:text-primary/50"
          )}
        >
          <Check className={cn("h-4 w-4", todo.completed ? "scale-100" : "scale-0")} />
        </button>
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={cn(
            "text-base font-medium truncate transition-all cursor-pointer select-none flex-1",
            todo.completed ? "line-through text-muted-foreground" : "text-foreground"
          )}
        >
          {todo.title}
        </span>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center justify-center rounded-lg h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="inline-flex items-center justify-center rounded-lg h-8 w-8 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
