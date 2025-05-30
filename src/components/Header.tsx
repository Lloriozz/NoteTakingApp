import React from 'react';
import { Notebook } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center">
        <Notebook className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">NoteKeeper</h1>
      </div>
    </header>
  );
};

export default Header;