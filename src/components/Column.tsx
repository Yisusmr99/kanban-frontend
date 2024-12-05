import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export const Column = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="p-4 bg-gray-200 rounded-md min-h-[46rem] h-auto">
      {children || (
        <div className="text-center text-gray-400">Drop tasks here</div>
      )}
    </div>
  );
};