import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await api.get('/admin/ideas/pending');
      setIdeas(response.data.data);
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ideaId, status) => {
    try {
      await api.put(`/admin/ideas/${ideaId}`, { status });
      fetchIdeas();
      alert(`Idea ${status} successfully`);
    } catch (error) {
      alert('Failed to update idea');
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
        <h1 className="text-4xl font-bold mb-8">Pending Ideas</h1>

        {ideas.length === 0 ? (
          <div className="glass p-8 rounded-xl text-center">
            <p className="text-gray-400 text-lg">No pending ideas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea) => (
              <div key={idea._id} className="glass p-6 rounded-xl">
                <h3 className="text-2xl font-semibold mb-2">{idea.title}</h3>
                <p className="text-gray-400 mb-4">
                  By: {idea.creator.name} ({idea.creator.email})
                </p>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-gray-500">Category:</span> {idea.category}
                  </div>
                  <div>
                    <span className="text-gray-500">Industry:</span> {idea.industry}
                  </div>
                  <div>
                    <span className="text-gray-500">Stage:</span> {idea.stage}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Public Summary:</h4>
                  <p className="text-gray-300">{idea.publicSummary}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Full Description:</h4>
                  <p className="text-gray-300">{idea.fullDescription}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(idea._id, 'approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(idea._id, 'rejected')}
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

export default Ideas;
