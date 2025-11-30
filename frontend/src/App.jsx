import React from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { MainApp } from '@/components/MainApp';
import { LoginView } from '@/components/LoginView';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return user ? <MainApp /> : <LoginView />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
