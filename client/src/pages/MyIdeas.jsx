import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const MyIdeas = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyIdeas();
  }, []);

  const fetchMyIdeas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ideas');
      // Filter to show only user's own ideas
      const myIdeas = response.data.data;
      setIdeas(myIdeas);
    } catch (err) {
      console.error('Failed to fetch ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ideaId) => {
    if (!window.confirm('Are you sure you want to delete this idea?')) return;

    try {
      await api.delete(`/ideas/${ideaId}`);
      alert('Idea deleted successfully');
      fetchMyIdeas();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete idea');
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
          <p className="text-xl">Loading your ideas...</p>
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
            <h1 className="text-4xl font-bold mb-2">My Ideas</h1>
            <p className="text-gray-400">Manage your submitted ideas</p>
          </div>
          <button
            onClick={() => navigate('/submit-idea')}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            + Submit New Idea
          </button>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💡</div>
            <p className="text-xl text-gray-400 mb-6">
              You haven't submitted any ideas yet
            </p>
            <button
              onClick={() => navigate('/submit-idea')}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Submit Your First Idea
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {ideas.map((idea) => (
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
                    {getStatusBadge(idea.status)}
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{idea.publicSummary}</p>

                <div className="flex items-center gap-4 text-sm border-t border-white/10 pt-4">
                  <span className="text-gray-400">
                    Views: {idea.views?.length || 0}
                  </span>
                  <span className="text-gray-400">
                    Access Requests: {idea.accessRequests?.length || 0}
                  </span>
                  <span className="text-gray-400">
                    Created: {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => navigate(`/idea/${idea._id}`)}
                    className="text-primary hover:underline"
                  >
                    View Details
                  </button>
                  {idea.status === 'pending' && (
                    <>
                      <button
                        onClick={() => navigate(`/edit-idea/${idea._id}`)}
                        className="text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(idea._id)}
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

export default MyIdeas;
