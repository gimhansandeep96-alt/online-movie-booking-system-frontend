import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/movies" className="text-xl font-bold tracking-wide text-purple-400">
        🎬 CineBooking
      </Link>
      
      <div className="flex items-center space-x-6">
        <Link to="/movies" className="hover:text-purple-300 transition">Movies</Link>
        {role === 'ADMIN' && (
          <Link to="/admin/add-movie" className="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded text-sm font-medium transition">
            + Add Movie
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded text-sm font-medium border border-red-500/30 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};