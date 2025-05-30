import { Router } from 'express';
import { NoteController } from '../controllers/noteController';

const router = Router();
const noteController = new NoteController();

// Lấy tất cả ghi chú
router.get('/notes', noteController.getAllNotes);

// Tạo ghi chú mới
router.post('/notes', noteController.createNote);

// Tìm kiếm ghi chú
router.get('/notes/search', noteController.searchNotes);

// Sắp xếp ghi chú
router.get('/notes/sort', noteController.sortNotes);

// Xóa ghi chú
router.delete('/notes/:id', noteController.deleteNote);

export default router; 