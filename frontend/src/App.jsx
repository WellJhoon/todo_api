import React from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Layout } from '@/components/Layout';
import { AddTodo } from '@/components/AddTodo';
import { TodoList } from '@/components/TodoList';

function App() {
  const { todos, loading, error, addTodo, toggleTodo, editTodo, removeTodo } = useTodos();

  return (
    <Layout>
      <AddTodo onAdd={addTodo} />
      <TodoList 
        todos={todos} 
        loading={loading} 
        error={error} 
        onToggle={toggleTodo} 
        onDelete={removeTodo}
        onEdit={editTodo}
      />
    </Layout>
  );
}

export default App;
