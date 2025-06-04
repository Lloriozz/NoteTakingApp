import React from "react";
import {
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Calendar,
  CalendarClock,
} from "lucide-react";

// Define types for sort keys and orders
type SortKey = "name" | "date";
type SortOrder = "asc" | "desc";

// Props received by the SortControls component
interface SortControlsProps {
  onSort: (key: SortKey, order: SortOrder) => void;
  activeSort: { key: SortKey; order: SortOrder } | null;
}

// This component renders buttons to sort notes by name or date
const SortControls: React.FC<SortControlsProps> = ({ onSort, activeSort }) => {
  // Check if a specific sort button is currently active
  const isActive = (key: SortKey, order: SortOrder): boolean => {
    return activeSort?.key === key && activeSort?.order === order;
  };

  // Define the sorting options as an array of objects
  const sortOptions = [
    {
      key: "name" as SortKey,
      order: "asc" as SortOrder,
      label: "Name A-Z",
      Icon: SortAsc,
    },
    {
      key: "name" as SortKey,
      order: "desc" as SortOrder,
      label: "Name Z-A",
      Icon: SortDesc,
    },
    {
      key: "date" as SortKey,
      order: "asc" as SortOrder,
      label: "Oldest First",
      Icon: Calendar,
    },
    {
      key: "date" as SortKey,
      order: "desc" as SortOrder,
      label: "Newest First",
      Icon: CalendarClock,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-gray-700 font-medium mb-2">Sort Notes</h3>

      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const { key, order, label, Icon } = option;
          const active = isActive(key, order);

          return (
            <button
              key={`${key}-${order}`}
              onClick={() => onSort(key, order)}
              className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
                active
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={`Sort by ${label}`}
              aria-pressed={active}
            >
              <Icon className="h-4 w-4 mr-1" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortControls;
