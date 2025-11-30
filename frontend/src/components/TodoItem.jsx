import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Check, X, Clock, Calendar, Flag, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TodoItem({ todo, onToggle, onDelete, onEdit, onStartPomodoro, isActive }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [editEstimated, setEditEstimated] = useState(todo.estimated_minutes || 0);
  const [editTimeSpent, setEditTimeSpent] = useState(todo.time_spent_minutes || 0);
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [editDueDate, setEditDueDate] = useState(todo.due_date || '');
  const [editDuration, setEditDuration] = useState(todo.duration_minutes || 0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== todo.title) {
      onEdit(todo.id, { 
        ...todo, 
        title: editValue.trim(),
        estimated_minutes: editEstimated,
        time_spent_minutes: editTimeSpent,
        priority: editPriority,
        due_date: editDueDate || null,
        duration_minutes: editDuration || null,
      });
    } else {
      setEditValue(todo.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(todo.title);
    setEditEstimated(todo.estimated_minutes || 0);
    setEditTimeSpent(todo.time_spent_minutes || 0);
    setEditPriority(todo.priority || 'medium');
    setEditDueDate(todo.due_date || '');
    setEditDuration(todo.duration_minutes || 0);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();
    
    if (isToday) return 'Hoy';
    if (isTomorrow) return 'Mañana';
    
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = () => {
    if (!todo.due_date || todo.completed) return false;
    return new Date(todo.due_date) < new Date();
  };

  const priorityConfig = {
    high: { 
      label: 'Alta',
      color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
      dot: 'bg-red-500'
    },
    medium: { 
      label: 'Media',
      color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
      dot: 'bg-yellow-500'
    },
    low: { 
      label: 'Baja',
      color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
      dot: 'bg-green-500'
    },
  };

  const priority = todo.priority || 'medium';
  const estimated = todo.estimated_minutes || 0;
  const spent = todo.time_spent_minutes || 0;
  const remaining = Math.max(0, estimated - spent);
  const progress = estimated > 0 ? Math.min(100, (spent / estimated) * 100) : 0;
  const isOvertimeCalc = spent > estimated && estimated > 0;

  return (
    <div
      className={cn(
        "group p-3 mb-2",
        "glass dark:glass-dark rounded-xl border transition-all duration-300",
        isOverdue() 
          ? "border-red-300 dark:border-red-700 ios-shadow-lg" 
          : "border-white/20 dark:border-white/10 ios-shadow hover:ios-shadow-lg",
        "hover:scale-[1.01]",
        todo.completed && "opacity-60"
      )}
    >
      {/* Fila principal */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* iOS-style Toggle Switch */}
          <button
            onClick={() => onToggle(todo)}
            disabled={isEditing}
            className={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background mt-0.5",
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
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ease-in-out",
                todo.completed ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            {/* Título */}
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full bg-transparent outline-none text-sm font-medium",
                  "border-b-2 border-primary pb-1 transition-all mb-2"
                )}
              />
            ) : (
              <div className="flex items-start gap-2 mb-1.5">
                <span
                  onDoubleClick={() => !todo.completed && setIsEditing(true)}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 cursor-text flex-1",
                    todo.completed && "line-through text-muted-foreground"
                  )}
                  title="Doble clic para editar"
                >
                  {todo.title}
                </span>
              </div>
            )}

            {/* Metadata compacta */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Prioridad */}
              {isEditing ? (
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className={cn(
                    "px-2 py-0.5 rounded-md text-xs border outline-none",
                    priorityConfig[editPriority].color
                  )}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              ) : (
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium",
                  priorityConfig[priority].color
                )}>
                  <Flag className="h-2.5 w-2.5" />
                  {priorityConfig[priority].label}
                </span>
              )}

              {/* Fecha programada */}
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <input
                    type="datetime-local"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="bg-white/50 dark:bg-black/20 rounded px-2 py-0.5 text-xs outline-none border border-white/20 dark:border-white/10"
                  />
                </div>
              ) : todo.due_date && (
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md",
                  isOverdue() 
                    ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                )}>
                  <Calendar className="h-2.5 w-2.5" />
                  {formatDate(todo.due_date)}
                </span>
              )}

              {/* Duración */}
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(parseInt(e.target.value) || 0)}
                    placeholder="Duración"
                    min="0"
                    className="bg-white/50 dark:bg-black/20 rounded px-2 py-0.5 text-xs outline-none border border-white/20 dark:border-white/10 w-20"
                  />
                  <span className="text-xs text-muted-foreground">min</span>
                </div>
              ) : (todo.duration_minutes || estimated) > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                  <Clock className="h-2.5 w-2.5" />
                  {formatTime(todo.duration_minutes || estimated)}
                </span>
              )}
            </div>

            {/* Barra de progreso de tiempo trabajado */}
            {!isEditing && estimated > 0 && (
              <div className="mt-2 space-y-1">
                <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      isOvertimeCalc 
                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-600"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    Usado: <span className="font-medium text-foreground">{formatTime(spent)}</span>
                  </span>
                  <span className={cn(
                    isOvertimeCalc && "text-red-500 dark:text-red-400 font-medium"
                  )}>
                    {isOvertimeCalc ? 'Excedido' : `Quedan: ${formatTime(remaining)}`}
                  </span>
                </div>
              </div>
            )}

            {/* Modo edición - campos adicionales */}
            {isEditing && (
              <div className="mt-2 space-y-2 pt-2 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Estimado (min)</label>
                    <input
                      type="number"
                      value={editEstimated}
                      onChange={(e) => setEditEstimated(parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full bg-white/50 dark:bg-black/20 rounded px-2 py-1 text-xs outline-none border border-white/20 dark:border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Usado (min)</label>
                    <input
                      type="number"
                      value={editTimeSpent}
                      onChange={(e) => setEditTimeSpent(parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full bg-white/50 dark:bg-black/20 rounded px-2 py-1 text-xs outline-none border border-white/20 dark:border-white/10"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className={cn(
                  "flex items-center justify-center h-7 w-7 rounded-full",
                  "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                  "transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-900/40 hover:scale-110"
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleCancel}
                className={cn(
                  "flex items-center justify-center h-7 w-7 rounded-full",
                  "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
                  "transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-110"
                )}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              {/* Botón de Pomodoro */}
              {!todo.completed && onStartPomodoro && (
                <button
                  onClick={() => onStartPomodoro(todo)}
                  className={cn(
                    "flex items-center justify-center h-7 w-7 rounded-full",
                    isActive 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse" 
                      : "bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400",
                    "transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:scale-110",
                    !isActive && "opacity-0 group-hover:opacity-100"
                  )}
                  title="Iniciar Pomodoro"
                >
                  <Play className="h-3.5 w-3.5" fill={isActive ? "white" : "currentColor"} />
                </button>
              )}

              <button
                onClick={() => setIsEditing(true)}
                disabled={todo.completed}
                className={cn(
                  "flex items-center justify-center h-7 w-7 rounded-full",
                  "bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400",
                  "transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:scale-110",
                  "opacity-0 group-hover:opacity-100",
                  todo.completed && "opacity-0 group-hover:opacity-40 cursor-not-allowed"
                )}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className={cn(
                  "flex items-center justify-center h-7 w-7 rounded-full",
                  "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400",
                  "transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/40 hover:scale-110",
                  "opacity-0 group-hover:opacity-100"
                )}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
