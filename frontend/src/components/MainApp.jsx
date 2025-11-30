import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/services/api';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TicketSystem } from '@/components/TicketSystem';
import { SettingsView } from '@/components/SettingsView';
import { TodoItem } from '@/components/TodoItem';
import { AddTodo } from '@/components/AddTodo';
import { Loader2, User } from 'lucide-react';
import { 
  autoScheduleTasks, 
  autoAdjustOnAdd, 
  autoAdjustOnComplete 
} from '@/utils/autoScheduler';
import { useAuth } from '@/context/AuthContext';
import { getImageUrl } from '@/config';

export function MainApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Detectar preferencia de tema del sistema
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    fetchTodos();
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (newTodo) => {
    try {
      const created = await createTodo(newTodo);
      const updatedTodos = [...todos, created];
      
      // Auto-schedule logic
      if (created.priority === 'high' || !created.due_date) {
        const adjusted = autoAdjustOnAdd(updatedTodos, created);
        setTodos(adjusted);
      } else {
        setTodos(updatedTodos);
      }
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const updated = await updateTodo(todo.id, { ...todo, completed: !todo.completed });
      const updatedTodos = todos.map(t => t.id === todo.id ? updated : t);
      
      if (updated.completed) {
        const adjusted = autoAdjustOnComplete(updatedTodos, updated);
        setTodos(adjusted);
      } else {
        setTodos(updatedTodos);
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleEditTodo = async (id, updates) => {
    try {
      const updated = await updateTodo(id, updates);
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error('Error editing task:', err);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      // Optimistic update
      const updatedTask = { ...task, ...newStatus };
      setTodos(todos.map(t => t.id === task.id ? updatedTask : t));

      // Backend update - Enviar el objeto COMPLETO, no solo los cambios
      await updateTodo(task.id, updatedTask);
      
      // Si se completó, aplicar auto-schedule si es necesario
      if (newStatus.completed && !task.completed) {
        const updatedTodos = todos.map(t => t.id === task.id ? updatedTask : t);
        const adjusted = autoAdjustOnComplete(updatedTodos, updatedTask);
        setTodos(adjusted);
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      // Revert on error
      fetchTodos();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onAddClick={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white capitalize">
            {currentView === 'backlog' ? 'Todas las Tareas' : 
             currentView === 'kanban' ? 'Tablero Kanban' : 
             currentView === 'tickets' ? 'Sistema de Tickets' :
             currentView === 'settings' ? 'Configuración' : 'Dashboard General'}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.name || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={getImageUrl(user.avatar)} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-slate-400" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
          {currentView === 'dashboard' && (
            <div className="animate-in fade-in duration-500">
              <DashboardView todos={todos} />
            </div>
          )}

          {currentView === 'kanban' && (
            <div className="h-full animate-in fade-in duration-500">
              <KanbanBoard 
                todos={todos} 
                onStatusChange={handleStatusChange}
                onEdit={(id) => {
                  const task = todos.find(t => t.id === id);
                  if (task) handleToggleTodo(task);
                }}
                onDelete={handleDeleteTodo}
              />
            </div>
          )}

          {currentView === 'tickets' && (
            <div className="animate-in fade-in duration-500">
              <TicketSystem 
                todos={todos}
                onStatusChange={(id, updates) => {
                  const task = todos.find(t => t.id === id);
                  if (task) handleStatusChange(task, updates);
                }}
                onEdit={(id) => {
                  const task = todos.find(t => t.id === id);
                  if (task) handleToggleTodo(task);
                }}
                onAdd={() => setIsAddModalOpen(true)}
              />
            </div>
          )}

          {currentView === 'settings' && (
            <SettingsView darkMode={darkMode} toggleTheme={toggleTheme} />
          )}

          {currentView === 'backlog' && (
            <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-500">
              {todos.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No hay tareas. ¡Crea una nueva!
                </div>
              ) : (
                todos.map(todo => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEdit={handleEditTodo}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Minimalist Add Task Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800 relative">
            
            {/* Close Button Absolute */}
            <button 
              onClick={() => setIsAddModalOpen(false)} 
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all z-10"
            >
              ✕
            </button>

            <div className="p-8 pt-10">
              <AddTodo onAdd={handleAddTodo} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
