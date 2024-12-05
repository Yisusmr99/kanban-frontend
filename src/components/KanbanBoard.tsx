import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, DragOverlay, rectIntersection } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from './Column';
import { SortableItem } from './SortableItem';
import AddTaskModal from './AddTaskModal'; // Importamos el modal para agregar tareas
import TaskDetailsModal from './TaskDetailsModal'; // Importamos el modal para detalles de tarea
import EditTaskModal from './EditTaskModal';
import { ApiService } from '@/services/api';

type Task = {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  responsible: {
    id: number;
    username: string;
    full_name: string;
  }
  project_id: number;
};

type Column = {
  id: string;
  name: string;
  tasks: Task[];
};

type Collaborator = {
  id: number;
  username: string;
};

const KanbanBoard = ({ projectId, collaborators }: { projectId: number; collaborators: Collaborator[] }) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', name: 'To Do', tasks: [] },
    { id: '2', name: 'In Progress', tasks: [] },
    { id: '3', name: 'Done', tasks: [] },
  ]);

  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Para el modal de detalles
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null); // Columna donde se agregará la tarea
  const [showEditTaskModal, setShowEditTaskModal] = useState(false); // Estado para mostrar el modal de editar tarea
  const [selectedTaskEdit, setSelectedTaskEdit] = useState<Task | null>(null); // Tarea seleccionada para editar

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await ApiService.getTasks(projectId);
        const tasks = response.data;
        const updatedColumns = columns.map((col) => ({
          ...col,
          tasks: tasks.filter((task: any) => `${task.column?.id}` === col.id),
        }));
        setColumns(updatedColumns);
      } catch (error) {
        console.log('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setShowAddTaskModal(true); // Mostrar el modal de agregar tarea
  };

  const handleTaskAdded = (newTask: any) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === selectedColumnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
    setShowAddTaskModal(false); // Ocultar el modal después de agregar la tarea
  };

  const handleEditTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setShowEditTaskModal(true); // Mostrar el modal de editar tarea
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        // Verifica si la columna contiene la tarea actualizada
        if (column.tasks.some((task) => task.id === updatedTask.id)) {
          // Actualiza la tarea dentro de la columna
          const updatedTasks = column.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );
          return { ...column, tasks: updatedTasks };
        }
        return column;
      })
    );
    setShowEditTaskModal(false); // Cierra el modal después de actualizar
  };

  const handleDragEnd = async ({ active, over }: { active: any; over: any }) => {
    if (!over || active.id === over.id) {
      return;
    }
  
    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === active.id)
    );
    const targetColumn = columns.find((col) => col.id === over.id || col.tasks.some((task) => task.id === over.id));
  
    if (!sourceColumn || !targetColumn) {
      return;
    }
  
    const activeTask = sourceColumn.tasks.find((task) => task.id === active.id);
  
    if (!activeTask) {
      return;
    }
  
    // Obtener la posición exacta en la columna destino
    const targetIndex = targetColumn.tasks.findIndex((task) => task.id === over.id);
  
    const updatedSourceTasks = sourceColumn.tasks.filter((task) => task.id !== active.id);
    const updatedTargetTasks = [
      ...targetColumn.tasks.slice(0, targetIndex),
      activeTask,
      ...targetColumn.tasks.slice(targetIndex),
    ];
  
    try {
      const data = JSON.stringify({ columnId: parseInt(targetColumn.id) });
      await ApiService.updateStateTask(parseInt(active.id), data);
  
      setColumns((prevColumns) =>
        prevColumns.map((col) => {
          if (col.id === sourceColumn.id) {
            return { ...col, tasks: updatedSourceTasks };
          }
          if (col.id === targetColumn.id) {
            return { ...col, tasks: updatedTargetTasks };
          }
          return col;
        })
      );
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={({ active }) => {
        const task = columns
          .flatMap((col) => col.tasks)
          .find((task) => task.id === active.id);
        setActiveTask(task || null);
      }}
      onDragEnd={(event) => {
        setActiveTask(null);
        handleDragEnd(event);
      }}
    >
      <div className="grid grid-cols-3 gap-4 p-6">
        {columns.map((column) => (
          <Column key={column.id} id={column.id}>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[46rem] h-auto flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{column.name}</h2>
                {column.id === '1' && (
                  <button
                    onClick={() => handleAddTask(column.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md shadow hover:bg-blue-400"
                  >
                    + Add Task
                  </button>
                )}
              </div>
              <SortableContext
                items={column.tasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {column.tasks.map((task) => (
                  <div key={task.id} className="relative">
                    <SortableItem id={task.id}>
                      <div className="font-medium text-gray-800">{task.title}</div>
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(task.created_at)}
                      </div>
                      {task.responsible && (
                        <div className="text-sm text-gray-500">
                          Assigned to: <span className="font-medium">{task.responsible.full_name}</span>
                        </div>
                      )}
                    </SortableItem>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded shadow hover:bg-blue-400"
                      >
                        Details
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <button
                        onClick={() => {
                          handleEditTask(column.id);
                          setSelectedTaskEdit(task);
                        }}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded shadow hover:bg-green-400"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </SortableContext>
            </div>
          </Column>
        ))}
      </div>
      <DragOverlay>
        {activeTask && <div className="p-3 bg-white rounded-md shadow">{activeTask.title}</div>}
      </DragOverlay>
      {showAddTaskModal && selectedColumnId && (
        <AddTaskModal
          projectId={projectId}
          columnId={selectedColumnId}
          collaborators={collaborators}
          onClose={() => setShowAddTaskModal(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}
      {selectedTask &&(
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      {
        showEditTaskModal && selectedColumnId && selectedTaskEdit && (
          <EditTaskModal
            onClose={() => setShowEditTaskModal(false)}
            onTaskUpdated={handleTaskUpdated}
            task={selectedTaskEdit}
            collaborators={collaborators}
          />
        )
      }
    </DndContext>
  );
};

export default KanbanBoard;