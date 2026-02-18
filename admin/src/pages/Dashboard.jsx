import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm uppercase mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-primary">{analytics?.totals.users || 0}</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm uppercase mb-2">Total Ideas</h3>
            <p className="text-4xl font-bold text-primary">{analytics?.totals.ideas || 0}</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm uppercase mb-2">Total Jobs</h3>
            <p className="text-4xl font-bold text-primary">{analytics?.totals.jobs || 0}</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm uppercase mb-2">Applications</h3>
            <p className="text-4xl font-bold text-primary">{analytics?.totals.applications || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Users by Role</h3>
            <div className="space-y-2">
              {analytics?.usersByRole.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span className="capitalize">{item._id}:</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Ideas by Status</h3>
            <div className="space-y-2">
              {analytics?.ideasByStatus.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span className="capitalize">{item._id}:</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Jobs by Status</h3>
            <div className="space-y-2">
              {analytics?.jobsByStatus.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span className="capitalize">{item._id}:</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
