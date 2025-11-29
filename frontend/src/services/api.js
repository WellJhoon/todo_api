import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

export const getTodos = async () => {
  const response = await api.get("/todos/");
  return response.data;
};

export const createTodo = async (todo) => {
  const response = await api.post("/todos/", todo);
  return response.data;
};

export const updateTodo = async (id, todo) => {
  const response = await api.put(`/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

export default api;
