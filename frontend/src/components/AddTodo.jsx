import React, { useState } from 'react';
import { Plus, Clock, Calendar, Flag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({ 
      title, 
      completed: false,
      estimated_minutes: estimatedMinutes ? parseInt(estimatedMinutes) : 0,
      time_spent_minutes: 0,
      priority: priority,
      due_date: dueDate || null,
      duration_minutes: estimatedMinutes ? parseInt(estimatedMinutes) : null,
    });
    
    setTitle('');
    setEstimatedMinutes('');
    setPriority('medium');
    setDueDate('');
  };

  const priorities = [
    { id: 'low', label: 'Baja', color: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' },
    { id: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { id: 'high', label: 'Alta', color: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-6">
        {/* Input Principal - Grande y Limpio */}
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="¿Qué hay que hacer?"
            className="w-full bg-transparent text-2xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none border-none p-0"
            autoFocus
          />
        </div>

        {/* Controles Secundarios - Minimalistas */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Selector de Prioridad - Píldoras */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mr-2">Prioridad</span>
            {priorities.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                  priority === p.id 
                    ? cn(p.color, "border-transparent shadow-sm scale-105") 
                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            {/* Fecha */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 transition-colors group w-full sm:w-auto">
              <Calendar className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent outline-none text-sm w-full cursor-pointer text-slate-600 dark:text-slate-300"
              />
            </div>

            {/* Tiempo Estimado */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 transition-colors group w-full sm:w-auto">
              <Clock className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                placeholder="Minutos"
                min="0"
                className="bg-transparent outline-none text-sm w-20 text-slate-600 dark:text-slate-300 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Botón de Acción - Flotante o Fijo */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={!title.trim()}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300",
              title.trim()
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:scale-105 active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
            )}
          >
            Crear Tarea
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
