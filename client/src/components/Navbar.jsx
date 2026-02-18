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
            
            {user.role === 'student' && (
              <Link to="/jobs" className="hover:text-primary transition">
                Jobs
              </Link>
            )}
            
            {(user.role === 'investor' || user.role === 'student') && (
              <Link to="/ideas" className="hover:text-primary transition">
                Ideas
              </Link>
            )}
            
            {user.role === 'employer' && (
              <Link to="/my-jobs" className="hover:text-primary transition">
                My Jobs
              </Link>
            )}
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {user.name} ({user.role})
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
