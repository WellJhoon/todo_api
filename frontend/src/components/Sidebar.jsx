import React from 'react';
import { LayoutDashboard, KanbanSquare, ListTodo, Ticket, Settings, Plus, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ currentView, onViewChange, onAddClick }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', label: 'Tablero Kanban', icon: KanbanSquare },
    { id: 'tickets', label: 'Sistema de Tickets', icon: Ticket },
    { id: 'backlog', label: 'Todas las Tareas', icon: ListTodo },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 flex-shrink-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 text-white">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
          <CheckSquare className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">TaskFlow</span>
      </div>

      {/* Primary Action */}
      <div className="px-4 mb-6">
        <button 
          onClick={onAddClick}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          Nueva Tarea
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Menu Principal
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-blue-400" : "text-slate-400")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => onViewChange('settings')}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors",
            currentView === 'settings'
              ? "bg-blue-600/10 text-blue-400"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          )}
        >
          <Settings className="h-5 w-5" />
          Configuración
        </button>
      </div>
    </div>
  );
}
