import React from 'react';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductivityStats({ todos }) {
  // Calcular estadísticas
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  const totalEstimated = todos.reduce((sum, t) => sum + (t.estimated_minutes || 0), 0);
  const totalWorked = todos.reduce((sum, t) => sum + (t.time_spent_minutes || 0), 0);
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const efficiency = totalEstimated > 0 ? Math.round((totalWorked / totalEstimated) * 100) : 0;
  
  const avgTimePerTask = completedTasks > 0 
    ? Math.round(todos.filter(t => t.completed).reduce((sum, t) => sum + (t.time_spent_minutes || 0), 0) / completedTasks)
    : 0;

  const todayTasks = todos.filter(t => {
    if (!t.due_date) return false;
    const taskDate = new Date(t.due_date);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  }).length;

  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const stats = [
    {
      icon: Target,
      label: 'Tasa de Completitud',
      value: `${completionRate}%`,
      color: completionRate >= 75 ? 'text-green-600 dark:text-green-400' : completionRate >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400',
      bgColor: completionRate >= 75 ? 'bg-green-50 dark:bg-green-900/20' : completionRate >= 50 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20',
      description: `${completedTasks}/${totalTasks} tareas`
    },
    {
      icon: Zap,
      label: 'Eficiencia',
      value: `${efficiency}%`,
      color: efficiency <= 100 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400',
      bgColor: efficiency <= 100 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20',
      description: `${formatTime(totalWorked)} trabajado`
    },
    {
      icon: TrendingUp,
      label: 'Promedio por Tarea',
      value: formatTime(avgTimePerTask),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: `${completedTasks} completadas`
    },
    {
      icon: Award,
      label: 'Hoy',
      value: `${todayTasks}`,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      description: todayTasks === 1 ? 'tarea programada' : 'tareas programadas'
    }
  ];

  return (
    <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-white/10 ios-shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Productividad</h3>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-xl border border-white/10 transition-all duration-200",
                  "hover:scale-105 hover:shadow-md",
                  stat.bgColor
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon className={cn("h-4 w-4", stat.color)} />
                  <span className={cn("text-xl font-bold", stat.color)}>
                    {stat.value}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar para completitud */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Progreso General</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
