import { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/services/api";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError("Error connecting to the Nexus network.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (newTodo) => {
    try {
      const created = await createTodo(newTodo);
      setTodos([...todos, created]);
      return true;
    } catch (err) {
      console.error("Error creating protocol:", err);
      setError("Failed to initialize protocol.");
      return false;
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const updated = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const editTodo = async (id, updates) => {
    try {
      const todoToUpdate = todos.find((t) => t.id === id);
      if (!todoToUpdate) return;

      // Handle both old signature (id, title) and new (id, object)
      const actualUpdates =
        typeof updates === "string" ? { title: updates } : updates;

      const updated = await updateTodo(id, {
        ...todoToUpdate,
        ...actualUpdates,
      });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
      return true;
    } catch (err) {
      console.error("Error modifying protocol:", err);
      return false;
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error terminating protocol:", err);
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    refresh: fetchTodos,
  };
}
