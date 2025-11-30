import React from 'react';
import { TrendingUp, CheckCircle2, Clock, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardView({ todos }) {
  // Métricas
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const inProgress = todos.filter(t => !t.completed && t.status === 'in_progress').length;
  const highPriority = todos.filter(t => !t.completed && t.priority === 'high').length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Datos para gráfico de pastel - Estado de tareas
  const statusData = [
    { label: 'Completadas', value: completed, color: '#10b981', percentage: total > 0 ? Math.round((completed / total) * 100) : 0 },
    { label: 'En Progreso', value: inProgress, color: '#3b82f6', percentage: total > 0 ? Math.round((inProgress / total) * 100) : 0 },
    { label: 'Pendientes', value: pending - inProgress, color: '#f59e0b', percentage: total > 0 ? Math.round(((pending - inProgress) / total) * 100) : 0 },
  ].filter(item => item.value > 0);
  
  // Datos para gráfico de barras - Prioridad
  const priorityData = [
    { label: 'Alta', value: todos.filter(t => t.priority === 'high').length, color: 'bg-red-500' },
    { label: 'Media', value: todos.filter(t => t.priority === 'medium').length, color: 'bg-yellow-500' },
    { label: 'Baja', value: todos.filter(t => t.priority === 'low').length, color: 'bg-green-500' },
  ];
  
  // Datos para gráfico de barras - Productividad semanal
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayTasks = todos.filter(t => {
      if (!t.created_at) return false;
      const taskDate = new Date(t.created_at);
      return taskDate.toDateString() === date.toDateString();
    }).length;
    return {
      day: date.toLocaleDateString('es', { weekday: 'short' }),
      value: dayTasks
    };
  });
  
  const maxVal = Math.max(...priorityData.map(d => d.value), 1);
  const maxWeekly = Math.max(...weeklyData.map(d => d.value), 1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard General</h1>
        <p className="text-slate-500 dark:text-slate-400">Resumen de actividad y progreso del proyecto.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Tareas" 
          value={total} 
          icon={CheckCircle2} 
          trend="+2 nuevas" 
          color="text-blue-600 dark:text-blue-400" 
          bg="bg-blue-50 dark:bg-blue-900/20" 
        />
        <KpiCard 
          title="Completadas" 
          value={completed} 
          icon={TrendingUp} 
          trend={`${completionRate}% tasa`} 
          color="text-green-600 dark:text-green-400" 
          bg="bg-green-50 dark:bg-green-900/20" 
        />
        <KpiCard 
          title="En Progreso" 
          value={inProgress} 
          icon={Clock} 
          trend="Activas" 
          color="text-blue-600 dark:text-blue-400" 
          bg="bg-blue-50 dark:bg-blue-900/20" 
        />
        <KpiCard 
          title="Prioridad Alta" 
          value={highPriority} 
          icon={AlertCircle} 
          trend="Requiere atención" 
          color="text-red-600 dark:text-red-400" 
          bg="bg-red-50 dark:bg-red-900/20" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Pastel - Estado de Tareas */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Estado de Tareas</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-72 h-72 mb-8">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                {statusData.length > 0 ? (
                  (() => {
                    let cumulativePercentage = 0;
                    return statusData.map((item, index) => {
                      const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                      const strokeDashoffset = -cumulativePercentage;
                      cumulativePercentage += item.percentage;
                      return (
                        <circle
                          key={index}
                          cx="50"
                          cy="50"
                          r="15.9" // Radio original
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth="12" // Más grueso
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-1000 ease-out hover:opacity-90 cursor-pointer"
                          style={{ strokeLinecap: 'butt' }}
                        />
                      );
                    });
                  })()
                ) : (
                  <circle cx="50" cy="50" r="15.9" fill="transparent" stroke="#e5e7eb" strokeWidth="12" className="dark:stroke-slate-700" />
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {completionRate}%
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">
                  Completado
                </div>
              </div>
            </div>
            
            <div className="w-full grid grid-cols-3 gap-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{item.label}</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de Barras - Prioridades */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Distribución por Prioridad</h3>
          </div>
          
          <div className="flex items-end justify-around h-72 gap-6 px-4">
            {priorityData.map((d) => (
              <div key={d.label} className="flex flex-col items-center gap-3 w-full h-full justify-end group">
                <div className="relative w-full max-w-[80px] h-full bg-slate-50 dark:bg-slate-700/30 rounded-2xl overflow-hidden flex items-end shadow-inner">
                  <div 
                    className={cn(
                      "w-full transition-all duration-1000 ease-out rounded-2xl shadow-lg relative overflow-hidden group-hover:opacity-90", 
                      d.color
                    )}
                    style={{ height: `${(d.value / maxVal) * 100}%` }}
                  >
                    {/* Brillo superior para efecto 3D sutil */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
                  </div>
                </div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-0.5">{d.label}</span>
                  <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                    {d.value} tareas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Productividad Semanal */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-slate-800 dark:text-white">Productividad Semanal</h3>
        </div>
        <div className="flex items-end justify-around h-32 gap-2">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2 w-full group">
              <div className="relative w-full max-w-[40px] h-full bg-slate-50 dark:bg-slate-700/50 rounded-t overflow-hidden flex items-end">
                <div 
                  className="w-full transition-all duration-500 rounded-t bg-gradient-to-t from-purple-500 to-blue-500 group-hover:opacity-80"
                  style={{ height: `${(d.value / maxWeekly) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{d.day}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, trend, color, bg }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2 rounded-lg", bg)}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400")}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      </div>
    </div>
  );
}
