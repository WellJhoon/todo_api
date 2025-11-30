import React, { useState } from 'react';
import { MoreHorizontal, Plus, Calendar, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function KanbanBoard({ todos, onStatusChange, onEdit }) {
  const [draggedTask, setDraggedTask] = useState(null);

  // Lógica de agrupación inteligente
  const tasks = {
    todo: todos.filter(t => !t.completed && (!t.status || t.status === 'todo') && (!t.time_spent_minutes || t.time_spent_minutes === 0)),
    in_progress: todos.filter(t => !t.completed && (t.status === 'in_progress' || (t.time_spent_minutes > 0))),
    done: todos.filter(t => t.completed)
  };

  const columns = [
    { id: 'todo', title: 'Por Hacer', icon: 'bg-slate-400' },
    { id: 'in_progress', title: 'En Progreso', icon: 'bg-blue-500' },
    { id: 'done', title: 'Completado', icon: 'bg-green-500' }
  ];

  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800', label: 'Alta' },
    medium: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800', label: 'Media' },
    low: { color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800', label: 'Baja' },
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    // Hacer el elemento fantasma semitransparente
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necesario para permitir el drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedTask) return;

    // Determinar el nuevo estado basado en la columna
    let updates = {};
    let isSameColumn = false;
    
    if (targetColumnId === 'done') {
      if (draggedTask.completed) isSameColumn = true;
      updates = { completed: true };
    } else if (targetColumnId === 'in_progress') {
      if (!draggedTask.completed && draggedTask.status === 'in_progress') isSameColumn = true;
      updates = { completed: false, status: 'in_progress' };
    } else {
      if (!draggedTask.completed && (!draggedTask.status || draggedTask.status === 'todo')) isSameColumn = true;
      updates = { completed: false, status: 'todo' };
    }

    if (!isSameColumn) {
      onStatusChange(draggedTask, updates);
    }
  };

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-6 h-full min-w-[1000px]">
        {columns.map(col => (
          <div 
            key={col.id} 
            className={cn(
              "flex-1 flex flex-col min-w-[300px] bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all",
              draggedTask && "border-blue-300 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-900/10"
            )}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", col.icon)} />
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">{col.title}</h3>
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium">
                  {tasks[col.id].length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Tasks List */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {tasks[col.id].map(task => {
                const priority = task.priority || 'medium';
                
                return (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group",
                      "animate-in fade-in zoom-in-95 duration-200"
                    )}
                    onClick={() => onEdit(task.id, {})} // Placeholder for edit
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded border",
                        priorityConfig[priority].color
                      )}>
                        {priorityConfig[priority].label}
                      </span>
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>

                    <h4 className={cn(
                      "text-sm font-medium text-slate-800 dark:text-slate-200 mb-3 line-clamp-2",
                      task.completed && "line-through text-slate-400 dark:text-slate-500"
                    )}>
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                          J
                        </div>
                      </div>
                      
                      {(task.estimated_minutes || 0) > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded">
                          <Clock className="h-3 w-3" />
                          <span>{task.estimated_minutes}m</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {tasks[col.id].length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                  Arrastra tareas aquí
                </div>
              )}

              {col.id === 'todo' && (
                <button className="w-full py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-800 transition-all text-sm">
                  <Plus className="h-4 w-4" />
                  Añadir Tarea
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
