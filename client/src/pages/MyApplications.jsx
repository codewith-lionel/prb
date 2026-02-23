import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      // This would need a dedicated endpoint in the backend
      // For now, we'll use a placeholder
      setApplications([]);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
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
      pending: '⏳ Under Review',
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
          <p className="text-xl">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">My Applications</h1>
        <p className="text-gray-400 mb-8">Track your job applications</p>

        {applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-xl text-gray-400 mb-6">
              You haven't applied to any jobs yet
            </p>
            <a
              href="/jobs"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Browse Jobs
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application._id} className="glass p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">
                      {application.job?.title}
                    </h3>
                    <p className="text-gray-400">
                      {application.job?.employer?.name}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(application.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-400">Applied On:</span>
                    <p>{new Date(application.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <p>{application.job?.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Work Mode:</span>
                    <p className="capitalize">{application.job?.workMode}</p>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <p className="text-sm text-gray-400 mb-2">Your Cover Letter:</p>
                    <p className="text-gray-300">{application.coverLetter}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-4 border-t border-white/10 pt-4">
                  <a
                    href={`/job/${application.job?._id}`}
                    className="text-primary hover:underline"
                  >
                    View Job Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
