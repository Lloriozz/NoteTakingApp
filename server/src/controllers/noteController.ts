import { Request, Response } from 'express';
import { NoteService } from '../services/noteService';
import { Note, ApiResponse } from '../types';

// This class handles incoming HTTP requests related to notes
export class NoteController {
  private noteService: NoteService;

  constructor() {
    // Get a single shared instance of the NoteService
    this.noteService = NoteService.getInstance();
  }

  // -----------------------------
  // Get all notes (GET /notes)
  // -----------------------------
  public getAllNotes = async (req: Request, res: Response) => {
    const response = this.noteService.getAllNotes();

    if (response.success) {
      res.json(response.data); // Return the notes as JSON
    } else {
      res.status(500).json({ error: response.error }); // Server error
    }
  };

  // -----------------------------
  // Create a new note (POST /notes)
  // -----------------------------
  public createNote = async (req: Request, res: Response) => {
    const { name, content } = req.body;

    const response = this.noteService.createNote(name, content);

    if (response.success) {
      res.status(201).json(response.data); // Note created
    } else {
      res.status(400).json({ error: response.error }); // Bad request
    }
  };

  // -----------------------------------------
  // Search for notes by name or content (GET /notes/search?name=... or ?content=...)
  // -----------------------------------------
  public searchNotes = async (req: Request, res: Response) => {
    const { name, content } = req.query;

    let response: ApiResponse<Note[]>;

    // Search by name if 'name' is provided
    if (name) {
      response = this.noteService.searchNotesByName(name as string);

    // Otherwise, search by content if 'content' is provided
    } else if (content) {
      response = this.noteService.searchNotesByContent(content as string);

    // If neither is provided, return all notes
    } else {
      response = this.noteService.getAllNotes();
    }

    if (response.success) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: response.error });
    }
  };

  // ---------------------------------------------------------
  // Sort notes by a specific key and order (GET /notes/sort?key=name&order=asc)
  // ---------------------------------------------------------
  public sortNotes = async (req: Request, res: Response) => {
    const { key, order } = req.query;

    const response = this.noteService.sortNotes(
      key as 'name' | 'date',
      order as 'asc' | 'desc'
    );

    if (response.success) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: response.error });
    }
  };

  // -------------------------------------
  // Delete a note by ID (DELETE /notes/:id)
  // -------------------------------------
  public deleteNote = async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = this.noteService.deleteNote(id);

    if (response.success) {
      res.status(204).send(); // Success, no content returned
    } else {
      res.status(404).json({ error: response.error }); // Not found
    }
  };
}
