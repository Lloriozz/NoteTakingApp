import { Router } from 'express';
import { NoteController } from '../controllers/noteController';

// Create a router object from Express
const router = Router();

// Create a controller to handle the logic for each route
const noteController = new NoteController();

// ----------------------------
// Route to get all notes
// Example: GET /notes
// ----------------------------
router.get('/notes', noteController.getAllNotes);

// ----------------------------
// Route to create a new note
// Example: POST /notes
// Body: { "name": "Note title", "content": "Note content" }
// ----------------------------
router.post('/notes', noteController.createNote);

// ----------------------------
// Route to search notes by name or content
// Example: GET /notes/search?name=hello
//          GET /notes/search?content=world
// ----------------------------
router.get('/notes/search', noteController.searchNotes);

// ----------------------------
// Route to sort notes by name or date
// Example: GET /notes/sort?key=name&order=asc
// ----------------------------
router.get('/notes/sort', noteController.sortNotes);

// ----------------------------
// Route to delete a note by its ID
// Example: DELETE /notes/12345
// ----------------------------
router.delete('/notes/:id', noteController.deleteNote);

// Export the router to use in the main app (index.ts)
export default router;
