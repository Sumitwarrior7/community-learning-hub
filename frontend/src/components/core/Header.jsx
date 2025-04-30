import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 h-20 shadow-lg">
      <nav className="container mx-auto px-6 flex justify-between items-center h-full">
        <Link to="/" className="text-4xl font-extrabold text-white">
          Learning Hub
        </Link>

        <div className="flex items-center space-x-8 text-lg">
          <Link to="/" className="text-gray-200 hover:text-white transition duration-200">
            Home
          </Link>

          {user && (
            <Link
              to={user.isAdmin ? '/admin' : '/profile'}
              className="text-gray-200 hover:text-white transition duration-200"
            >
              {user.isAdmin ? 'Admin Dashboard' : 'Profile'}
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className="text-gray-200 hover:text-white transition duration-200">
                Login
              </Link>
              <Link to="/register" className="text-gray-200 hover:text-white transition duration-200">
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white rounded-md text-base font-medium transition duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
