import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="glass p-8 rounded-2xl mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-gray-400 text-lg">
            Role: <span className="text-primary">{user.role}</span>
          </p>
        </div>

        {user.role === 'investor' && !user.isApproved && (
          <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-6 py-4 rounded-lg mb-8">
            <p className="font-semibold">⏳ Your investor account is pending approval</p>
            <p className="text-sm mt-1">You will be able to request access to ideas once approved by an admin.</p>
          </div>
        )}

        {user.role === 'employer' && !user.isVerified && (
          <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-6 py-4 rounded-lg mb-8">
            <p className="font-semibold">⏳ Your employer account is pending verification</p>
            <p className="text-sm mt-1">You will be able to post jobs once verified by an admin.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.role === 'student' && (
            <>
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Browse Ideas</h3>
                <p className="text-gray-400 mb-4">Discover innovative ideas</p>
                <a href="/ideas" className="text-primary hover:underline">
                  View Ideas →
                </a>
              </div>

              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Find Jobs</h3>
                <p className="text-gray-400 mb-4">Apply to exciting opportunities</p>
                <a href="/jobs" className="text-primary hover:underline">
                  Browse Jobs →
                </a>
              </div>

              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Submit Your Idea</h3>
                <p className="text-gray-400 mb-4">Share your innovation</p>
                <a href="/my-ideas" className="text-primary hover:underline">
                  My Ideas →
                </a>
              </div>
            </>
          )}

          {user.role === 'investor' && (
            <>
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Browse Ideas</h3>
                <p className="text-gray-400 mb-4">Find investment opportunities</p>
                <a href="/ideas" className="text-primary hover:underline">
                  View Ideas →
                </a>
              </div>

              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">My Requests</h3>
                <p className="text-gray-400 mb-4">Track your access requests</p>
                <a href="/my-requests" className="text-primary hover:underline">
                  View Requests →
                </a>
              </div>
            </>
          )}

          {user.role === 'employer' && (
            <>
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
                <p className="text-gray-400 mb-4">Find talented candidates</p>
                <a href="/create-job" className="text-primary hover:underline">
                  Create Job →
                </a>
              </div>

              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">My Jobs</h3>
                <p className="text-gray-400 mb-4">Manage your job postings</p>
                <a href="/my-jobs" className="text-primary hover:underline">
                  View Jobs →
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
