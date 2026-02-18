import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/admin/jobs/pending');
      setJobs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobId, status) => {
    try {
      await api.put(`/admin/jobs/${jobId}`, { status });
      fetchJobs();
      alert(`Job ${status} successfully`);
    } catch (error) {
      alert('Failed to update job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Pending Jobs</h1>

        {jobs.length === 0 ? (
          <div className="glass p-8 rounded-xl text-center">
            <p className="text-gray-400 text-lg">No pending jobs</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="glass p-6 rounded-xl">
                <h3 className="text-2xl font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-400 mb-4">
                  By: {job.employer.name} ({job.employer.email})
                </p>
                
                <p className="text-gray-300 mb-4">{job.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="capitalize">{job.jobType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Work Mode:</span>
                    <span className="capitalize">{job.workMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stipend:</span>
                    <span>{job.stipend}</span>
                  </div>
                  {job.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>{job.duration}</span>
                    </div>
                  )}
                </div>

                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Skills Required:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(job._id, 'approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(job._id, 'rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
