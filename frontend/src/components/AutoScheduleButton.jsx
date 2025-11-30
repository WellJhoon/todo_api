import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateScheduleStats } from '@/utils/autoScheduler';

export function AutoScheduleButton({ todos, onSchedule, className }) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const stats = calculateScheduleStats(todos);
  const pendingTasks = todos.filter(t => !t.completed).length;
  
  const handleSchedule = async () => {
    setIsScheduling(true);
    await onSchedule();
    
    // Mostrar confirmación con animación
    setTimeout(() => {
      setIsScheduling(false);
      setShowStats(true);
      setTimeout(() => setShowStats(false), 3000);
    }, 800);
  };
  
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={handleSchedule}
        disabled={isScheduling || pendingTasks === 0}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm",
          "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
          "transition-all duration-200",
          "hover:scale-105 hover:shadow-lg hover:from-purple-600 hover:to-pink-600",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          isScheduling && "animate-pulse"
        )}
      >
        <Sparkles className={cn(
          "h-4 w-4",
          isScheduling && "animate-spin"
        )} />
        <span>
          {isScheduling ? 'Planificando...' : 'Planificar Automáticamente'}
        </span>
        {pendingTasks > 0 && !isScheduling && (
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
            {pendingTasks}
          </span>
        )}
      </button>
      
      {/* Estadísticas emergentes */}
      {showStats && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 glass dark:glass-dark rounded-xl border border-white/20 dark:border-white/10 p-3 ios-shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3 text-purple-500" />
              <span className="text-muted-foreground">
                {stats.scheduledTasks} tareas programadas
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="text-muted-foreground">
                ~{stats.totalHours}h de trabajo
              </span>
            </div>
            {stats.estimatedCompletionDate && (
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-muted-foreground">
                  Finalización estimada: {new Date(stats.estimatedCompletionDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
