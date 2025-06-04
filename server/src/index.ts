import express, { Request, Response, NextFunction } from 'express';
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

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  console.log('Creating data directory:', DATA_DIR);
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize NoteService
const noteService = NoteService.getInstance();

// Validation middleware
const validateNoteInput = (req: Request, res: Response, next: NextFunction): void => {
  const { name, content } = req.body;
  if (!name || !content) {
    res.status(400).json({
      success: false,
      error: 'Name and content are required'
    });
    return;
  }
  if (typeof name !== 'string' || typeof content !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Name and content must be strings'
    });
    return;
  }
  next();
};

// Routes
app.get('/api/notes', (_req: Request, res: Response<ApiResponse<Note[]>>): void => {
  try {
    const result = noteService.getAllNotes();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get notes'
    });
  }
});

app.post('/api/notes', validateNoteInput, (req: Request, res: Response<ApiResponse<Note>>): void => {
  try {
    const { name, content } = req.body;
    const result = noteService.createNote(name, content);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create note'
    });
  }
});

app.get('/api/notes/search', (req: Request, res: Response<ApiResponse<Note[]>>): void => {
  try {
    const { name, content } = req.query;
    let result: ApiResponse<Note[]>;

    if (name && typeof name === 'string') {
      result = noteService.searchNotesByName(name);
    } else if (content && typeof content === 'string') {
      result = noteService.searchNotesByContent(content);
    } else {
      result = noteService.getAllNotes();
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

app.get('/api/notes/sort', (req: Request, res: Response<ApiResponse<Note[]>>): void => {
  try {
    const { key, order } = req.query as { 
      key: 'name' | 'date'; 
      order: 'asc' | 'desc' 
    };

    if (!key || !order || !['name', 'date'].includes(key) || !['asc', 'desc'].includes(order)) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid sort parameters' 
      });
      return;
    }

    const result = noteService.sortNotes(key, order);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Sorting failed'
    });
  }
});

app.delete('/api/notes/:id', (req: Request, res: Response<ApiResponse<void>>): void => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
      return;
    }
    const result = noteService.deleteNote(id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete note'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
