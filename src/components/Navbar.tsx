import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link
          to="/movies"
          className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition"
        >
          🎬 CineBooking
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/movies"
            className="hover:text-purple-300 transition"
          >
            Movies
          </Link>

          <Link
            to="/shows"
            className="hover:text-purple-300 transition"
          >
            Shows
          </Link>

          <Link
            to="/history"
            className="hover:text-purple-300 transition"
          >
            Booking History
          </Link>

          

          <span className="text-sm text-gray-300 border border-gray-600 px-3 py-1 rounded-full">
            {role || 'USER'}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;