import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: '',
    location: '',
    workMode: '',
    duration: '',
    stipend: '',
    skillsRequired: ''
  });

  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' }
  ];

  const workModes = [
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user.isVerified) {
      alert('Your employer account is pending verification');
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s)
      };

      await api.post('/jobs', jobData);
      alert('Job posted successfully! It will be reviewed by an admin.');
      navigate('/my-jobs');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (user.role !== 'employer') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">
              Only employers can post jobs
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user.isVerified) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-3xl font-bold mb-4">Account Pending Verification</h2>
            <p className="text-gray-400 mb-6">
              Your employer account is awaiting admin verification. Once verified, you'll be able to post job opportunities.
            </p>
            <a
              href="/dashboard"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Post a Job</h1>
          <p className="text-gray-400 mb-8">
            Find the best talent for your organization
          </p>

          <div className="glass p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Frontend Developer Intern"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </div>

              {/* Job Type and Work Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Type *
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select job type</option>
                    {jobTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Work Mode *
                  </label>
                  <select
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select work mode</option>
                    {workModes.map(mode => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Mumbai, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 3 months, Permanent"
                  />
                </div>
              </div>

              {/* Stipend/Salary */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stipend/Salary *
                </label>
                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., ₹15,000 - ₹20,000/month"
                />
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Skills Required
                </label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., React, JavaScript, CSS (comma separated)"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Separate skills with commas
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500 text-blue-400 rounded-lg">
            <p className="font-semibold mb-2">📝 Posting Guidelines</p>
            <ul className="text-sm space-y-1">
              <li>• Provide clear job description and requirements</li>
              <li>• Be transparent about compensation</li>
              <li>• Your job posting will be reviewed before publishing</li>
              <li>• Respond promptly to applications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
