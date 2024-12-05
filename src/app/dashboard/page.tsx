'use client';
import { ApiService } from '@/services/api';
import { UsersIcon, CommandLineIcon, ClipboardDocumentCheckIcon, ChevronDownIcon, ChevronUpIcon, UserGroupIcon, CheckCircleIcon, PencilSquareIcon, ClipboardIcon, UserIcon, ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';
import { DataProject } from '@/types/project';
import IndicatorCard from '@/components/IndicatorCard';
import StatCard from '@/components/StatCard';
import Spinner from '@/components/Spinner';

const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardPage() {

  const [data, setData] = useState<DataProject>({
    count_users: 0,
    count_projects: 0,
    count_tasks: 0,
    summary_projects: [] // Asegúrate de que summary_projects siempre sea un array
  });  
  const [loading, setLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

  const toggleAccordion = (projectId: number) => {
    setExpandedProjectId((prev) => (prev === projectId ? null : projectId));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await ApiService.getDashboard();
        setData(data);
      } catch (error) {
        console.log('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjects();
  },[])

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            icon={UsersIcon} 
            title="Total Users" 
            count={data.count_users} 
          />
          <StatCard 
            icon={CommandLineIcon} 
            title="Total Projects" 
            count={data.count_projects} 
          />
          <StatCard 
            icon={ClipboardDocumentCheckIcon} 
            title="Total Tasks" 
            count={data.count_tasks} 
          />
        </dl>
      </div>

      <div className="bg-white p-[2rem] mt-[2rem] rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900">Summary by project</h1>
        <ul role="list" className="divide-y divide-gray-100">
          {data.summary_projects.map((project) => (
            <li key={project.id} className="py-5">
              <div className="flex items-center justify-between gap-x-6">
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <p className="text-sm/6 font-semibold text-gray-900">{project.name}</p>
                    <p
                      className={classNames(
                        project.deleted_at != null ? 'Archived' : 'In progress',
                        'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                      )}
                    >
                      {project.deleted_at != null ? 'Archived' : 'Active'}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                    <p className='whitespace-nowrap'>
                      <strong>Owner:</strong> { project.owner }
                    </p>
                    <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                      <circle r={1} cx={1} cy={1} />
                    </svg>
                    <p className="truncate">
                      Created by{' '}
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAccordion(project.id)}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                  aria-expanded={expandedProjectId === project.id}
                  aria-label="Toggle project details"
                >
                  {expandedProjectId === project.id ? (
                    <ChevronUpIcon className="size-5" />
                  ) : (
                    <ChevronDownIcon className="size-5" />
                  )}
                </button>
              </div>
              {expandedProjectId === project.id && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md text-sm text-gray-700">
                  <p>Additional details about <strong>{project.name}</strong></p>
                  <p><strong>Description:</strong> {project.description}</p>

                  <div className='pt-2'>
                    <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <IndicatorCard
                        icon={ClipboardDocumentCheckIcon}
                        title={'Tasks created'}
                        count={project.count_tasks}
                        bg='bg-[#6366f1]'
                      />
                      <IndicatorCard
                        icon={UserGroupIcon}
                        title={'Members'}
                        count={project.collaborators}
                        bg='bg-[#6366f1]'
                      />
                      <IndicatorCard
                        icon={ChartPieIcon}
                        title={'Percentage completed'}
                        count={parseFloat(project.porcentage_tasks.toFixed(2))}
                        bg='bg-[#6366f1]'
                      />
                    </ul>
                    <div className='row mt-3'>
                      <p className='text-md text-gray-700'><strong>Tasks by status:</strong></p>
                    </div>
                    <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <IndicatorCard
                        icon={ClipboardIcon}
                        title={'Tasks to do'}
                        count={project.count_tasks_todo}
                        bg='bg-[#94a3b8]'
                      />
                      <IndicatorCard
                        icon={PencilSquareIcon}
                        title={'Tasks in progress'}
                        count={project.count_tasks_inprogress}
                        bg='bg-[#0ea5e9]'
                      />
                      <IndicatorCard
                        icon={CheckCircleIcon}
                        title={'Tasks done'}
                        count={project.count_tasks_done}
                      />
                    </ul>
                    { project.tasks_by_responsible.length > 0 && (
                      <div className='row mt-3'>
                        <p className='text-md text-gray-700'><strong>Tasks assigned by users:</strong></p>
                      </div>
                    )}
                    <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      
                      {project.tasks_by_responsible.map((responsible) => (
                        <IndicatorCard
                          key={responsible.id}
                          icon={UserIcon}
                          title={ responsible.fullName}
                          count={responsible.cardCount}
                          bg={'bg-[#3b82f6]'}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}