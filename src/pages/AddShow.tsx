import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AddShow: React.FC = () => {
  const navigate = useNavigate();

  const [movieId, setMovieId] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/shows', {
        movieId: Number(movieId),
        theatreId: Number(theatreId),
        startTime,
        ticketPrice: Number(ticketPrice)
      });

      alert('Show added successfully!');
      navigate('/shows');
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        'Failed to add show.'
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border">

        <h1 className="text-3xl font-bold mb-6">
          Add New Show
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="block mb-1 font-semibold">
              Movie ID
            </label>

            <input
              type="number"
              required
              value={movieId}
              onChange={(e) =>
                setMovieId(e.target.value)
              }
              className="w-full border rounded p-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Theatre ID
            </label>

            <input
              type="number"
              required
              value={theatreId}
              onChange={(e) =>
                setTheatreId(e.target.value)
              }
              className="w-full border rounded p-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Start Time
            </label>

            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) =>
                setStartTime(e.target.value)
              }
              className="w-full border rounded p-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Ticket Price
            </label>

            <input
              type="number"
              required
              value={ticketPrice}
              onChange={(e) =>
                setTicketPrice(e.target.value)
              }
              className="w-full border rounded p-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
          >
            Add Show
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddShow;