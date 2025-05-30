import React, { useState, ChangeEvent, FormEvent } from "react";
import { PlusCircle, PenLine } from "lucide-react";

interface NoteFormProps {
  onAddNote: (name: string, content: string) => Promise<void>;
}

const NoteForm: React.FC<NoteFormProps> = ({ onAddNote }) => {
  // State for form fields
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !content.trim()) {
      setError("Both name and content are required");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Call the parent function to add the note
      await onAddNote(name, content);

      // Clear the form after successful submission
      setName("");
      setContent("");
    } catch (err) {
      setError("Failed to add note. Please try again.");
      console.error("Error adding note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-center gap-2 mb-6">
        <PenLine className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Add New Note</h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r-md animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="group">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors"
          >
            Note Title
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
            placeholder="Enter a catchy title..."
            disabled={isSubmitting}
          />
        </div>

        <div className="group">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors"
          >
            Note Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 min-h-[150px] resize-y"
            placeholder="Write your thoughts here..."
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          <PlusCircle className="h-5 w-5" />
          <span>{isSubmitting ? "Adding Note..." : "Add Note"}</span>
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
