import express from 'express';
import {
  getAllIdeas,
  createIdea,
  getIdeaById,
  updateIdea,
  deleteIdea,
  requestAccess,
  updateAccessRequest,
} from '../controllers/ideaController.js';
import { protect, requireApproval } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getAllIdeas)
  .post(protect, createIdea);

router.route('/:id')
  .get(protect, getIdeaById)
  .put(protect, updateIdea)
  .delete(protect, deleteIdea);

router.post('/:id/request-access', protect, requireApproval, requestAccess);
router.put('/:ideaId/access-request/:requestId', protect, updateAccessRequest);

export default router;
