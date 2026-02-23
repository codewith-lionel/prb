import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const IdeaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchIdeaDetails();
  }, [id]);

  const fetchIdeaDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ideas/${id}`);
      setIdea(response.data.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch idea details');
      navigate('/ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!user.isApproved) {
      alert('Your investor account is pending approval');
      return;
    }

    try {
      setRequesting(true);
      await api.post(`/ideas/${id}/request-access`);
      alert('Access request submitted successfully!');
      fetchIdeaDetails();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to request access');
    } finally {
      setRequesting(false);
    }
  };

  const hasRequestedAccess = () => {
    return idea?.accessRequests?.some(req => req.investor === user.id);
  };

  const hasApprovedAccess = () => {
    return idea?.approvedInvestors?.includes(user.id);
  };

  const getRequestStatus = () => {
    const request = idea?.accessRequests?.find(req => req.investor === user.id);
    return request?.status;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading idea details...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Idea not found</p>
        </div>
      </div>
    );
  }

  const isCreator = user.id === idea.creator?._id;
  const canViewFullDetails = isCreator || hasApprovedAccess() || user.role === 'admin';

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
                <h1 className="text-4xl font-bold mb-3">{idea.title}</h1>
                <div className="flex items-center gap-4 text-gray-400">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    {idea.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                    {idea.industry}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm capitalize">
                    {idea.stage}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-sm text-gray-400 mb-1">Created by</p>
              <p className="font-semibold">{idea.creator?.name}</p>
              <p className="text-sm text-gray-400">
                {new Date(idea.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Public Summary */}
          <div className="glass p-8 rounded-2xl mb-6">
            <h2 className="text-2xl font-semibold mb-4">Public Summary</h2>
            <p className="text-gray-300 leading-relaxed">{idea.publicSummary}</p>
          </div>

          {/* Full Description - Conditional Access */}
          {canViewFullDetails ? (
            <div className="glass p-8 rounded-2xl mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Full Description</h2>
                <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                  ✅ Access Granted
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {idea.fullDescription}
              </p>
            </div>
          ) : (
            <div className="glass p-8 rounded-2xl mb-6">
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🔒</div>
                <h2 className="text-2xl font-semibold mb-3">Full Description Locked</h2>
                <p className="text-gray-400 mb-6">
                  Request access to view the complete idea details and business plan
                </p>

                {user.role === 'investor' ? (
                  hasRequestedAccess() ? (
                    <div>
                      {getRequestStatus() === 'pending' && (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500 text-yellow-500 rounded-lg">
                          ⏳ Your access request is pending approval
                        </div>
                      )}
                      {getRequestStatus() === 'rejected' && (
                        <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
                          ❌ Your access request was denied
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleRequestAccess}
                      disabled={requesting}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition disabled:opacity-50"
                    >
                      {requesting ? 'Requesting...' : 'Request Access'}
                    </button>
                  )
                ) : (
                  <p className="text-gray-400">
                    Only approved investors can request access to full details
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="glass p-6 rounded-xl">
            <h3 className="font-semibold mb-4">Engagement Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-primary">{idea.views?.length || 0}</p>
                <p className="text-sm text-gray-400">Views</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">
                  {idea.accessRequests?.length || 0}
                </p>
                <p className="text-sm text-gray-400">Access Requests</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {idea.approvedInvestors?.length || 0}
                </p>
                <p className="text-sm text-gray-400">Approved Investors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
