import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Idea from '../models/Idea.js';

export const getAllIdeas = asyncHandler(async (req, res) => {
  const filter = { status: 'approved' };

  const ideas = await Idea.find(filter)
    .populate('creator', 'name email role')
    .select('title publicSummary category industry stage creator createdAt views')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: ideas.length,
    data: ideas,
  });
});

export const createIdea = asyncHandler(async (req, res) => {
  const { title, publicSummary, fullDescription, category, industry, stage } = req.body;

  if (!title || !publicSummary || !fullDescription || !category || !industry) {
    throw new ApiError(400, 'Please provide all required fields');
  }

  const idea = await Idea.create({
    title,
    publicSummary,
    fullDescription,
    category,
    industry,
    stage: stage || 'concept',
    creator: req.user._id,
  });

  const populatedIdea = await Idea.findById(idea._id).populate('creator', 'name email role');

  res.status(201).json({
    success: true,
    data: populatedIdea,
  });
});

export const getIdeaById = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id)
    .populate('creator', 'name email role')
    .populate('approvedInvestors', 'name email')
    .populate('accessRequests.investor', 'name email');

  if (!idea) {
    throw new ApiError(404, 'Idea not found');
  }

  if (!req.user._id.equals(idea.creator._id)) {
    const existingView = idea.views.find((view) => view.user.equals(req.user._id));
    if (!existingView) {
      idea.views.push({ user: req.user._id, viewedAt: new Date() });
      await idea.save();
    }
  }

  const isCreator = req.user._id.equals(idea.creator._id);
  const isAdmin = req.user.role === 'admin';
  const isApprovedInvestor = idea.approvedInvestors.some((inv) => inv._id.equals(req.user._id));

  let responseData;

  if (isCreator || isAdmin) {
    responseData = idea;
  } else if (isApprovedInvestor) {
    responseData = idea;
  } else if (idea.status === 'approved') {
    responseData = {
      _id: idea._id,
      title: idea.title,
      publicSummary: idea.publicSummary,
      category: idea.category,
      industry: idea.industry,
      stage: idea.stage,
      creator: idea.creator,
      createdAt: idea.createdAt,
      views: idea.views.length,
    };
  } else {
    throw new ApiError(403, 'You do not have access to view this idea');
  }

  res.status(200).json({
    success: true,
    data: responseData,
  });
});

export const updateIdea = asyncHandler(async (req, res) => {
  let idea = await Idea.findById(req.params.id);

  if (!idea) {
    throw new ApiError(404, 'Idea not found');
  }

  if (!req.user._id.equals(idea.creator) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this idea');
  }

  const { title, publicSummary, fullDescription, category, industry, stage } = req.body;

  idea = await Idea.findByIdAndUpdate(
    req.params.id,
    {
      title,
      publicSummary,
      fullDescription,
      category,
      industry,
      stage,
    },
    { new: true, runValidators: true }
  ).populate('creator', 'name email role');

  res.status(200).json({
    success: true,
    data: idea,
  });
});

export const deleteIdea = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    throw new ApiError(404, 'Idea not found');
  }

  if (!req.user._id.equals(idea.creator) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this idea');
  }

  await Idea.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Idea deleted successfully',
  });
});

export const requestAccess = asyncHandler(async (req, res) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    throw new ApiError(404, 'Idea not found');
  }

  if (req.user.role !== 'investor') {
    throw new ApiError(403, 'Only investors can request access');
  }

  if (!req.user.isApproved) {
    throw new ApiError(403, 'Your investor account is pending approval');
  }

  const existingRequest = idea.accessRequests.find((req_item) =>
    req_item.investor.equals(req.user._id)
  );

  if (existingRequest) {
    throw new ApiError(400, 'Access request already exists');
  }

  const isApproved = idea.approvedInvestors.some((inv) => inv.equals(req.user._id));
  if (isApproved) {
    throw new ApiError(400, 'You already have access to this idea');
  }

  idea.accessRequests.push({
    investor: req.user._id,
    status: 'pending',
    requestedAt: new Date(),
  });

  await idea.save();

  res.status(200).json({
    success: true,
    message: 'Access request submitted successfully',
  });
});

export const updateAccessRequest = asyncHandler(async (req, res) => {
  const { ideaId, requestId } = req.params;
  const { status } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Please provide a valid status (approved or rejected)');
  }

  const idea = await Idea.findById(ideaId);

  if (!idea) {
    throw new ApiError(404, 'Idea not found');
  }

  if (!req.user._id.equals(idea.creator) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to manage access requests');
  }

  const accessRequest = idea.accessRequests.id(requestId);

  if (!accessRequest) {
    throw new ApiError(404, 'Access request not found');
  }

  accessRequest.status = status;

  if (status === 'approved') {
    const alreadyApproved = idea.approvedInvestors.some((inv) =>
      inv.equals(accessRequest.investor)
    );
    if (!alreadyApproved) {
      idea.approvedInvestors.push(accessRequest.investor);
    }
  }

  await idea.save();

  res.status(200).json({
    success: true,
    message: `Access request ${status} successfully`,
    data: idea,
  });
});
