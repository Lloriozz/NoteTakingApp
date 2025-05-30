import React from 'react';
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';

interface SortControlsProps {
  onSort: (key: 'name' | 'date', order: 'asc' | 'desc') => void;
  activeSort: { key: 'name' | 'date', order: 'asc' | 'desc' } | null;
}

const SortControls: React.FC<SortControlsProps> = ({ onSort, activeSort }) => {
  // Helper to determine if a sort option is active
  const isActive = (key: 'name' | 'date', order: 'asc' | 'desc') => {
    return activeSort?.key === key && activeSort?.order === order;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-gray-700 font-medium mb-2">Sort Notes</h3>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSort('name', 'asc')}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            isActive('name', 'asc')
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <SortAsc className="h-4 w-4 mr-1" />
          Name A-Z
        </button>
        
        <button
          onClick={() => onSort('name', 'desc')}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            isActive('name', 'desc')
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <SortDesc className="h-4 w-4 mr-1" />
          Name Z-A
        </button>
        
        <button
          onClick={() => onSort('date', 'asc')}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            isActive('date', 'asc')
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ArrowUpDown className="h-4 w-4 mr-1" />
          Oldest First
        </button>
        
        <button
          onClick={() => onSort('date', 'desc')}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            isActive('date', 'desc')
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ArrowUpDown className="h-4 w-4 mr-1" />
          Newest First
        </button>
      </div>
    </div>
  );
};

export default SortControls;