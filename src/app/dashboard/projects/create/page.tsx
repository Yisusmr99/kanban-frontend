"use client";
import ProjectForm from '@/components/ProjectForm';
import { ApiService } from '@/services/api';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function CreateProjectPage() {
  const router = useRouter();
  const handleCreate = async (data: { name: string; description: string; users: number[] }) => {
    try {
      const response  = await ApiService.createProject(data);
      if (response.statusCode !== 200) {
        Swal.fire({
          icon: 'success',
          title: 'Project created successfully!',
          text: response.message,
        });
        router.push('/dashboard/projects')
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Project creation failed',
          text: response.message,
        });
      }
    } catch (error) {
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