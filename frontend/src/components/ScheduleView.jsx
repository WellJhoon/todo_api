import React from 'react';
import { Calendar, Clock, Flag, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScheduleView({ todos }) {
  // Agrupar tareas por día
  const groupTasksByDay = () => {
    const pendingTasks = todos.filter(t => !t.completed && t.due_date);
    const grouped = {};

    pendingTasks.forEach(task => {
      const date = new Date(task.due_date);
      const dayKey = date.toDateString();
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          date: date,
          tasks: []
        };
      }
      
      grouped[dayKey].tasks.push(task);
    });

    // Ordenar tareas dentro de cada día por hora
    Object.values(grouped).forEach(day => {
      day.tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    });

    // Convertir a array y ordenar por fecha
    return Object.values(grouped).sort((a, b) => a.date - b.date);
  };

  const formatDate = (date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();
    
    if (isToday) return 'Hoy';
    if (isTomorrow) return 'Mañana';
    
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const priorityConfig = {
    high: { 
      color: 'bg-red-100 dark:bg-red-900/30 border-l-red-500',
      textColor: 'text-red-700 dark:text-red-400',
      dot: 'bg-red-500'
    },
    medium: { 
      color: 'bg-yellow-100 dark:bg-yellow-900/30 border-l-yellow-500',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      dot: 'bg-yellow-500'
    },
    low: { 
      color: 'bg-green-100 dark:bg-green-900/30 border-l-green-500',
      textColor: 'text-green-700 dark:text-green-400',
      dot: 'bg-green-500'
    },
  };

  const daySchedule = groupTasksByDay();
  const totalScheduled = todos.filter(t => !t.completed && t.due_date).length;
  const totalTime = todos
    .filter(t => !t.completed && t.due_date)
    .reduce((sum, t) => sum + (t.duration_minutes || t.estimated_minutes || 0), 0);

  if (daySchedule.length === 0) {
    return (
      <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-white/10 ios-shadow-lg p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full text-center py-8">
          <Calendar className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-base font-semibold text-foreground mb-2">
            No hay tareas programadas
          </h3>
          <p className="text-sm text-muted-foreground">
            Usa el botón "Planificar Automáticamente" para organizar tus tareas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-white/10 ios-shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Calendario de Tareas</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle className="h-3 w-3" />
              {totalScheduled} tareas
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDuration(totalTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {daySchedule.map((day, dayIndex) => (
            <div key={dayIndex} className="relative">
              {/* Día */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg px-3 py-2 mb-2 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {formatDate(day.date)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {day.tasks.length} {day.tasks.length === 1 ? 'tarea' : 'tareas'}
                  </span>
                </div>
              </div>

              {/* Tareas del día */}
              <div className="space-y-2 pl-2">
                {day.tasks.map((task, taskIndex) => {
                  const priority = task.priority || 'medium';
                  const duration = task.duration_minutes || task.estimated_minutes || 0;
                  const endTime = new Date(new Date(task.due_date).getTime() + duration * 60000);

                  return (
                    <div
                      key={taskIndex}
                      className={cn(
                        "relative pl-4 pr-3 py-2 rounded-lg border-l-4 transition-all duration-200",
                        "hover:scale-[1.02] hover:shadow-md",
                        priorityConfig[priority].color
                      )}
                    >
                      {/* Timeline dot */}
                      <div className={cn(
                        "absolute left-[-6px] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900",
                        priorityConfig[priority].dot
                      )} />

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {/* Título */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-sm font-medium truncate",
                              task.completed && "line-through opacity-60"
                            )}>
                              {task.title}
                            </span>
                            <Flag className={cn("h-3 w-3 flex-shrink-0", priorityConfig[priority].textColor)} />
                          </div>

                          {/* Tiempo */}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(task.due_date)} - {formatTime(endTime)}
                            </span>
                            {duration > 0 && (
                              <span className="px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded text-xs font-medium">
                                {formatDuration(duration)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer con leyenda */}
      <div className="p-3 border-t border-white/10 bg-white/30 dark:bg-black/20">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Alta
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
              Media
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Baja
            </span>
          </div>
          <span className="text-muted-foreground">
            Próximos {daySchedule.length} días
          </span>
        </div>
      </div>
    </div>
  );
}
