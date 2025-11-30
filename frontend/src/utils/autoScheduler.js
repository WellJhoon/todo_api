/**
 * Sistema de Planificación Automática de Tareas
 * Organiza y asigna fechas/horas a las tareas de manera inteligente
 */

// Configuración del horario laboral
const WORK_START_HOUR = 9; // 9 AM
const WORK_END_HOUR = 18; // 6 PM
const BREAK_DURATION = 15; // 15 minutos de descanso entre tareas

/**
 * Convierte una fecha/hora a un objeto Date
 */
function parseDateTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr);
}

/**
 * Formatea una fecha al formato ISO que espera el backend
 */
function formatDateTime(date) {
  return date.toISOString();
}

/**
 * Obtiene el inicio del día laboral más cercano disponible
 */
function getNextWorkSlot(fromDate = new Date()) {
  const date = new Date(fromDate);

  // Si es fin de semana, mover al lunes
  const day = date.getDay();
  if (day === 0) {
    // Domingo
    date.setDate(date.getDate() + 1);
  } else if (day === 6) {
    // Sábado
    date.setDate(date.getDate() + 2);
  }

  // Establecer hora de inicio laboral
  date.setHours(WORK_START_HOUR, 0, 0, 0);

  // Si ya pasamos la hora laboral hoy, ir al siguiente día
  if (fromDate.getHours() >= WORK_END_HOUR) {
    date.setDate(date.getDate() + 1);
    // Verificar de nuevo si es fin de semana
    const newDay = date.getDay();
    if (newDay === 0) date.setDate(date.getDate() + 1);
    else if (newDay === 6) date.setDate(date.getDate() + 2);
  }

  return date;
}

/**
 * Calcula el fin de una tarea considerando el horario laboral
 */
function calculateEndTime(startTime, durationMinutes) {
  const endTime = new Date(startTime);
  let remainingMinutes = durationMinutes;

  while (remainingMinutes > 0) {
    const currentHour = endTime.getHours();
    const currentMinute = endTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const workEndInMinutes = WORK_END_HOUR * 60;

    // Minutos disponibles hasta el final del día laboral
    const availableMinutes = workEndInMinutes - currentTimeInMinutes;

    if (availableMinutes >= remainingMinutes) {
      // Cabe en el día actual
      endTime.setMinutes(endTime.getMinutes() + remainingMinutes);
      remainingMinutes = 0;
    } else {
      // No cabe, continuar al siguiente día laboral
      remainingMinutes -= availableMinutes;
      endTime.setDate(endTime.getDate() + 1);

      // Saltar fin de semana
      const day = endTime.getDay();
      if (day === 0) endTime.setDate(endTime.getDate() + 1);
      else if (day === 6) endTime.setDate(endTime.getDate() + 2);

      endTime.setHours(WORK_START_HOUR, 0, 0, 0);
    }
  }

  return endTime;
}

/**
 * Ordena las tareas por prioridad y fecha límite
 */
