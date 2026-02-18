import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ideas');
      setIdeas(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (ideaId) => {
    try {
      await api.post(`/ideas/${ideaId}/request-access`);
      alert('Access request submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to request access');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Ideas</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {ideas.length === 0 ? (
          <div className="glass p-8 rounded-xl text-center">
            <p className="text-gray-400 text-lg">No ideas available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div key={idea._id} className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">{idea.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {idea.publicSummary}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span>{idea.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Industry:</span>
                    <span>{idea.industry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Stage:</span>
                    <span className="capitalize">{idea.stage}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/ideas/${idea._id}`}
                    className="flex-1 text-center bg-primary hover:bg-pink-600 px-4 py-2 rounded-lg transition"
                  >
                    View Details
                  </a>
                  <button
                    onClick={() => handleRequestAccess(idea._id)}
                    className="flex-1 bg-dark-700 hover:bg-dark-600 px-4 py-2 rounded-lg transition"
                  >
                    Request Access
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

export default Ideas;
