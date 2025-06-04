import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import NoteList from "./components/NoteList";
import NoteForm from "./components/NoteForm";
import SearchBar from "./components/SearchBar";
import SortControls from "./components/SortControls";
import { Note, ApiResponse } from "./types";

const API_URL = "http://127.0.0.1:3001/api";

// Helper function to handle API responses
const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "An error occurred");
  }

  return response.json();
};

function App() {
  // State for notes and UI state
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<{
    key: "name" | "date";
    order: "asc" | "desc";
  } | null>(null);

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch all notes from API
  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/notes`);
      const result = await handleResponse<ApiResponse<Note[]>>(response);
      setNotes(result.data || []);
    } catch (err) {
      setError("Failed to load notes. Please try again later.");
      console.error("Error fetching notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a new note
  const handleAddNote = async (name: string, content: string) => {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, content }),
      });

      const result = await handleResponse<ApiResponse<Note>>(response);
      setNotes((prevNotes) => [result.data as Note, ...prevNotes]);

      // Reset any active sort or search when adding a new note
      setActiveSort(null);
    } catch (err) {
      console.error("Error adding note:", err);
      throw err; // Re-throw to be handled by the form component
    }
  };

  // Handle search
  const handleSearch = useCallback(
    async (type: "name" | "content", query: string) => {
      // Always clear any previous errors
      setError(null);

      // If search is empty, fetch all notes
      if (!query) {
        await fetchNotes();
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `${API_URL}/notes/search?${type}=${encodeURIComponent(query)}`
        );
        const result = await handleResponse<ApiResponse<Note[]>>(response);
        setNotes(result.data || []);

        if (result.data?.length === 0) {
          setError(`No notes found matching "${query}" in ${type}.`);
        }

        // Clear any active sort when searching
        setActiveSort(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Search failed. Please try again.";
        setError(`Search error: ${errorMessage}`);
        console.error("Error searching notes:", err);
        // Revert to showing all notes on error
        await fetchNotes();
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Handle sorting
  const handleSort = async (key: "name" | "date", order: "asc" | "desc") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/notes/sort?key=${key}&order=${order}`
      );
      const result = await handleResponse<ApiResponse<Note[]>>(response);
      setNotes(result.data || []);
      setActiveSort({ key, order });
    } catch (err) {
      setError("Sorting failed. Please try again.");
      console.error("Error sorting notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
      });
      const result = await handleResponse<ApiResponse<void>>(response);

      if (result.success) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        setError(null); // Clear any existing errors
      } else {
        setError(
          result.error || "Failed to delete note. Please try again later."
        );
      }
    } catch (err) {
      setError("Failed to delete note. Please try again later.");
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
            {error}
          </div>
        )}

        <NoteForm onAddNote={handleAddNote} />

        {/* Your Notes section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Notes</h2>
          <SearchBar onSearch={handleSearch} />
          <SortControls onSort={handleSort} activeSort={activeSort} />
          <NoteList
            notes={notes}
            isLoading={isLoading}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
