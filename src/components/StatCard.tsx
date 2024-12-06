import React from 'react';

interface StatCardProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    count: number
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, count }) => {
  return (

    <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6 sm:pt-6">
      <dt>
        <div className="absolute rounded-md bg-indigo-600 p-3">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500">{title}</p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900">{count}</p>
      </dd>
    </div>
  );
};

export default StatCard;