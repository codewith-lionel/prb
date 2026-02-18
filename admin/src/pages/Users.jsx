import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await api.put(`/admin/users/${userId}`, updates);
      fetchUsers();
      alert('User updated successfully');
    } catch (error) {
      alert('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">User Management</h1>

        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-800">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Verified</th>
                <th className="px-6 py-4 text-left">Approved</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-800">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`capitalize px-3 py-1 rounded-full text-sm ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={user.isVerified ? 'text-green-500' : 'text-yellow-500'}>
                      {user.isVerified ? '✓' : '✗'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={user.isApproved ? 'text-green-500' : 'text-yellow-500'}>
                      {user.isApproved ? '✓' : '✗'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {user.role === 'investor' && !user.isApproved && (
                        <button
                          onClick={() => handleUpdateUser(user._id, { isApproved: true })}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                        >
                          Approve
                        </button>
                      )}
                      
                      {user.role === 'employer' && !user.isVerified && (
                        <button
                          onClick={() => handleUpdateUser(user._id, { isVerified: true })}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                        >
                          Verify
                        </button>
                      )}
                      
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUpdateUser(user._id, { status: 'suspended' })}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateUser(user._id, { status: 'active' })}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
