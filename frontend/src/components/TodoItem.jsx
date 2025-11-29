import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== todo.title) {
      onEdit(todo.id, { ...todo, title: editValue.trim() });
    } else {
      setEditValue(todo.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-4 mb-2",
        "glass dark:glass-dark rounded-2xl border border-white/20 dark:border-white/10",
        "ios-shadow transition-all duration-300 hover:ios-shadow-lg hover:scale-[1.01]",
        todo.completed && "opacity-60"
      )}
    >
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        {/* iOS-style Toggle Switch */}
        <button
          onClick={() => onToggle(todo)}
          disabled={isEditing}
          className={cn(
            "relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background",
            todo.completed 
              ? "bg-gradient-to-r from-blue-500 to-blue-600" 
              : "bg-gray-300 dark:bg-gray-600",
            isEditing && "opacity-50 cursor-not-allowed"
          )}
          role="switch"
          aria-checked={todo.completed}
        >
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ease-in-out",
              todo.completed ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>

        {/* Texto editable */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={cn(
              "flex-1 bg-transparent outline-none text-base font-medium",
              "border-b-2 border-primary pb-1 transition-all"
            )}
          />
        ) : (
          <span
            onDoubleClick={() => !todo.completed && setIsEditing(true)}
            className={cn(
              "text-base font-medium truncate transition-all duration-200 cursor-text",
              todo.completed && "line-through text-muted-foreground"
            )}
            title="Doble clic para editar"
          >
            {todo.title}
          </span>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2 ml-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className={cn(
                "flex items-center justify-center h-9 w-9 rounded-full",
                "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                "transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-900/40 hover:scale-110"
              )}
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className={cn(
                "flex items-center justify-center h-9 w-9 rounded-full",
                "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
                "transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-110"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              disabled={todo.completed}
              className={cn(
                "flex items-center justify-center h-9 w-9 rounded-full",
                "bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400",
                "transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:scale-110",
                "opacity-0 group-hover:opacity-100",
                todo.completed && "opacity-0 group-hover:opacity-40 cursor-not-allowed"
              )}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className={cn(
                "flex items-center justify-center h-9 w-9 rounded-full",
                "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400",
                "transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/40 hover:scale-110",
                "opacity-0 group-hover:opacity-100"
              )}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
