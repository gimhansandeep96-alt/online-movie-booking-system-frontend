import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { ShowDTO, MovieDTO, TheatreDTO } from '../types';

interface ShowDetails extends ShowDTO {
  movie?: MovieDTO;
  theatre?: TheatreDTO;
}

const Shows: React.FC = () => {
  const [shows, setShows] = useState<ShowDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<number | string | null>(null);

  const [selectedMovie, setSelectedMovie] = useState<string>('');
  const [selectedTheatre, setSelectedTheatre] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchShowsData();
  }, []);

  const fetchShowsData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, theatresRes] = await Promise.all([
        api.get<ShowDTO[]>('/shows'),
        api.get<MovieDTO[]>('/movies'),
        api.get<TheatreDTO[]>('/theatres')
      ]);

      const moviesMap = new Map(moviesRes.data.map(m => [m.id, m]));
      const theatresMap = new Map(theatresRes.data.map(t => [t.id, t]));

      const mappedShows: ShowDetails[] = showsRes.data.map(show => ({
        ...show,
        movie: moviesMap.get(Number(show.movieId)),
        theatre: theatresMap.get(Number(show.theatreId))
      }));

      setShows(mappedShows);
      setError(null);
    } catch (err: any) {
      setError('Failed to load shows data.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Show Handler
  const handleDeleteShow = async (id?: number | string) => {
    if (!id) return;

    if (!window.confirm('Are you sure you want to delete this show?')) {
      return;
    }

    try {
      setDeleteLoadingId(id);
      await api.delete(`/shows/${id}`);
      setShows((prev) => prev.filter((show) => show.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete show.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const filteredShows = shows.filter((show) => {
    const movieTitle = show.movie?.title?.toLowerCase() || '';
    const theatreName = show.theatre?.name?.toLowerCase() || '';
    const showDate = show.startTime ? show.startTime.split('T')[0] : '';

    const matchMovie = selectedMovie ? movieTitle.includes(selectedMovie.toLowerCase()) : true;
    const matchTheatre = selectedTheatre ? theatreName.includes(selectedTheatre.toLowerCase()) : true;
    const matchDate = selectedDate ? showDate === selectedDate : true;

    return matchMovie && matchTheatre && matchDate;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Available Shows</h1>
        <button
          onClick={() => navigate('/add-show')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Add Show
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md border">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">Filter by Movie</label>
          <input
            type="text"
            placeholder="Search Movie..."
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">Filter by Theatre</label>
          <input
            type="text"
            placeholder="Search Theatre..."
            value={selectedTheatre}
            onChange={(e) => setSelectedTheatre(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">Filter by Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading && <p className="text-center text-blue-600 font-semibold">Loading shows...</p>}
      {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

      {!loading && filteredShows.length === 0 ? (
        <p className="text-center text-gray-500">No shows found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShows.map((show) => {
            const dateObj = new Date(show.startTime);
            return (
              <div key={show.id} className="bg-white border p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{show.movie?.title || 'Unknown Movie'}</h2>
                  <p className="text-gray-600 text-sm"><strong>Theatre:</strong> {show.theatre?.name || 'N/A'}</p>
                  <p className="text-gray-600 text-sm"><strong>Location:</strong> {show.theatre?.location || 'N/A'}</p>
                  <p className="text-gray-600 text-sm"><strong>Date:</strong> {dateObj.toLocaleDateString()}</p>
                  <p className="text-gray-600 text-sm"><strong>Time:</strong> {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-blue-600 font-bold text-lg mt-2">LKR {show.ticketPrice?.toFixed(2)}</p>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => navigate(`/book/${show.id}`)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Book Seats
                  </button>
                  <button
                    onClick={() => handleDeleteShow(show.id)}
                    disabled={deleteLoadingId === show.id}
                    className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {deleteLoadingId === show.id ? 'Deleting...' : 'Delete Show'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Shows;