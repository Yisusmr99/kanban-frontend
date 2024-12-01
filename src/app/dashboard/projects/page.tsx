'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import { ApiService } from '@/services/api';
import Swal from 'sweetalert2';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ApiService.getProjects(); // Llama al servicio centralizado
        setProjects(data.data); // Actualiza los proyectos en el estado
      } catch (error) {
        console.log('Error fetching projects:', error); // Los errores ya están manejados en `ApiService`
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    router.push('/dashboard/projects/create');
  };

  const handleEditProject = (projectId: number) => {
    router.push(`/dashboard/projects/${projectId}/edit`);
  };

  const handleDeleteProject = async (projectId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You wont be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if(result.isConfirmed){
      try {
        await ApiService.deleteProject(projectId);
        Swal.fire('Deleted!', 'Your project has been deleted.', 'success');
        setProjects((prev) => prev.filter((project) => project.id !== projectId));
      } catch (error) {
      }
    }
  };

  const handleViewBoard = (projectId: number) => {
    router.push(`/dashboard/board/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Your Projects</h1>
        <button
          onClick={handleCreateProject}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add New Project
        </button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length > 0 ? (
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
          {projects.map((project) => (
            <li key={project.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
                  <p className="text-sm text-gray-500">{project.description}</p>
                  <p className="text-sm text-gray-500">
                    Role: <span className="font-medium text-gray-700">{project.role}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Collaborators: <span className="font-medium text-gray-700">{project.collaborators.length}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  {project.role === 'owner' && (
                    <>
                      <button
                        onClick={() => handleEditProject(project.id)}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleViewBoard(project.id)}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
                  >
                    Go to Board
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects found. Start by creating a new one!</p>
      )}
    </div>
  );
}