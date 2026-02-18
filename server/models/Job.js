import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract'],
      required: [true, 'Job type is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    workMode: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: [true, 'Work mode is required'],
    },
    duration: {
      type: String,
    },
    stipend: {
      type: String,
      required: [true, 'Stipend is required'],
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
