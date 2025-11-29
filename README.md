# Todo API con FastAPI

Esta es una API RESTful simple para gestionar una lista de tareas (To-Do List), construida con Python y FastAPI. Este proyecto sirve como backend para una futura aplicación de React.

## Tecnologías

*   **Python 3.10+**
*   **FastAPI**: Framework web moderno y rápido.
*   **SQLAlchemy**: ORM para la base de datos.
*   **SQLite**: Base de datos ligera (archivo local `todos.db`).
*   **Pydantic**: Validación de datos.

## Estructura del Proyecto

El proyecto sigue una estructura modular y escalable:

```
todo_api/
├── app/                # Backend (FastAPI)
│   ├── api/            # Endpoints de la API
│   ├── core/           # Configuración general
│   ├── crud/           # Operaciones de Base de Datos
│   ├── db/             # Conexión y sesión de DB
│   ├── models/         # Modelos SQLAlchemy
│   ├── schemas/        # Esquemas Pydantic
│   └── main.py         # Punto de entrada
├── frontend/           # Frontend (React + Vite)
│   ├── src/            # Código fuente React
│   ├── public/         # Archivos estáticos
│   └── package.json    # Dependencias Node.js
├── requirements.txt    # Dependencias Python
└── README.md
```

## Instalación y Ejecución

### 1. Clonar el repositorio (si aplica) o descargar el código

### 2. Crear un entorno virtual (Opcional pero recomendado)

```bash
# Windows
python -m venv .venv
.\.venv\Scripts\Activate

# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Ejecutar el servidor

Desde la carpeta raíz del proyecto (`todo_api`):

```bash
# Windows
py -m uvicorn app.main:app --reload

# Linux/Mac
uvicorn app.main:app --reload
```

### 5. Ejecutar el Frontend

En una nueva terminal, navega a la carpeta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

La aplicación web estará disponible en `http://localhost:5173`.

El servidor iniciará en `http://127.0.0.1:8000`.

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
