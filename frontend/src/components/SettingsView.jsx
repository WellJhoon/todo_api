import React, { useRef } from 'react';
import { Moon, Sun, Monitor, Bell, Shield, User, HelpCircle, LogOut, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function SettingsView({ darkMode, toggleTheme }) {
  const { user, logout, updateProfileImage } = useAuth();
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await updateProfileImage(file);
    }
  };

  const sections = [
    {
      title: 'Apariencia',
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: 'Tema',
          description: darkMode ? 'Modo Oscuro activado' : 'Modo Claro activado',
          action: (
            <button
              onClick={toggleTheme}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                darkMode ? "bg-blue-600" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  darkMode ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          )
        }
      ]
    },
    {
      title: 'Cuenta',
      items: [
        { icon: Bell, label: 'Notificaciones', description: 'Preferencias de alertas', action: 'Configurar' },
        { icon: Shield, label: 'Privacidad', description: 'Contraseñas y seguridad', action: 'Ver' }
      ]
    },
    {
      title: 'Aplicación',
      items: [
        { icon: HelpCircle, label: 'Ayuda y Soporte', description: 'Preguntas frecuentes', action: 'Abrir' },
        { 
          icon: LogOut, 
          label: 'Cerrar Sesión', 
          description: 'Salir de la cuenta', 
          action: 'Salir', 
          danger: true,
          onClick: logout 
        }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configuración</h1>
        <p className="text-slate-500 dark:text-slate-400">Gestiona tus preferencias y configuración de la cuenta.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex items-center gap-6">
        <div className="relative group">
          <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-600">
            {user?.profile_image ? (
              <img 
                src={`http://127.0.0.1:8000${user.profile_image}`} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-slate-400" />
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition-colors"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {user?.email?.split('@')[0] || 'Usuario'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Cambiar foto de perfil
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-semibold text-slate-900 dark:text-white">{section.title}</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <div key={itemIdx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        item.danger 
                          ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" 
                          : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={cn("font-medium", item.danger ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white")}>
                          {item.label}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                      </div>
                    </div>
                    <div>
                      {typeof item.action === 'string' ? (
                        <button 
                          onClick={item.onClick}
                          className={cn(
                            "text-sm font-medium px-3 py-1.5 rounded-lg transition-colors",
                            item.danger 
                              ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                              : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          )}
                        >
                          {item.action}
                        </button>
                      ) : (
                        item.action
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
