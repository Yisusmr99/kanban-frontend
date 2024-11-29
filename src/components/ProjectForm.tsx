"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiService } from '@/services/api';

interface User {
  id: number;
  full_name: string;
}

interface ProjectFormProps {
  initialData?: { name: string; description: string; users: number[] };
  onSubmit: (data: { name: string; description: string; users: number[] }) => void;
  onBack: () => void; 
}

export default function ProjectForm({ initialData, onSubmit, onBack }: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [users, setUsers] = useState<number[]>(initialData?.users || []);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUserId(parsedUser.id); // Guarda el ID del usuario actual
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await ApiService.getUsers();
        setAllUsers(data.data.filter((user: any) => user.id !== currentUserId));
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    }

    fetchUsers();
    
  }, [currentUserId]);

  const handleCheckboxChange = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.includes(userId) ? prevUsers.filter((id) => id !== userId) : [...prevUsers, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, users });
  };

  return (
    <div className="bg-gray-100 py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl"></h2>
          <button
            onClick={onBack}
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Projects
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Collaborators</label>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {allUsers.map((user) => (
                <div key={user.id} className="flex items-center">
                  <input
                    id={`user-${user.id}`}
                    type="checkbox"
                    checked={users.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`user-${user.id}`} className="ml-2 text-sm font-medium text-gray-700">
                    {user.full_name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {initialData ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
    </div>
  );
}