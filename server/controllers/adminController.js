import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -refreshToken').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isApproved, isVerified, status } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (isApproved !== undefined) {
    user.isApproved = isApproved;
  }

  if (isVerified !== undefined) {
    user.isVerified = isVerified;
  }

  if (status !== undefined) {
    user.status = status;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const getPendingIdeas = asyncHandler(async (req, res) => {
  const ideas = await Idea.find({ status: 'pending' })
    .populate('creator', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: ideas.length,
    data: ideas,
  });
});

export const updateIdeaStatus = asyncHandler(async (req, res) => {
  const { ideaId } = req.params;
  const { status } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Please provide a valid status (approved or rejected)');
  }

  const idea = await Idea.findByIdAndUpdate(
    ideaId,
    { status },
    { new: true, runValidators: true }
  ).populate('creator', 'name email role');

  if (!idea) {
    throw new ApiError(404, 'Idea not found');
  }

  res.status(200).json({
    success: true,
    data: idea,
  });
});

export const getPendingJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: 'pending' })
    .populate('employer', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

export const updateJobStatus = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Please provide a valid status (approved or rejected)');
  }

  const job = await Job.findByIdAndUpdate(
    jobId,
    { status },
    { new: true, runValidators: true }
  ).populate('employer', 'name email');

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalIdeas = await Idea.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();

  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);

  const ideasByStatus = await Idea.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const jobsByStatus = await Job.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totals: {
        users: totalUsers,
        ideas: totalIdeas,
        jobs: totalJobs,
        applications: totalApplications,
      },
      usersByRole,
      ideasByStatus,
      jobsByStatus,
    },
  });
});
