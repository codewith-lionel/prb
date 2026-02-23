import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const AccessRequests = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

  useEffect(() => {
    fetchIdeasWithRequests();
  }, []);

  const fetchIdeasWithRequests = async () => {
    try {
      setLoading(true);
      // Fetch all ideas (not just pending)
      const response = await api.get('/ideas');
      // Filter ideas that have access requests
      const ideasWithRequests = response.data.data.filter(
        idea => idea.accessRequests && idea.accessRequests.length > 0
      );
      setIdeas(ideasWithRequests);
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (ideaId, requestId, status) => {
    try {
      await api.put(`/ideas/${ideaId}/access-request/${requestId}`, { status });
      alert(`Access request ${status} successfully`);
      fetchIdeasWithRequests();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update request');
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

  const filterRequests = (requests) => {
    if (filter === 'all') return requests;
    return requests.filter(req => req.status === filter);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading access requests...</p>
        </div>
      </div>
    );
  }

  // Get all requests from all ideas
  const allRequests = ideas.flatMap(idea => 
    (idea.accessRequests || []).map(request => ({
      ...request,
      ideaId: idea._id,
      ideaTitle: idea.title,
      ideaCategory: idea.category,
      ideaCreator: idea.creator
    }))
  );

  const filteredRequests = filterRequests(allRequests);
  const pendingCount = allRequests.filter(r => r.status === 'pending').length;
  const approvedCount = allRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = allRequests.filter(r => r.status === 'rejected').length;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Access Requests Management</h1>
          <p className="text-gray-400">Manage investor requests to view full idea details</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Total Requests</p>
            <p className="text-3xl font-bold">{allRequests.length}</p>
          </div>
          <div className="glass p-6 rounded-xl border-yellow-500/30">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
          </div>
          <div className="glass p-6 rounded-xl border-green-500/30">
            <p className="text-gray-400 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-500">{approvedCount}</p>
          </div>
          <div className="glass p-6 rounded-xl border-red-500/30">
            <p className="text-gray-400 text-sm mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-500">{rejectedCount}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'glass hover:bg-white/5'
            }`}
          >
            All ({allRequests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'glass hover:bg-white/5'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'approved' 
                ? 'bg-green-500 text-white' 
                : 'glass hover:bg-white/5'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'rejected' 
                ? 'bg-red-500 text-white' 
                : 'glass hover:bg-white/5'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="glass p-8 rounded-xl text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 text-lg">
              {filter === 'all' 
                ? 'No access requests found' 
                : `No ${filter} access requests`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request._id} className="glass p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {request.ideaTitle}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded">
                        {request.ideaCategory}
                      </span>
                      <span>Creator: {request.ideaCreator?.name}</span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Investor</p>
                      <p className="font-semibold">{request.investor?.name}</p>
                      <p className="text-gray-400 text-xs">{request.investor?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Requested On</p>
                      <p className="font-semibold">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(request.requestedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Status</p>
                      <p className="font-semibold capitalize">{request.status}</p>
                    </div>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleUpdateRequest(request.ideaId, request._id, 'approved')}
                      className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition font-semibold"
                    >
                      ✅ Approve Access
                    </button>
                    <button
                      onClick={() => handleUpdateRequest(request.ideaId, request._id, 'rejected')}
                      className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold"
                    >
                      ❌ Reject Access
                    </button>
                  </div>
                )}

                {request.status === 'approved' && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="p-3 bg-green-500/10 border border-green-500 text-green-400 rounded-lg text-sm">
                      ✅ This investor has been granted access to view the full idea description
                    </div>
                  </div>
                )}

                {request.status === 'rejected' && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 rounded-lg text-sm">
                      ❌ Access request was rejected
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessRequests;
