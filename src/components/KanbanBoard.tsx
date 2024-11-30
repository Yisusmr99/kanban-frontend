import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from './Column';
import { SortableItem } from './SortableItem';
import Swal from 'sweetalert2';

type Task = {
  id: string;
  title: string;
  description?: string;
};

type Column = {
  id: string;
  name: string;
  tasks: Task[];
};

const KanbanBoard = ({ projectId }: { projectId: number }) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', name: 'To Do', tasks: [] },
    { id: '2', name: 'In Progress', tasks: [] },
    { id: '3', name: 'Done', tasks: [] },
  ]);

  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cards/project/${projectId}`);
        const data = await response.json();

        if (response.ok) {
          const tasks = data.data;

          const updatedColumns = columns.map((col) => ({
            ...col,
            tasks: tasks.filter((task: any) => `${task.column?.id}` === col.id),
          }));
          console.log(updatedColumns, 'las columnas');

          setColumns(updatedColumns);
        } else {
          console.log('Error fetching tasks:', data.message);
        }
      } catch (error) {
        console.log('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const handleAddTask = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Create New Task',
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Task Title" required>
        <textarea id="swal-description" class="swal2-textarea" placeholder="Task Description"></textarea>
        <input id="swal-responsible" class="swal2-input" placeholder="Responsible User ID (optional)">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value.trim();
        const description = (document.getElementById('swal-description') as HTMLTextAreaElement).value.trim();
        const responsible = (document.getElementById('swal-responsible') as HTMLInputElement).value.trim();

        if (!title) {
          Swal.showValidationMessage('Task title is required');
          return;
        }

        return {
          title,
          description,
          responsible: responsible ? parseInt(responsible, 10) : null,
        };
      },
    });

    if (formValues) {
      try {
        const response = await fetch('http://localhost:3000/cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            columnId: 1, // Assigns to the "To Do" column
            projectId,
            title: formValues.title,
            description: formValues.description || undefined,
            responsibleId: formValues.responsible || undefined,
          }),
        });

        if (response.ok) {
          Swal.fire('Success', 'Task created successfully!', 'success');

          const data = await response.json();
          const newTask = data.data;

          setColumns((prevColumns) =>
            prevColumns.map((col) =>
              col.id === '1'
                ? { ...col, tasks: [...col.tasks, newTask] }
                : col
            )
          );
        } else {
          const data = await response.json();
          Swal.fire('Error', data.message || 'Failed to create task', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred while creating the task', 'error');
      }
    }
  };

  const handleDragEnd = async ({ active, over }: { active: any; over: any }) => {
    if (!over || active.id === over.id) {
      return;
    }
  
    // Encontrar las columnas de origen y destino
    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === active.id)
    );
    const targetColumn = columns.find((col) => col.id === over.id);
  
    if (!sourceColumn || !targetColumn) {
      return;
    }
  
    // Encontrar la tarea activa
    const activeTask = sourceColumn.tasks.find((task) => task.id === active.id);
  
    if (!activeTask) {
      return;
    }
  
    // Actualizar las tareas en las columnas de origen y destino
    const updatedSourceTasks = sourceColumn.tasks.filter((task) => task.id !== active.id);
    const updatedTargetTasks = [...targetColumn.tasks, activeTask];
  
    try {
      // Actualizar en el backend
      await fetch(`http://localhost:3000/cards/${active.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          columnId: parseInt(targetColumn.id), // Asegúrate de que `id` sea único y válido
        }),
      });
  
      // Actualizar el estado local después de una respuesta exitosa
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
      console.error('Error updating task:', error);
    }
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
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
      <div className="grid grid-cols-3 gap-4 p-6 ">
        {columns.map((column) => (
          <Column key={column.id} id={column.id}>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md h-[45rem] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{column.name}</h2>
                {column.id === '1' && (
                  <button
                    onClick={handleAddTask}
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
                  <SortableItem key={task.id} id={task.id}>
                    {task.title}
                  </SortableItem>
                ))}
              </SortableContext>
            </div>
          </Column>
        ))}
      </div>
      <DragOverlay>
        {activeTask && <div className="p-3 bg-white rounded-md shadow">{activeTask.title}</div>}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;