import React from "react";
import { Calendar, Trash2 } from "lucide-react";
import { Note } from "../types";

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete }) => {
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-gray-800">{note.name}</h2>
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
          title="Delete note"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>
      <div className="flex items-center text-gray-500 text-sm">
        <Calendar className="h-4 w-4 mr-1" />
        <span>Created: {formatDate(note.date)}</span>
      </div>
    </div>
  );
};

export default NoteItem;
