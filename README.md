# TaskMaster Pro - Sistema de Gestión de Proyectos

Una aplicación moderna y completa para la gestión de tareas y proyectos, construida con **FastAPI** (Backend) y **React + Vite** (Frontend). Incluye autenticación segura, tableros Kanban, sistema de tickets y perfiles de usuario personalizables.

![TaskMaster Pro Screenshot](https://via.placeholder.com/800x400?text=TaskMaster+Pro+Preview)

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad
*   **Registro y Login Seguro**: Sistema completo con hashing de contraseñas (Bcrypt) y tokens JWT.
*   **Gestión de Sesiones**: Persistencia de sesión y protección de rutas privadas.
*   **Privacidad de Datos**: Cada usuario tiene su propio espacio de trabajo aislado; las tareas son privadas.

### 👤 Perfil de Usuario
*   **Avatar Personalizado**: Subida de imágenes de perfil con almacenamiento local.
*   **Datos de Usuario**: Gestión de nombre, email y preferencias.

### 📊 Gestión de Tareas Avanzada
*   **Dashboard Interactivo**: Vista general con estadísticas, gráficos de productividad y KPIs.
*   **Tablero Kanban**: Gestión visual de tareas con Drag & Drop (Por hacer, En progreso, Completado).
*   **Sistema de Tickets**: Interfaz especializada para gestión de incidencias (Bugs, Features, Tasks) con asignación de usuarios.
*   **Backlog**: Vista de lista clásica para gestión rápida.

### 🎨 Experiencia de Usuario (UX/UI)
*   **Diseño Moderno**: Interfaz limpia estilo SaaS, inspirada en herramientas profesionales.
*   **Modo Oscuro**: Soporte nativo para temas claro y oscuro.
*   **Auto-Schedule**: Algoritmo inteligente que sugiere prioridades y fechas.

---

## 🛠️ Tecnologías Utilizadas

### Backend (Python)
*   **FastAPI**: Framework de alto rendimiento para APIs.
*   **SQLAlchemy**: ORM para gestión de base de datos SQLite.
*   **Pydantic**: Validación de datos robusta.
*   **JWT & Passlib**: Seguridad y autenticación.
*   **Python-Multipart**: Manejo de subida de archivos.

### Frontend (React)
*   **React 18 + Vite**: Desarrollo rápido y optimizado.
*   **Tailwind CSS**: Estilizado moderno y responsivo.
*   **Lucide React**: Iconografía consistente.
*   **Axios**: Comunicación con la API.
*   **Context API**: Gestión de estado global (Auth).

---

## 📂 Estructura del Proyecto

```
todo_api/
├── backend/                # Servidor API
│   ├── app/
│   │   ├── api/            # Endpoints (v1)
│   │   ├── core/           # Configuración y Seguridad
│   │   ├── crud/           # Operaciones de Base de Datos
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── schemas/        # Esquemas Pydantic
│   │   └── static/         # Archivos subidos (imágenes)
│   ├── todos.db            # Base de datos SQLite
│   └── requirements.txt
│
├── frontend/               # Cliente Web
│   ├── src/
│   │   ├── components/     # Componentes Reutilizables (Kanban, Sidebar, etc.)
│   │   ├── context/        # AuthContext
│   │   ├── services/       # Llamadas a API
│   │   └── App.jsx         # Componente Principal
│   └── package.json
└── README.md
```

---

## ⚡ Instalación y Ejecución

### 1. Configurar el Backend

```bash
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv
# Windows: .\venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
py -m uvicorn app.main:app --reload
# El servidor correrá en http://127.0.0.1:8000
```

### 2. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar aplicación
npm run dev
# La app correrá en http://localhost:5173
```

---

## 📚 Documentación de la API

Una vez iniciado el backend, puedes acceder a la documentación interactiva:

*   **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
*   **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Endpoints Clave

*   **Auth**:
    *   `POST /api/v1/register`: Registrar nuevo usuario.
    *   `POST /api/v1/login/access-token`: Obtener token JWT.
*   **Usuarios**:
    *   `GET /api/v1/users/me`: Obtener perfil actual.
    *   `POST /api/v1/users/me/image`: Subir foto de perfil.
*   **Tareas**:
    *   `GET /api/v1/todos/`: Listar tareas del usuario.
    *   `POST /api/v1/todos/`: Crear tarea.
    *   `PUT /api/v1/todos/{id}`: Actualizar tarea (estado, info).

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Siéntete libre de abrir issues o enviar pull requests para mejorar el sistema.
