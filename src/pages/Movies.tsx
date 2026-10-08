import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { MovieDTO } from '../types';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get<MovieDTO[]>('/movies');
      setMovies(response.data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Delete handler function
  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      setDeleteLoadingId(id);
      await api.delete(`/movies/${id}`);
      // UI eken movie eka ain karanawa state eka update karala
      setMovies(movies.filter((movie: any) => movie.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete movie.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const genres = Array.from(
    new Set(movies.map((m) => m.genre).filter(Boolean))
  ) as string[];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre
      ? movie.genre === selectedGenre
      : true;

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Now Showing</h1>
        <button
          onClick={() => navigate('/add-movie')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Add Movie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md border">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">
            Search Movies
          </label>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">
            Filter by Genre
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-center text-blue-600 font-semibold">Loading movies...</p>
      )}

      {error && (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      )}

      {!loading && filteredMovies.length === 0 ? (
        <p className="text-center text-gray-500">No movies found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie: any) => (
            <div
              key={movie.id}
              className="bg-white border rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between overflow-hidden"
            >
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

              <div className="p-5 pt-0 space-y-2">
                <button
                  onClick={() => navigate('/shows')}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  View Shows
                </button>
                <button
                  onClick={() => handleDelete(movie.id)}
                  disabled={deleteLoadingId === movie.id}
                  className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleteLoadingId === movie.id ? 'Deleting...' : 'Delete Movie'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;