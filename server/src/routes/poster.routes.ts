import { Router } from 'express';
import {
  createPoster,
  getPosters,
  getPosterById,
  deletePoster,
  regeneratePoster,
} from '../controllers/poster.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/', createPoster);
router.get('/', getPosters);
router.get('/:id', getPosterById);
router.delete('/:id', deletePoster);
router.post('/:id/regenerate', regeneratePoster);

export default router;
