import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const SubmitIdea = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    publicSummary: '',
    fullDescription: '',
    category: '',
    industry: '',
    stage: 'concept'
  });

  const categories = [
    'Technology', 'Education', 'Healthcare', 'Finance', 'E-commerce',
    'Social Media', 'Entertainment', 'Sustainability', 'Agriculture', 'Other'
  ];

  const industries = [
    'EdTech', 'FinTech', 'HealthTech', 'GreenTech', 'FoodTech',
    'AI/ML', 'Blockchain', 'IoT', 'SaaS', 'Gaming', 'Other'
  ];

  const stages = [
    { value: 'concept', label: 'Concept - Just an idea' },
    { value: 'prototype', label: 'Prototype - Early development' },
    { value: 'mvp', label: 'MVP - Minimum Viable Product' },
    { value: 'scaling', label: 'Scaling - Ready to grow' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/ideas', formData);
      alert('Idea submitted successfully! It will be reviewed by an admin.');
      navigate('/my-ideas');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Submit Your Idea</h1>
          <p className="text-gray-400 mb-8">
            Share your innovative idea with potential investors
          </p>

          <div className="glass p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Idea Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., AI-Powered Study Assistant"
                />
              </div>

              {/* Public Summary */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Public Summary *
                </label>
                <textarea
                  name="publicSummary"
                  value={formData.publicSummary}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="A brief public description that everyone can see..."
                />
                <p className="text-sm text-gray-400 mt-1">
                  This will be visible to all users browsing ideas
                </p>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Description *
                </label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Detailed description including features, target market, revenue model, etc..."
                />
                <p className="text-sm text-gray-400 mt-1">
                  This will only be visible to approved investors
                </p>
              </div>

              {/* Category and Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select industry</option>
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Development Stage *
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {stages.map(stage => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Idea'}
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
            <p className="font-semibold mb-2">📝 Submission Guidelines</p>
            <ul className="text-sm space-y-1">
              <li>• Be clear and concise in your descriptions</li>
              <li>• Include key features and unique value proposition</li>
              <li>• Your idea will be reviewed by admins before publishing</li>
              <li>• Full description is only visible to approved investors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitIdea;
