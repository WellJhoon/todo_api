import React, { useState, useEffect } from 'react';
import { User, Calendar, Flag, MessageSquare, Plus, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUsers } from '@/services/userApi';

export function TicketSystem({ todos, onStatusChange, onEdit, onAdd }) {
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback users if API fails
        setUsers([
          { id: 1, name: 'Juan Pérez', avatar: 'JP', color: 'bg-blue-500' },
          { id: 2, name: 'María García', avatar: 'MG', color: 'bg-green-500' },
          { id: 3, name: 'Carlos López', avatar: 'CL', color: 'bg-purple-500' },
          { id: 4, name: 'Ana Martín', avatar: 'AM', color: 'bg-pink-500' },
        ]);
      }
    };
    fetchUsers();
  }, []);

  const ticketTypes = {
    bug: { label: 'Bug', color: 'bg-red-100 text-red-700 border-red-200', icon: '🐛' },
    feature: { label: 'Feature', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '✨' },
    task: { label: 'Task', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '📋' },
    improvement: { label: 'Improvement', color: 'bg-green-100 text-green-700 border-green-200', icon: '🚀' }
  };

  const statusConfig = {
    todo: { label: 'To Do', color: 'bg-slate-100 text-slate-700' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    done: { label: 'Done', color: 'bg-green-100 text-green-700' }
  };

  // Filtrar tickets
  const filteredTickets = todos.filter(ticket => {
    const matchesAssignee = selectedAssignee === 'all' || ticket.assignee_id == selectedAssignee;
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAssignee && matchesStatus && matchesSearch;
  });

  const getAssigneeInfo = (assigneeId) => {
    return users.find(u => u.id == assigneeId) || { name: 'Sin asignar', avatar: '?', color: 'bg-gray-400' };
  };

  const handleAssigneeChange = (ticketId, assigneeId) => {
    onStatusChange(ticketId, { assignee_id: assigneeId });
  };

  const handleStatusChange = (ticketId, newStatus) => {
    const updates = newStatus === 'done' 
      ? { status: newStatus, completed: true }
      : { status: newStatus, completed: false };
    onStatusChange(ticketId, updates);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sistema de Tickets</h1>
        </div>
        <button 
          onClick={() => onAdd({ type: 'ticket' })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Crear Ticket
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded bg-transparent text-sm"
          />
        </div>
        
        <select
          value={selectedAssignee}
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded bg-transparent text-sm"
        >
          <option value="all">Todos los asignados</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded bg-transparent text-sm"
        >
          <option value="all">Todos los estados</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Lista de Tickets */}
      <div className="space-y-3">
        {filteredTickets.map(ticket => {
          const assignee = getAssigneeInfo(ticket.assignee_id);
          const ticketType = ticketTypes[ticket.ticket_type] || ticketTypes.task;
          const status = statusConfig[ticket.status] || statusConfig.todo;
          
          return (
            <div
              key={ticket.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onEdit(ticket.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-slate-500">#{ticket.id}</span>
                  <span className={cn("text-xs px-2 py-1 rounded border font-medium", ticketType.color)}>
                    {ticketType.icon} {ticketType.label}
                  </span>
                  <span className={cn("text-xs px-2 py-1 rounded font-medium", status.color)}>
                    {status.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {ticket.priority && (
                    <Flag className={cn("h-4 w-4", 
                      ticket.priority === 'high' ? 'text-red-500' :
                      ticket.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    )} />
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-1">
                {ticket.title}
              </h3>
              
              {ticket.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                  {ticket.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Asignado */}
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <select
                      value={ticket.assignee_id || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleAssigneeChange(ticket.id, e.target.value);
                      }}
                      className="text-sm bg-transparent border-none focus:outline-none cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Sin asignar</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Avatar del asignado */}
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white", assignee.color)}>
                    {assignee.avatar}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Fecha de vencimiento */}
                  {ticket.due_date && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(ticket.due_date).toLocaleDateString()}
                    </div>
                  )}

                  {/* Estado */}
                  <select
                    value={ticket.status || 'todo'}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(ticket.id, e.target.value);
                    }}
                    className="text-xs bg-transparent border-none focus:outline-none cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron tickets</p>
          </div>
        )}
      </div>
    </div>
  );
}