import React from "react";
import { Note } from "../types";
import NoteItem from "./NoteItem";

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  onDeleteNote: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  isLoading,
  onDeleteNote,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 animate-pulse">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-40"></div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No notes found. Create your first note!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onDelete={onDeleteNote} />
      ))}
    </div>
  );
};

export default NoteList;