function sortTasks(tasks) {
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  return [...tasks].sort((a, b) => {
    // 1. Primero por prioridad (alta primero)
    const priorityDiff =
      (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
    if (priorityDiff !== 0) return priorityDiff;

    // 2. Luego por fecha límite (más cercana primero)
    const dateA = parseDateTime(a.due_date);
    const dateB = parseDateTime(b.due_date);

    if (dateA && dateB) {
      return dateA - dateB;
    }
    if (dateA) return -1;
    if (dateB) return 1;

    // 3. Finalmente por duración (más cortas primero para quick wins)
    const durationA = a.duration_minutes || a.estimated_minutes || 30;
    const durationB = b.duration_minutes || b.estimated_minutes || 30;
    return durationA - durationB;
  });
}

/**
 * Planifica automáticamente todas las tareas pendientes
 * @param {Array} todos - Array de tareas
 * @param {Object} options - Opciones de configuración
 * @returns {Array} - Array de tareas con fechas asignadas
 */
export function autoScheduleTasks(todos, options = {}) {
  const {
    startFrom = new Date(),
    includeScheduled = false, // Si true, reorganiza todas; si false, solo las sin fecha
    respectDeadlines = true,
  } = options;

  // Filtrar tareas pendientes (no completadas)
  const pendingTasks = todos.filter((todo) => !todo.completed);

  // Separar tareas que ya tienen fecha y las que no
  const unscheduledTasks = pendingTasks.filter(
    (todo) => includeScheduled || !todo.due_date
  );

  if (unscheduledTasks.length === 0) {
    return todos; // No hay nada que planificar
  }

  // Ordenar tareas por prioridad
  const sortedTasks = sortTasks(unscheduledTasks);

  // Obtener el siguiente slot disponible
  let currentSlot = getNextWorkSlot(startFrom);

  // Asignar fechas a las tareas
  const scheduledTasks = sortedTasks.map((task) => {
    const duration = task.duration_minutes || task.estimated_minutes || 30;

    // Si la tarea tiene una fecha límite específica y la respetamos
    if (respectDeadlines && task.due_date) {
      const deadline = parseDateTime(task.due_date);
      // Solo actualizar la hora, mantener el día de la deadline
      const scheduledDate = new Date(deadline);
      scheduledDate.setHours(
        currentSlot.getHours(),
        currentSlot.getMinutes(),
        0,
        0
      );

      return {
        ...task,
        due_date: formatDateTime(scheduledDate),
        duration_minutes: duration,
      };
    }

    // Asignar la tarea al slot actual
    const startTime = new Date(currentSlot);
    const endTime = calculateEndTime(startTime, duration);

    // El siguiente slot empieza después de esta tarea + break
    currentSlot = new Date(endTime);
    currentSlot.setMinutes(currentSlot.getMinutes() + BREAK_DURATION);

    // Si pasamos el horario laboral, mover al siguiente día
    if (currentSlot.getHours() >= WORK_END_HOUR) {
      currentSlot = getNextWorkSlot(currentSlot);
    }

    return {
      ...task,
      due_date: formatDateTime(startTime),
      duration_minutes: duration,
    };
  });

  // Crear un mapa para actualizar las tareas
  const updatedTasksMap = new Map(
    scheduledTasks.map((task) => [task.id, task])
  );

  // Retornar todas las tareas con las actualizadas
  return todos.map((todo) =>
    updatedTasksMap.has(todo.id) ? updatedTasksMap.get(todo.id) : todo
  );
}

/**
 * Ajusta automáticamente las tareas cuando se agrega una nueva
 * @param {Array} todos - Array de todas las tareas
 * @param {Object} newTask - La nueva tarea agregada
 * @returns {Array} - Tareas reajustadas
 */
export function autoAdjustOnAdd(todos, newTask) {
  // Si la nueva tarea tiene alta prioridad, reorganizar todo
  if (newTask.priority === "high") {
    return autoScheduleTasks(todos, {
      includeScheduled: true,
      startFrom: new Date(),
    });
  }

  // Si no tiene fecha asignada, asignarle una
  if (!newTask.due_date) {
    const scheduled = autoScheduleTasks([newTask], {
      startFrom: new Date(),
    });

    return todos.map((todo) => (todo.id === newTask.id ? scheduled[0] : todo));
  }

  return todos;
}

/**
 * Ajusta automáticamente las tareas cuando se completa una
 * @param {Array} todos - Array de todas las tareas
 * @param {Object} completedTask - La tarea completada
 * @returns {Array} - Tareas reajustadas
 */
export function autoAdjustOnComplete(todos, completedTask) {
  // Adelantar tareas pendientes que estaban después de esta
  const completedDate = parseDateTime(completedTask.due_date);

  if (!completedDate) return todos;

  // Obtener tareas pendientes posteriores a esta
  const laterTasks = todos.filter((todo) => {
    if (todo.completed || !todo.due_date) return false;
    const todoDate = parseDateTime(todo.due_date);
    return todoDate > completedDate;
  });

  if (laterTasks.length === 0) return todos;

  // Reorganizar esas tareas desde ahora
  return autoScheduleTasks(todos, {
    includeScheduled: true,
    startFrom: new Date(),
  });
}

/**
 * Calcula estadísticas de la planificación
 */
export function calculateScheduleStats(todos) {
  const pending = todos.filter((t) => !t.completed);
  const scheduled = pending.filter((t) => t.due_date);
  const unscheduled = pending.filter((t) => !t.due_date);

  const totalMinutes = pending.reduce(
    (sum, t) => sum + (t.duration_minutes || t.estimated_minutes || 0),
    0
  );

  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const totalDays = Math.ceil(
    totalMinutes / (60 * (WORK_END_HOUR - WORK_START_HOUR))
  );

  return {
    totalTasks: pending.length,
    scheduledTasks: scheduled.length,
    unscheduledTasks: unscheduled.length,
    totalHours,
    totalDays,
    estimatedCompletionDate:
      totalDays > 0 ? calculateEndTime(new Date(), totalMinutes) : null,
  };
}
