import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Navbar } from '../components/Navbar';

interface Movie {
  id: number;
  title: string;
  genre: string;
  durationMinutes: number;
  description: string;
}

export const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/api/movies');
        setMovies(response.data);
      } catch (err) {
        console.error('Failed to fetch movies', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-slate-100 border-b border-slate-800 pb-4">
          Now Showing
        </h1>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No movies available right now.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-purple-500/50 transition">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-slate-100">{movie.title}</h2>
                    <span className="bg-purple-900/50 text-purple-300 text-xs px-2.5 py-1 rounded-full border border-purple-700/40">
                      {movie.genre}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3">{movie.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">{movie.durationMinutes} mins</span>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    Book Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};