import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    publicSummary: {
      type: String,
      required: [true, 'Public summary is required'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
    },
    stage: {
      type: String,
      enum: ['concept', 'prototype', 'mvp', 'scaling'],
      default: 'concept',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    accessRequests: [
      {
        investor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    approvedInvestors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;
