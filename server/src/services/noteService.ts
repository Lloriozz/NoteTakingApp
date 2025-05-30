import { Note, ApiResponse } from '../types';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SearchAlgorithm } from '../algorithm/searchAlgorithm';
import { SortAlgorithm } from '../algorithm/sortAlgorithm';

const DATA_DIR = join(__dirname, '..', 'data');
const NOTES_FILE = join(DATA_DIR, 'notes.json');

export class NoteService {
  private static instance: NoteService;

  private constructor() {
    this.initDataDirectory();
  }

  public static getInstance(): NoteService {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService();
    }
    return NoteService.instance;
  }

  private initDataDirectory(): void {
    if (!existsSync(DATA_DIR)) {
      console.log('Creating data directory:', DATA_DIR);
      mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!existsSync(NOTES_FILE)) {
      console.log('Creating notes file:', NOTES_FILE);
      writeFileSync(NOTES_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  private readNotes(): Note[] {
    try {
      console.log('Reading notes from:', NOTES_FILE);
      const data = readFileSync(NOTES_FILE, 'utf-8');
      if (!data.trim()) {
        console.log('Notes file is empty');
        return [];
      }
      const notes = JSON.parse(data);
      console.log('Read notes:', notes);
      return notes;
    } catch (error) {
      console.error('Error reading notes file:', error);
      return [];
    }
  }

  private writeNotes(notes: Note[]): void {
    try {
      console.log('Writing notes to:', NOTES_FILE);
      writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf-8');
      console.log('Successfully wrote notes');
    } catch (error) {
      console.error('Error writing notes file:', error);
    }
  }

  public getAllNotes(): ApiResponse<Note[]> {
    try {
      const notes = this.readNotes();
      return { success: true, data: notes };
    } catch (error) {
      return { success: false, error: 'Failed to get notes' };
    }
  }

  public createNote(name: string, content: string): ApiResponse<Note> {
    try {
      if (!name || !content) {
        return { success: false, error: 'Name and content are required' };
      }

      const notes = this.readNotes();
      const newNote: Note = {
        id: uuidv4(),
        name,
        content,
        date: new Date().toISOString()
      };

      notes.unshift(newNote);
      this.writeNotes(notes);

      return { success: true, data: newNote };
    } catch (error) {
      return { success: false, error: 'Failed to create note' };
    }
  }

  public searchNotesByName(query: string): ApiResponse<Note[]> {
    try {
      const notes = this.readNotes();
      const results = SearchAlgorithm.searchByName(notes, query);
      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: 'Search failed' };
    }
  }

  public searchNotesByContent(query: string): ApiResponse<Note[]> {
    try {
      const notes = this.readNotes();
      const results = SearchAlgorithm.searchByContent(notes, query);
      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: 'Search failed' };
    }
  }

  public sortNotes(key: 'name' | 'date', order: 'asc' | 'desc'): ApiResponse<Note[]> {
    try {
      const notes = this.readNotes();
      let sortedNotes: Note[];

      if (key === 'name') {
        sortedNotes = SortAlgorithm.sortByName(notes, order);
      } else {
        sortedNotes = SortAlgorithm.sortByDate(notes, order);
      }

      return { success: true, data: sortedNotes };
    } catch (error) {
      return { success: false, error: 'Sorting failed' };
    }
  }

  public deleteNote(id: string): ApiResponse<void> {
    try {
      const notes = this.readNotes();
      const noteIndex = notes.findIndex(note => note.id === id);

      if (noteIndex === -1) {
        return { success: false, error: 'Note not found' };
      }

      notes.splice(noteIndex, 1);
      this.writeNotes(notes);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete note' };
    }
  }
}
