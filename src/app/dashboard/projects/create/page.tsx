"use client";
import ProjectForm from '@/components/ProjectForm';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function CreateProjectPage() {
  const router = useRouter();
  const handleCreate = async (data: { name: string; description: string; users: number[] }) => {
    try {
      const response = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      const data_response = await response.json();
      console.log('proyecto creado:', data_response);
      if (data_response.statusCode !== 200) {
        Swal.fire({
          icon: 'success',
          title: 'Project created successfully!',
          text: data_response.message,
        });
        router.push('/dashboard/projects')
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Project creation failed',
          text: data_response.message,
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      Swal.fire({
        icon: 'error',
        title: 'Project creation failed',
        text: 'An error occurred while creating the project',
      });
    }
  };

  const handleBack = () => {
    router.push('/dashboard/projects');
  };

  return (
    <div className="bg-gray-100 h-auto py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Project</h2>
        <ProjectForm onSubmit={handleCreate} onBack={handleBack} />
      </div>
    </div>
  );
}