import { Note, ApiResponse } from '../types';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SearchAlgorithm } from '../algorithm/searchAlgorithm';
import { SortAlgorithm } from '../algorithm/sortAlgorithm';

// Define the data directory and notes file path
const DATA_DIR = join(__dirname, '..', 'data');
const NOTES_FILE = join(DATA_DIR, 'notes.json');

export class NoteService {
  private static instance: NoteService;
  private initialized: boolean = false;

  // Private constructor to ensure singleton pattern
  private constructor() {
    this.initDataDirectory();
  }

  /**
   * Singleton instance getter
   */
  public static getInstance(): NoteService {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService();
    }
    return NoteService.instance;
  }

  /**
   * Initializes the data directory and file if they do not exist
   */
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

  /**
   * Reads notes from the JSON file
   */
  private readNotes(): Note[] {
    try {
      const data = readFileSync(NOTES_FILE, 'utf-8');
      if (!data.trim()) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading notes file:', error);
      return [];
    }
  }

  /**
   * Writes notes to the JSON file
   */
  private writeNotes(notes: Note[]): void {
    try {
      writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing notes file:', error);
      throw error; // Rethrow to be handled by the caller
    }
  }

  /**
   * Retrieves all notes
   */
  public getAllNotes(): ApiResponse<Note[]> {
    try {
      const notes = this.readNotes();
      return { success: true, data: notes };
    } catch (error) {
      console.error('Error getting all notes:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get notes' 
      };
    }
  }

  /**
   * Creates a new note
   */
  public createNote(name: string, content: string): ApiResponse<Note> {
    if (!name || !content) {
      return { success: false, error: 'Name and content are required' };
    }

    try {
      const notes = this.readNotes();
      const newNote: Note = {
        id: uuidv4(),
        name: name.trim(),
        content: content.trim(),
        date: new Date().toISOString()
      };
      
      notes.unshift(newNote);
      this.writeNotes(notes);
      
      return { success: true, data: newNote };
    } catch (error) {
      console.error('Error creating note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create note' 
      };
    }
  }

  /**
   * Searches notes by name
   */
  public searchNotesByName(query: string): ApiResponse<Note[]> {
    try {
      const notes = this.readNotes();
      const searchEngine = new SearchAlgorithm(notes); // ✅ create instance
      const results = searchEngine.searchByName(query); // ✅ call instance method
      return { success: true, data: results };
    } catch (error) {
      console.error('Search by name error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Search failed' 
      };
    }
  }
  
  public searchNotesByContent(query: string): ApiResponse<Note[]> {
    try {
      const notes = this.readNotes();
      const searchEngine = new SearchAlgorithm(notes); // ✅ create instance
      const results = searchEngine.searchByContent(query); // ✅ call instance method
      return { success: true, data: results };
    } catch (error) {
      console.error('Search by content error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Search failed' 
      };
    }
  }
  

  /**
   * Sorts notes by name or date
   */
  public sortNotes(key: 'name' | 'date', order: 'asc' | 'desc'): ApiResponse<Note[]> {
    try {
      const notes = this.readNotes();
      const sortedNotes = key === 'name'
        ? SortAlgorithm.sortByName(notes, order)
        : SortAlgorithm.sortByDate(notes, order);
      return { success: true, data: sortedNotes };
    } catch (error) {
      console.error('Sort error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sorting failed' 
      };
    }
  }

  /**
   * Deletes a note by ID
   */
  public deleteNote(id: string): ApiResponse<void> {
    try {
      const notes = this.readNotes();
      const index = notes.findIndex(note => note.id === id);
      if (index === -1) {
        return { success: false, error: 'Note not found' };
      }
      
      notes.splice(index, 1);
      this.writeNotes(notes);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete note' 
      };
    }
  }
}