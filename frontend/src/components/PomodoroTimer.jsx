import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutos en segundos
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playNotification();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const playNotification = () => {
    // Notificación del navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isBreak ? '¡Hora de volver al trabajo!' : '¡Tiempo de descanso!', {
        body: isBreak 
          ? 'El descanso ha terminado. ¡A trabajar!' 
          : 'Has completado 20 minutos. Toma un descanso.',
        icon: '/vite.svg'
      });
    }
    
    // Sonido opcional (puedes descomentar si tienes un archivo de audio)
    // if (audioRef.current) {
    //   audioRef.current.play();
    // }
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      reset();
    } else {
      setIsRunning(!isRunning);
      
      // Pedir permiso para notificaciones la primera vez
      if (!isRunning && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(20 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = 20 * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="glass dark:glass-dark rounded-3xl border border-white/20 dark:border-white/10 ios-shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Pomodoro Timer</h3>
          <p className="text-xs text-muted-foreground">Trabaja en bloques de 20 minutos</p>
        </div>
      </div>

      {/* Timer circular */}
      <div className="flex flex-col items-center justify-center py-6">
        {/* Círculo de progreso */}
        <div className="relative w-48 h-48 mb-6">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Tiempo en el centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {timeLeft === 0 ? '¡Terminado!' : isRunning ? 'En progreso' : 'Pausado'}
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTimer}
            className={cn(
              "flex items-center justify-center h-14 w-14 rounded-full",
              "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
              "transition-all duration-200 hover:scale-110 hover:shadow-lg",
              "ios-shadow"
            )}
          >
            {timeLeft === 0 || !isRunning ? (
              <Play className="h-6 w-6 ml-1" fill="white" />
            ) : (
              <Pause className="h-6 w-6" fill="white" />
            )}
          </button>

          <button
            onClick={reset}
            className={cn(
              "flex items-center justify-center h-12 w-12 rounded-full",
              "glass dark:glass-dark border border-white/20 dark:border-white/10",
              "transition-all duration-200 hover:scale-110",
              "text-muted-foreground hover:text-foreground"
            )}
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Audio para notificación (opcional) */}
      {/* <audio ref={audioRef} src="/notification.mp3" preload="auto" /> */}
    </div>
  );
}
