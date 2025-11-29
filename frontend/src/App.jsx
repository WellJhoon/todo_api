import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/services/api';
import { AddTodo } from '@/components/AddTodo';
import { TodoItem } from '@/components/TodoItem';
import { CheckCircle2, Loader2, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Detectar preferencia de tema del sistema
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    fetchTodos();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (newTodo) => {
    try {
      const created = await createTodo(newTodo);
      setTodos([...todos, created]);
    } catch (err) {
      console.error('Error al crear tarea:', err);
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const updated = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
    }
  };

  const handleEditTodo = async (id, updatedTodo) => {
    try {
      const updated = await updateTodo(id, updatedTodo);
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Error al editar tarea:', err);
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Header con efecto glassmorphism */}
        <div className="glass dark:glass-dark rounded-3xl border border-white/20 dark:border-white/10 ios-shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 ios-shadow">
                <CheckCircle2 className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Mis Tareas
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {completedCount} de {totalCount} completadas
                </p>
              </div>
            </div>

            {/* Toggle tema */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center h-10 w-10 rounded-full glass dark:glass-dark border border-white/20 dark:border-white/10 transition-all duration-200 hover:scale-110"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600" />
              )}
            </button>
          </div>

          {/* Barra de progreso */}
          {totalCount > 0 && (
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 rounded-full"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Contenedor principal con glassmorphism */}
        <div className="glass dark:glass-dark rounded-3xl border border-white/20 dark:border-white/10 ios-shadow-lg p-6 sm:p-8">
          <AddTodo onAdd={handleAddTodo} />

          {error && (
            <div className="p-4 mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Cargando tareas...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-muted-foreground text-center">
                    No hay tareas pendientes<br />
                    <span className="text-sm">¡Empieza añadiendo una!</span>
                  </p>
                </div>
              ) : (
                todos.map((todo) => (
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

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="glass dark:glass-dark rounded-2xl border border-white/20 dark:border-white/10 px-6 py-3 inline-flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <a 
              href="https://fastapi.tiangolo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline transition-colors"
            >
              FastAPI
            </a>
            <span className="text-xs text-muted-foreground">+</span>
            <a 
              href="https://react.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              React
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
