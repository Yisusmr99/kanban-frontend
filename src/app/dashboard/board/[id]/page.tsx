'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import KanbanBoard from '@/components/KanbanBoard';
import { ApiService } from '@/services/api';
import { Project } from '@/types/project';

export default function BoardPage() {
    const router = useRouter();
    const params = useParams(); // Obtener parámetros de la URL
    const projectId = params.id ? (Array.isArray(params.id) ? parseInt(params.id[0], 10) : parseInt(params.id, 10)) : null;
    const [project, setProject] = useState<Project>();
    const [collaborators, setCollaborators] = useState([]);
    

    useEffect(() => {
        const fetchProjects = async () => {
            try {
            if (projectId !== null) {
                const data = await ApiService.getProject(projectId);
                setProject(data);
                setCollaborators(data.collaborators); // Actualizamos el estado de los colaboradores
            }
            } catch (error) {
                console.log('Error fetching projects:', error);
            }
        };
        
        fetchProjects();
    }, [projectId]);
      
    // Efecto para depurar los estados cuando cambian
    useEffect(() => {
    if (project) {
        console.log(project, 'project actualizado');
    }
    }, [project]);
    
    useEffect(() => {
    if (collaborators.length > 0) {
        console.log(collaborators, 'collaborators actualizados');
    }
    }, [collaborators]);

    // Verificar si el ID del proyecto es válido
    if (!projectId) {
        return (
        <div className="p-4">
            <p className="text-red-500">Invalid Project ID</p>
            <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
            Back to Dashboard
            </button>
        </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">Kanban Board</h1>
                <button
                onClick={() => router.push('/dashboard/projects')}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                Back to Dashboard
                </button>
            </div>
            {/* Renderiza el KanbanBoard */}
            <KanbanBoard projectId={projectId} collaborators={collaborators}/>
        </div>
    );
}