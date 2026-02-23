import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      // Filter to show only employer's own jobs
      setJobs(response.data.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      alert('Job deleted successfully');
      fetchMyJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete job');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
      approved: 'bg-green-500/10 text-green-500 border-green-500',
      rejected: 'bg-red-500/10 text-red-500 border-red-500'
    };

    const statusLabels = {
      pending: '⏳ Pending',
      approved: '✅ Approved',
      rejected: '❌ Rejected'
    };

    return (
      <span className={`px-3 py-1 border rounded-full text-sm ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Job Postings</h1>
            <p className="text-gray-400">Manage your job listings</p>
          </div>
          <button
            onClick={() => navigate('/post-job')}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            + Post New Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💼</div>
            <p className="text-xl text-gray-400 mb-6">
              You haven't posted any jobs yet
            </p>
            <button
              onClick={() => navigate('/post-job')}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job._id} className="glass p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded">
                        {job.jobType}
                      </span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="capitalize">{job.workMode}</span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(job.status)}
                  </div>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Stipend:</span>
                    <p className="font-semibold">{job.stipend}</p>
                  </div>
                  {job.duration && (
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <p className="font-semibold">{job.duration}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Posted:</span>
                    <p className="font-semibold">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Applications:</span>
                    <p className="font-semibold">0</p>
                  </div>
                </div>

                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 border-t border-white/10 pt-4">
                  <button
                    onClick={() => navigate(`/job/${job._id}`)}
                    className="text-primary hover:underline"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/job/${job._id}/applications`)}
                    className="text-blue-400 hover:underline"
                  >
                    View Applications
                  </button>
                  {job.status === 'pending' && (
                    <>
                      <button
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                        className="text-yellow-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
