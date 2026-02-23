import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const JobApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobAndApplications();
  }, [id]);

  const fetchJobAndApplications = async () => {
    try {
      setLoading(true);
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/jobs/${id}`),
        api.get(`/jobs/${id}/applications`)
      ]);
      setJob(jobRes.data.data);
      setApplications(appsRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      alert('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
      reviewed: 'bg-blue-500/10 text-blue-500 border-blue-500',
      accepted: 'bg-green-500/10 text-green-500 border-green-500',
      rejected: 'bg-red-500/10 text-red-500 border-red-500'
    };

    const statusLabels = {
      pending: '⏳ Pending',
      reviewed: '👀 Reviewed',
      accepted: '✅ Accepted',
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
          <p className="text-xl">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/my-jobs')}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
        >
          ← Back to My Jobs
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{job?.title}</h1>
          <p className="text-gray-400">
            {applications.length} application{applications.length !== 1 ? 's' : ''} received
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-400">
              No applications received yet
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application._id} className="glass p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">
                      {application.applicant?.name}
                    </h3>
                    <p className="text-gray-400">{application.applicant?.email}</p>
                  </div>
                  <div>
                    {getStatusBadge(application.status)}
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Applied on:</p>
                  <p>{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>

                {application.coverLetter && (
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <p className="text-sm text-gray-400 mb-2">Cover Letter:</p>
                    <p className="text-gray-300">{application.coverLetter}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Resume:</p>
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Resume →
                  </a>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button className="text-green-400 hover:underline">
                    Accept
                  </button>
                  <button className="text-red-400 hover:underline">
                    Reject
                  </button>
                  <button className="text-blue-400 hover:underline">
                    Mark as Reviewed
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

export default JobApplications;
