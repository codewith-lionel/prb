import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      setJobs(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
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
        <h1 className="text-4xl font-bold mb-8">Browse Jobs</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="glass p-8 rounded-xl text-center">
            <p className="text-gray-400 text-lg">No jobs available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="glass p-6 rounded-xl">
                <h3 className="text-2xl font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-400 mb-4">{job.employer.name}</p>
                <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="capitalize">{job.jobType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location:</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Work Mode:</span>
                    <span className="capitalize">{job.workMode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Stipend:</span>
                    <span>{job.stipend}</span>
                  </div>
                </div>

                <a
                  href={`/jobs/${job._id}`}
                  className="block w-full text-center bg-primary hover:bg-pink-600 px-4 py-2 rounded-lg transition"
                >
                  View Details & Apply
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
