import { Request, Response } from 'express';
import { NoteService } from '../services/noteService';
import { Note, ApiResponse } from '../types';

export class NoteController {
  private noteService: NoteService;

  constructor() {
    this.noteService = NoteService.getInstance();
  }

  public getAllNotes = async (req: Request, res: Response) => {
    const response = this.noteService.getAllNotes();
    if (response.success) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: response.error });
    }
  };

  public createNote = async (req: Request, res: Response) => {
    const { name, content } = req.body;
    const response = this.noteService.createNote(name, content);
    if (response.success) {
      res.status(201).json(response.data);
    } else {
      res.status(400).json({ error: response.error });
    }
  };

  public searchNotes = async (req: Request, res: Response) => {
    const { name, content } = req.query;
    let response: ApiResponse<Note[]>;

    if (name) {
      response = this.noteService.searchNotesByName(name as string);
    } else if (content) {
      response = this.noteService.searchNotesByContent(content as string);
    } else {
      response = this.noteService.getAllNotes();
    }

    if (response.success) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: response.error });
    }
  };

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

  public deleteNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = this.noteService.deleteNote(id);
    if (response.success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: response.error });
    }
  };
} 