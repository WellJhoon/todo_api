import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DeadlineTracker({ todos }) {
  const [deadline, setDeadline] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  // Cargar deadline del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('project_deadline');
    if (saved) {
      setDeadline(saved);
    }
  }, []);

  // Guardar deadline al cambiar
  const handleDeadlineChange = (newDeadline) => {
    setDeadline(newDeadline);
    localStorage.setItem('project_deadline', newDeadline);
    setShowPicker(false);
  };

  const clearDeadline = () => {
    setDeadline('');
    localStorage.removeItem('project_deadline');
  };

  if (!deadline && !showPicker) {
    return (
      <div className="glass dark:glass-dark rounded-3xl border border-white/20 dark:border-white/10 ios-shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 ios-shadow">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Fecha Límite del Proyecto</h3>
              <p className="text-xs text-muted-foreground">Establece un deadline para todas tus tareas</p>
            </div>
          </div>
          <button
            onClick={() => setShowPicker(true)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium",
              "bg-gradient-to-r from-orange-500 to-red-600 text-white",
              "transition-all duration-200 hover:scale-105 hover:shadow-lg"
            )}
          >
            Establecer Deadline
          </button>
        </div>
      </div>
    );
  }

  if (showPicker && !deadline) {
    return (
      <div className="glass dark:glass-dark rounded-3xl border border-white/20 dark:border-white/10 ios-shadow-lg p-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">¿Para cuándo debe estar todo listo?</h3>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={cn(
                "flex-1 bg-white/50 dark:bg-black/20 rounded-xl px-4 py-3 text-sm",
                "outline-none border border-white/20 dark:border-white/10 focus:border-primary",
                "transition-all duration-200"
              )}
            />
            <button
              onClick={() => handleDeadlineChange(deadline)}
              disabled={!deadline}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-medium",
                "bg-gradient-to-r from-orange-500 to-red-600 text-white",
                "transition-all duration-200 hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowPicker(false)}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium",
                "glass dark:glass-dark border border-white/20 dark:border-white/10",
                "transition-all duration-200 hover:scale-105"
              )}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cálculos
  const incompleteTodos = todos.filter(t => !t.completed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(23, 59, 59, 999);
  
  const daysLeft = Math.max(0, Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)));
  const hoursLeft = daysLeft * 8; // 8 horas de trabajo por día
  
  const totalEstimated = incompleteTodos.reduce((sum, todo) => sum + (todo.estimated_minutes || 0), 0);
  const totalSpent = incompleteTodos.reduce((sum, todo) => sum + (todo.time_spent_minutes || 0), 0);
  const totalRemaining = Math.max(0, totalEstimated - totalSpent);
  
  const hoursPerDay = hoursLeft > 0 ? (totalRemaining / 60) / daysLeft : 0;
  const isOverloaded = hoursPerDay > 8;
  const isPastDeadline = daysLeft === 0 && deadlineDate < today;

  const formatHours = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className={cn(
      "glass dark:glass-dark rounded-3xl border ios-shadow-lg p-6 mb-6",
      isPastDeadline 
        ? "border-red-500/50 dark:border-red-500/30"
        : isOverloaded 
          ? "border-orange-500/50 dark:border-orange-500/30"
          : "border-white/20 dark:border-white/10"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center h-10 w-10 rounded-xl ios-shadow",
            isPastDeadline
              ? "bg-gradient-to-br from-red-500 to-red-700"
              : isOverloaded
                ? "bg-gradient-to-br from-orange-500 to-red-600"
                : "bg-gradient-to-br from-green-500 to-emerald-600"
          )}>
            {isPastDeadline ? (
              <AlertCircle className="h-5 w-5 text-white" />
            ) : (
              <Calendar className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Deadline del Proyecto</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(deadline).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <button
          onClick={clearDeadline}
          className="text-xs text-red-500 hover:text-red-600 transition-colors"
        >
          Cambiar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass dark:glass-dark rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Días restantes</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            isPastDeadline ? "text-red-500" : daysLeft < 7 ? "text-orange-500" : "text-green-500"
          )}>
            {isPastDeadline ? '¡Atrasado!' : `${daysLeft} días`}
          </div>
        </div>

        <div className="glass dark:glass-dark rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">Horas/día necesarias</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            isOverloaded ? "text-red-500" : "text-green-500"
          )}>
            {hoursPerDay.toFixed(1)}h
          </div>
        </div>
      </div>

      {/* Progress info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tareas pendientes:</span>
          <span className="font-medium">{incompleteTodos.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tiempo estimado total:</span>
          <span className="font-medium">{formatHours(totalEstimated)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tiempo ya invertido:</span>
          <span className="font-medium">{formatHours(totalSpent)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tiempo restante:</span>
          <span className="font-medium text-orange-500">{formatHours(totalRemaining)}</span>
        </div>
      </div>

      {/* Alertas */}
      {isOverloaded && !isPastDeadline && (
        <div className="mt-4 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <p className="text-xs text-orange-600 dark:text-orange-400">
            ⚠️ Necesitas trabajar más de 8 horas diarias para cumplir el deadline. Considera extender la fecha o reducir tareas.
          </p>
        </div>
      )}

      {isPastDeadline && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400">
            🚨 El deadline ha pasado. Actualiza la fecha límite para recalcular tu plan de trabajo.
          </p>
        </div>
      )}
    </div>
  );
}
