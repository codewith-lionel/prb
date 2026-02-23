import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ideas');
      // Filter ideas where user has requested access
      const ideasWithRequests = response.data.data.filter(idea => 
        idea.accessRequests?.some(req => req.investor === user.id)
      );
      setRequests(ideasWithRequests);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRequestStatus = (idea) => {
    const request = idea.accessRequests?.find(req => req.investor === user.id);
    return request?.status || 'pending';
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
      approved: 'bg-green-500/10 text-green-500 border-green-500',
      rejected: 'bg-red-500/10 text-red-500 border-red-500'
    };

    const statusLabels = {
      pending: '⏳ Pending Approval',
      approved: '✅ Access Granted',
      rejected: '❌ Request Denied'
    };

    return (
      <span className={`px-3 py-1 border rounded-full text-sm ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  if (!user.isApproved) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-3xl font-bold mb-4">Account Pending Approval</h2>
            <p className="text-gray-400 mb-6">
              Your investor account is awaiting admin approval. Once approved, you'll be able to request access to innovative ideas.
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">My Access Requests</h1>
        <p className="text-gray-400 mb-8">
          Track your requests to view full idea details
        </p>

        {requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-400 mb-6">
              You haven't requested access to any ideas yet
            </p>
            <a
              href="/ideas"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Browse Ideas
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((idea) => {
              const status = getRequestStatus(idea);
              const request = idea.accessRequests?.find(req => req.investor === user.id);
              
              return (
                <div key={idea._id} className="glass p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2">{idea.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Category: {idea.category}</span>
                        <span>•</span>
                        <span>Industry: {idea.industry}</span>
                        <span>•</span>
                        <span>Stage: {idea.stage}</span>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(status)}
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{idea.publicSummary}</p>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="text-sm text-gray-400">
                      Requested on: {new Date(request?.requestedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-3">
                      {status === 'approved' ? (
                        <a
                          href={`/idea/${idea._id}`}
                          className="text-primary hover:underline font-semibold"
                        >
                          View Full Details →
                        </a>
                      ) : (
                        <a
                          href={`/ideas`}
                          className="text-gray-400 hover:text-white"
                        >
                          View in Ideas
                        </a>
                      )}
                    </div>
                  </div>

                  {status === 'rejected' && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded-lg text-sm">
                      Your access request was denied by the idea creator.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
