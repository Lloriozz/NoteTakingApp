import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (type: "name" | "content", query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "content">("name");

  // Handle search when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchType, query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchType, onSearch]);

  // Clear search query and trigger search with empty query
  const handleClear = () => {
    setQuery("");
    // The useEffect will handle the search with empty query
  };

  // Handle search type change
  const handleSearchTypeChange = (type: "name" | "content") => {
    setSearchType(type);
    // If there's a query, trigger search with the new type
    if (query) {
      onSearch(type, query);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Search by ${searchType}...`}
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex mt-2 gap-2">
        <button
          onClick={() => handleSearchTypeChange("name")}
          className={`px-3 py-1 rounded-md text-sm ${
            searchType === "name"
              ? "bg-blue-100 text-blue-800 font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Search by Title
        </button>

        <button
          onClick={() => handleSearchTypeChange("content")}
          className={`px-3 py-1 rounded-md text-sm ${
            searchType === "content"
              ? "bg-blue-100 text-blue-800 font-medium"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Search by Content
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
