import { ApiService } from "@/services/api";
import React, { useState } from "react";
import Swal from "sweetalert2";

type EditTaskModalProps = {
    onClose: () => void;
    onTaskUpdated: (updatedTask: any) => void;
    task: any;
    collaborators: { id: number; username: string }[];
}


const EditTaskModal: React.FC<EditTaskModalProps> = ({ onClose, onTaskUpdated, task, collaborators }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [responsibleId, setResponsibleId] = useState(task.responsible?.id);
    
    const handleUpdateTask = async () => {
        if (!title.trim()) {
            Swal.fire('Task title is required.');
            return;
        }
        try {
            const data = {
                columnId: task.column.id,
                projectId: task.projectId,
                title,
                description: description || undefined,
                responsibleId: responsibleId || undefined,
            };
            const response = await ApiService.updateTask(task.id, data);
            Swal.fire('Task updated successfully!', '', 'success');
            onTaskUpdated(response.data); // Notifica al KanbanBoard de la nueva tarea
            onClose(); // Cierra el modal
        } catch (error) {
            console.log('Error adding task:', error);
            Swal.fire('An error occurred while adding the task.');
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-lg font-semibold mb-4">Add Task</h2>
                <div className="relative mb-4">
                    <label htmlFor="title" 
                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task Title"
                        className="w-full p-2 border rounded-md mb-2"
                    />
                </div>

                <div className="relative mb-2">
                    <label htmlFor="title" 
                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900"
                    >
                        Task Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task Description"
                        className="w-full p-2 border rounded-md mb-2"
                    ></textarea>
                </div>
                
                <div className="relative">
                    <label htmlFor="title" 
                        className="absolute -top-2 left-2 inline-block rounded-lg bg-white px-1 text-xs font-medium text-gray-900"
                    >
                        User Responsible
                    </label>
                    <select
                        value={responsibleId || ''}
                        onChange={(e) => setResponsibleId(Number(e.target.value) || null)}
                        className="w-full p-2 border rounded-md mb-4"
                    >
                        <option value="">Select User</option>
                        {collaborators.map((collaborator) => (
                            <option key={collaborator.id} value={collaborator.id}>
                            {collaborator.username}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleUpdateTask}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400 mb-2"
                >
                    Update Task
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
};

export default EditTaskModal;