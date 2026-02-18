import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getAllJobs = asyncHandler(async (req, res) => {
  const filter = { status: 'approved' };

  const jobs = await Job.find(filter)
    .populate('employer', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

export const createJob = asyncHandler(async (req, res) => {
  if (req.user.role !== 'employer') {
    throw new ApiError(403, 'Only employers can create jobs');
  }

  if (!req.user.isVerified) {
    throw new ApiError(403, 'Your employer account is pending verification');
  }

  const {
    title,
    description,
    jobType,
    location,
    workMode,
    duration,
    stipend,
    skillsRequired,
  } = req.body;

  if (!title || !description || !jobType || !location || !workMode || !stipend) {
    throw new ApiError(400, 'Please provide all required fields');
  }

  const job = await Job.create({
    title,
    description,
    employer: req.user._id,
    jobType,
    location,
    workMode,
    duration,
    stipend,
    skillsRequired: skillsRequired || [],
  });

  const populatedJob = await Job.findById(job._id).populate('employer', 'name email');

  res.status(201).json({
    success: true,
    data: populatedJob,
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('employer', 'name email');

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

export const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (!req.user._id.equals(job.employer) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this job');
  }

  const {
    title,
    description,
    jobType,
    location,
    workMode,
    duration,
    stipend,
    skillsRequired,
  } = req.body;

  job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      jobType,
      location,
      workMode,
      duration,
      stipend,
      skillsRequired,
    },
    { new: true, runValidators: true }
  ).populate('employer', 'name email');

  res.status(200).json({
    success: true,
    data: job,
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (!req.user._id.equals(job.employer) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this job');
  }

  await Application.deleteMany({ job: job._id });
  await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
});

export const applyToJob = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    throw new ApiError(403, 'Only students can apply to jobs');
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (job.status !== 'approved') {
    throw new ApiError(400, 'This job is not available for applications');
  }

  const { resume, coverLetter } = req.body;

  if (!resume) {
    throw new ApiError(400, 'Please provide a resume');
  }

  const existingApplication = await Application.findOne({
    job: job._id,
    applicant: req.user._id,
  });

  if (existingApplication) {
    throw new ApiError(400, 'You have already applied to this job');
  }

  const application = await Application.create({
    job: job._id,
    applicant: req.user._id,
    resume,
    coverLetter,
  });

  const populatedApplication = await Application.findById(application._id)
    .populate('job', 'title')
    .populate('applicant', 'name email');

  res.status(201).json({
    success: true,
    data: populatedApplication,
  });
});

export const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (!req.user._id.equals(job.employer) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view applications for this job');
  }

  const applications = await Application.find({ job: job._id })
    .populate('applicant', 'name email')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});
