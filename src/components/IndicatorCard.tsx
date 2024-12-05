import React from 'react';

interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  count: number;
  bg?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const IndicatorCard: React.FC<StatCardProps> = ({ icon: Icon, title, count, bg = 'bg-[#71ce7d]' }) => {
  return (
    <li  className="col-span-1 flex rounded-md shadow-sm">
      <div
        className={classNames(
          bg,
          'flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <p className='text-gray-800'>{title}</p>
          <p className="text-gray-800">{count} </p>
        </div>
      </div>
    </li>
  );
};

export default IndicatorCard;