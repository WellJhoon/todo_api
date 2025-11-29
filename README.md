# Todo API con FastAPI

Esta es una API RESTful simple para gestionar una lista de tareas (To-Do List), construida con Python y FastAPI. Este proyecto sirve como backend para una futura aplicación de React.

## Tecnologías

*   **Python 3.10+**
*   **FastAPI**: Framework web moderno y rápido.
# Todo API con FastAPI

Esta es una API RESTful simple para gestionar una lista de tareas (To-Do List), construida con Python y FastAPI. Este proyecto sirve como backend para una futura aplicación de React.

## Tecnologías

*   **Python 3.10+**
*   **FastAPI**: Framework web moderno y rápido.
*   **SQLAlchemy**: ORM para la base de datos.
*   **SQLite**: Base de datos ligera (archivo local `todos.db`).
*   **Pydantic**: Validación de datos.

## Estructura del Proyecto

El proyecto está organizado como un monorepo con backend y frontend separados:

```
todo_api/
├── backend/            # API REST (FastAPI)
│   ├── app/            # Código fuente Python
│   ├── requirements.txt
│   └── todos.db        # Base de datos SQLite
├── frontend/           # Cliente Web (React + Vite)
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Instalación y Ejecución

### 1. Backend (Python/FastAPI)

Navega a la carpeta `backend`:

```bash
cd backend
```

Activa tu entorno virtual (si está en la raíz superior `../.venv`) e instala dependencias:

```bash
pip install -r requirements.txt
```

Ejecuta el servidor:

```bash
# Windows
py -m uvicorn app.main:app --reload

# Linux/Mac
uvicorn app.main:app --reload
```

El backend correrá en `http://127.0.0.1:8000`.

### 2. Frontend (React)

Navega a la carpeta `frontend`:

```bash
cd ../frontend
# o desde la raíz: cd frontend
```

Instala dependencias y ejecuta:

```bash
npm install
npm run dev
```

La aplicación web estará disponible en `http://localhost:5173`.

## Documentación de la API

FastAPI genera documentación automática e interactiva:

*   **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) - Aquí puedes probar los endpoints directamente.
*   **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Endpoints Principales

La API está prefijada con `/api/v1`.

*   `GET /api/v1/todos/`: Obtener todas las tareas.
*   `POST /api/v1/todos/`: Crear una nueva tarea.
*   `GET /api/v1/todos/{id}`: Obtener una tarea por ID.
*   `PUT /api/v1/todos/{id}`: Actualizar una tarea.
*   `DELETE /api/v1/todos/{id}`: Eliminar una tarea.
