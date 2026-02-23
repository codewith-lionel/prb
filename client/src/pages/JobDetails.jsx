import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    resume: '',
    coverLetter: ''
  });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!applicationData.resume) {
      alert('Please provide your resume link');
      return;
    }

    try {
      setApplying(true);
      await api.post(`/jobs/${id}/apply`, applicationData);
      alert('Application submitted successfully!');
      setShowApplyModal(false);
      navigate('/my-applications');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Job not found</p>
        </div>
      </div>
    );
  }

  const isEmployer = user.role === 'employer';
  const isStudent = user.role === 'student';

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="glass p-8 rounded-2xl mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">{job.title}</h1>
                <p className="text-xl text-gray-300 mb-4">{job.employer?.name}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-4 py-2 bg-primary/20 text-primary rounded-full font-semibold capitalize">
                    {job.jobType}
                  </span>
                  <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full capitalize">
                    {job.workMode}
                  </span>
                  <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full">
                    {job.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-sm text-gray-400 mb-1">Compensation</p>
                <p className="text-xl font-semibold text-green-400">{job.stipend}</p>
              </div>
              {job.duration && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Duration</p>
                  <p className="text-xl font-semibold">{job.duration}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400 mb-1">Posted</p>
                <p className="text-xl font-semibold">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="glass p-8 rounded-2xl mb-6">
            <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="glass p-8 rounded-2xl mb-6">
              <h2 className="text-2xl font-semibold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button - Only for Students */}
          {isStudent && (
            <div className="glass p-6 rounded-xl text-center">
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-12 rounded-lg transition text-lg"
              >
                Apply Now
              </button>
            </div>
          )}

          {/* Employer Actions */}
          {isEmployer && (
            <div className="glass p-6 rounded-xl">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate(`/job/${job._id}/applications`)}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  View Applications
                </button>
                <button
                  onClick={() => navigate('/my-jobs')}
                  className="border border-white/10 hover:bg-white/5 font-semibold py-3 px-6 rounded-lg transition"
                >
                  Back to My Jobs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass p-8 rounded-2xl max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-6">Apply for {job.title}</h2>
            
            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resume Link *
                </label>
                <input
                  type="url"
                  value={applicationData.resume}
                  onChange={(e) => setApplicationData({...applicationData, resume: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-sm text-gray-400 mt-1">
                  Provide a link to your resume (Google Drive, Dropbox, etc.)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
