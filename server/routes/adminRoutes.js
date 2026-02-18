import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  getPendingIdeas,
  updateIdeaStatus,
  getPendingJobs,
  updateJobStatus,
  getAnalytics,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:userId', updateUserStatus);

router.get('/ideas/pending', getPendingIdeas);
router.put('/ideas/:ideaId', updateIdeaStatus);

router.get('/jobs/pending', getPendingJobs);
router.put('/jobs/:jobId', updateJobStatus);

router.get('/analytics', getAnalytics);

export default router;
