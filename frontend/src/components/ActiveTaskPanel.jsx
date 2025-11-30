import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Coffee, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const POMODORO_TIME = 25 * 60; // 25 minutos
const SHORT_BREAK = 5 * 60; // 5 minutos
const LONG_BREAK = 15 * 60; // 15 minutos

export function ActiveTaskPanel({ activeTask, onTaskComplete, onTimeUpdate, onStopTask }) {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  useEffect(() => {
    if (!activeTask) {
      setTimeLeft(POMODORO_TIME);
      setIsRunning(false);
      setIsBreak(false);
      setPomodorosCompleted(0);
      setSessionStartTime(null);
    }
  }, [activeTask]);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Pomodoro o descanso completado
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (!isBreak) {
      // Pomodoro completado
      const newPomodoros = pomodorosCompleted + 1;
      setPomodorosCompleted(newPomodoros);
      
      // Actualizar tiempo trabajado en la tarea
      if (activeTask && onTimeUpdate) {
        onTimeUpdate(activeTask.id, 25); // 25 minutos trabajados
      }
      
      // Notificación
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('¡Pomodoro completado! 🎉', {
          body: '¡Toma un descanso!',
          icon: '/favicon.ico'
        });
      }
      
      // Empezar descanso
      setIsBreak(true);
      setTimeLeft(newPomodoros % 4 === 0 ? LONG_BREAK : SHORT_BREAK);
    } else {
      // Descanso completado
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('¡Descanso terminado! 💪', {
          body: '¡Vuelve a enfocarte!',
          icon: '/favicon.ico'
        });
      }
      
      setIsBreak(false);
      setTimeLeft(POMODORO_TIME);
    }
  };

  const handleStart = () => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsRunning(true);
    
    // Solicitar permisos de notificación
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(POMODORO_TIME);
    setIsBreak(false);
    
    if (onStopTask) {
      onStopTask();
    }
  };

  const handleComplete = () => {
    if (activeTask && onTaskComplete) {
      onTaskComplete(activeTask.id);
    }
    handleStop();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((pomodorosCompleted % 4 === 0 ? LONG_BREAK : SHORT_BREAK) - timeLeft) / (pomodorosCompleted % 4 === 0 ? LONG_BREAK : SHORT_BREAK) * 100
    : (POMODORO_TIME - timeLeft) / POMODORO_TIME * 100;

  if (!activeTask) {
    return (
      <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-white/10 ios-shadow-lg p-6">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Clock className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h3 className="text-base font-semibold text-foreground mb-2">
            No hay tarea activa
          </h3>
          <p className="text-sm text-muted-foreground">
            Selecciona una tarea de la lista y presiona el botón de play para empezar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-white/10 ios-shadow-lg overflow-hidden">
      {/* Header */}
      <div className={cn(
        "p-4 border-b border-white/10 transition-colors duration-500",
        isBreak 
          ? "bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20"
          : "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isBreak ? (
              <Coffee className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            )}
            <span className="text-sm font-semibold">
              {isBreak ? '☕ Tiempo de Descanso' : '🎯 Tarea Activa'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {pomodorosCompleted} 🍅 completados
            </span>
          </div>
        </div>

        {!isBreak && (
          <h4 className="text-base font-bold text-foreground truncate">
            {activeTask.title}
          </h4>
        )}
      </div>

      {/* Timer Display */}
      <div className="p-8 text-center">
        {/* Circular Progress */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <svg className="transform -rotate-90" width="200" height="200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={565.48}
              strokeDashoffset={565.48 - (565.48 * progress) / 100}
              className={cn(
                "transition-all duration-1000",
                isBreak 
                  ? "text-green-500" 
                  : isRunning 
                    ? "text-blue-500" 
                    : "text-purple-500"
              )}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Time display */}
          <div className="absolute">
            <div className="text-5xl font-bold text-foreground tabular-nums">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {isBreak ? 'Descanso' : 'Enfocado'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm",
                "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
                "transition-all duration-200 hover:scale-105 hover:shadow-lg"
              )}
            >
              <Play className="h-5 w-5" fill="white" />
              Iniciar
            </button>
          ) : (
            <button
              onClick={handlePause}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm",
                "bg-gradient-to-r from-orange-500 to-red-500 text-white",
                "transition-all duration-200 hover:scale-105 hover:shadow-lg"
              )}
            >
              <Pause className="h-5 w-5" />
              Pausar
            </button>
          )}

          <button
            onClick={handleStop}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm",
              "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
              "transition-all duration-200 hover:scale-105"
            )}
          >
            <Square className="h-4 w-4" />
            Detener
          </button>

          {!isBreak && (
            <button
              onClick={handleComplete}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm",
                "bg-gradient-to-r from-green-500 to-teal-500 text-white",
                "transition-all duration-200 hover:scale-105 hover:shadow-lg"
              )}
            >
              <Trophy className="h-4 w-4" />
              Completar
            </button>
          )}
        </div>
      </div>

      {/* Stats footer */}
      {sessionStartTime && (
        <div className="px-4 py-3 border-t border-white/10 bg-white/30 dark:bg-black/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Sesión iniciada: {sessionStartTime.toLocaleTimeString()}</span>
            <span>Total: {pomodorosCompleted * 25} min trabajados</span>
          </div>
        </div>
      )}
    </div>
  );
}
