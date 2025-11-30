import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/login/access-token", formData);
  return response.data;
};

export const register = async (email, password) => {
  const response = await api.post("/register", { email, password });
  return response.data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/users/me/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

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
