import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Show {
  id: string;
  movieTitle: string;
  theatreName: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
}

const Shows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedMovie, setSelectedMovie] = useState<string>('');
  const [selectedTheatre, setSelectedTheatre] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shows');
      setShows(response.data);
      setError(null);
    } catch (err: any) {
      setError('Shows ලබාගැනීමේදී දෝෂයක් සිදු විය.');
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredShows = shows.filter((show) => {
    const matchMovie = selectedMovie ? show.movieTitle.toLowerCase().includes(selectedMovie.toLowerCase()) : true;
    const matchTheatre = selectedTheatre ? show.theatreName.toLowerCase().includes(selectedTheatre.toLowerCase()) : true;
    const matchDate = selectedDate ? show.showDate === selectedDate : true;
    return matchMovie && matchTheatre && matchDate;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Shows</h1>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md">
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

      {loading && <p className="text-center text-blue-600">Loading shows...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Shows Grid */}
      {!loading && filteredShows.length === 0 ? (
        <p className="text-center text-gray-500">නොමැත / No shows found matching the filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShows.map((show) => (
            <div key={show.id} className="bg-white border p-5 rounded-xl shadow hover:shadow-lg transition duration-200">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{show.movieTitle}</h2>
              <p className="text-gray-600"><strong>Theatre:</strong> {show.theatreName}</p>
              <p className="text-gray-600"><strong>Date:</strong> {show.showDate}</p>
              <p className="text-gray-600"><strong>Time:</strong> {show.showTime}</p>
              <p className="text-blue-600 font-bold text-lg mt-2">LKR {show.ticketPrice.toFixed(2)}</p>
              
              <button
                onClick={() => navigate(`/book/${show.id}`)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Book Seats
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shows;