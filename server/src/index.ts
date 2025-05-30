import express, { Request, Response } from 'express';
import cors from 'cors';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Note, ApiResponse } from './types';
import { NoteService } from './services/noteService';

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  console.log('Creating data directory:', DATA_DIR);
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize NoteService
const noteService = NoteService.getInstance();

// Routes
app.get('/api/notes', (_req: Request, res: Response<ApiResponse<Note[]>>) => {
  const result = noteService.getAllNotes();
  res.json(result);
});

app.post('/api/notes', (req: Request, res: Response<ApiResponse<Note>>) => {
  const { name, content } = req.body;
  const result = noteService.createNote(name, content);
  res.status(result.success ? 201 : 400).json(result);
});

app.get('/api/notes/search', (req: Request, res: Response<ApiResponse<Note[]>>) => {
  const { name, content } = req.query;
  let result: ApiResponse<Note[]>;

  if (name) {
    result = noteService.searchNotesByName(name.toString());
  } else if (content) {
    result = noteService.searchNotesByContent(content.toString());
  } else {
    result = noteService.getAllNotes();
  }

  res.json(result);
});

app.get('/api/notes/sort', (req: Request, res: Response<ApiResponse<Note[]>>) => {
  const { key, order } = req.query as { 
    key: 'name' | 'date'; 
    order: 'asc' | 'desc' 
  };

  if (!key || !order || !['name', 'date'].includes(key) || !['asc', 'desc'].includes(order)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid sort parameters' 
    });
  }

  const result = noteService.sortNotes(key, order);
  res.json(result);
});

app.delete('/api/notes/:id', (req: Request, res: Response<ApiResponse<void>>) => {
  const { id } = req.params;
  const result = noteService.deleteNote(id);
  res.status(result.success ? 200 : 404).json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});