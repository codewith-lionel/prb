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
            iBLAZE Admin
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-primary transition">
              Dashboard
            </Link>
            <Link to="/users" className="hover:text-primary transition">
              Users
            </Link>
            <Link to="/ideas" className="hover:text-primary transition">
              Ideas
            </Link>
            <Link to="/jobs" className="hover:text-primary transition">
              Jobs
            </Link>
            <Link to="/access-requests" className="hover:text-primary transition">
              Access Requests
            </Link>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{user.name}</span>
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
