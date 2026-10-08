import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieDTO } from '../types';

interface MovieCardProps {
  movie: MovieDTO;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between overflow-hidden">
      <div className="p-5">
        <span className="text-xs font-semibold uppercase px-2 py-1 bg-blue-100 text-blue-800 rounded">
          {movie.genre || 'General'}
        </span>

        <h2 className="text-xl font-bold text-gray-800 mt-2 mb-2">
          {movie.title}
        </h2>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {movie.description || 'No description available.'}
        </p>

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Duration:</strong> {movie.duration ? `${movie.duration} mins` : 'N/A'}
          </p>
          <p>
            <strong>Language:</strong> {movie.language || 'N/A'}
          </p>
          <p>
            <strong>Release Date:</strong> {movie.releaseDate || 'N/A'}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={() => navigate('/shows')}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          View Shows
        </button>
      </div>
    </div>
  );
};

export default MovieCard;