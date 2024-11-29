"use client";
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/ProjectForm';
import Swal from 'sweetalert2';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params); // Desempaqueta la promesa de `params`
  const [project, setProject] = useState<{ name: string; description: string; users: number[] } | null>(null);
  const router = useRouter();
  console.log(unwrappedParams.id, 'los params');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3000/projects/${unwrappedParams.id}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }

        const data = await response.json();
        setProject({
          name: data.name,
          description: data.description,
          users: data.collaborators.map((collaborator: any) => collaborator.id),
        });
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [unwrappedParams.id]);

  const handleUpdate = async (data: { name: string; description: string; users: number[] }) => {
    try {

      if (!data.name || !data.description || !Array.isArray(data.users)) {
        await Swal.fire({
          icon: 'error',
          title: 'Invalid Data',
          text: 'Please ensure all fields are filled correctly.',
        });
        return;
      }

      const response = await fetch(`http://localhost:3000/projects/${unwrappedParams.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const data_response = await response.json();
      console.log('proyecto actualizado:', data_response);
      if (data_response.statusCode !== 200) {
        Swal.fire({
          icon: 'success',
          title: 'Project updated successfully!',
          text: data_response.message,
        });
        router.push('/dashboard/projects');
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Project update failed',
          text: data_response.message,
        });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      Swal.fire({
        icon: 'error',
        title: 'Project creation failed',
        text: 'An error occurred while updating the project.',
      });
    }
  };

  const handleBack = () => {
    router.push('/dashboard/projects');
  };

  return (
    <div className="bg-gray-100 h-auto py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Project</h2>
        {project && 
            <ProjectForm initialData={project} onSubmit={handleUpdate} onBack={handleBack}/>
        }
      </div>
    </div>
  );
}