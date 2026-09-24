import { Router } from 'express';
import multer from 'multer';
import { uploadImages } from '../controllers/upload.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/images', requireAuth, upload.array('images', 3), uploadImages);

export default router;
