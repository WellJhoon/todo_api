import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getUser, uploadProfileImage } from '@/services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await loadUser();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('token', data.access_token);
      await loadUser();
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.response?.data?.detail || "Error al iniciar sesión" };
    }
  };

  const register = async (name, email, password) => {
    try {
      await apiRegister(name, email, password);
      return await login(email, password);
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: error.response?.data?.detail || "Error al registrarse" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfileImage = async (file) => {
    try {
      const updatedUser = await uploadProfileImage(file);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error("Error uploading image:", error);
      return { success: false, error: "Error al subir la imagen" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfileImage, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
