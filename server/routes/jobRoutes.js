import express from 'express';
import {
  getAllJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  getJobApplications,
} from '../controllers/jobController.js';
import { protect, requireApproval } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getAllJobs)
  .post(protect, requireApproval, createJob);

router.route('/:id')
  .get(protect, getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

router.post('/:id/apply', protect, applyToJob);
router.get('/:id/applications', protect, getJobApplications);

export default router;
