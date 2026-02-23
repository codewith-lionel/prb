import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="glass border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-primary">
            iBLAZE
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-primary transition">
              Dashboard
            </Link>
            
            {/* Student Navigation */}
            {user.role === 'student' && (
              <>
                <Link to="/ideas" className="hover:text-primary transition">
                  Ideas
                </Link>
                <Link to="/jobs" className="hover:text-primary transition">
                  Jobs
                </Link>
                <Link to="/my-ideas" className="hover:text-primary transition">
                  My Ideas
                </Link>
                <Link to="/my-applications" className="hover:text-primary transition">
                  Applications
                </Link>
              </>
            )}
            
            {/* Investor Navigation */}
            {user.role === 'investor' && (
              <>
                <Link to="/ideas" className="hover:text-primary transition">
                  Ideas
                </Link>
                <Link to="/my-requests" className="hover:text-primary transition">
                  My Requests
                </Link>
              </>
            )}
            
            {/* Employer Navigation */}
            {user.role === 'employer' && (
              <>
                <Link to="/post-job" className="hover:text-primary transition">
                  Post Job
                </Link>
                <Link to="/my-jobs" className="hover:text-primary transition">
                  My Jobs
                </Link>
              </>
            )}
            
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <span className="text-sm text-gray-400">
                {user.name}
              </span>
              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full capitalize">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
