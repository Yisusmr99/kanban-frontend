"use client";
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/ProjectForm';
import Swal from 'sweetalert2';
import { ApiService } from '@/services/api';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params); // Desempaqueta la promesa de `params`
  const [project, setProject] = useState<{ name: string; description: string; users: number[] } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await ApiService.getProject(parseInt(unwrappedParams.id));
        setProject({
          name: response.name,
          description: response.description,
          users: response.collaborators.map((collaborator: any) => collaborator.id),
        });
      } catch (error) {
        console.log('Error fetching project:', error);
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

      const response = await ApiService.updateProject(parseInt(unwrappedParams.id), data);

      if (response.statusCode !== 200) {
        Swal.fire({
          icon: 'success',
          title: 'Project updated successfully!',
          text: response.message,
        });
        router.push('/dashboard/projects');
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Project update failed',
          text: response.message,
        });
      }
    } catch (error) {
      console.log('Error updating project:', error);
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