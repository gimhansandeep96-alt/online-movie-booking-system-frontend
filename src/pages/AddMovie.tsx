import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AddMovie: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    language: '',
    genre: '',
    releaseDate: '',
    status: 'UPCOMING'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setMessage('');

      await api.post('/movies', {
        title: formData.title,
        description: formData.description,
        duration: Number(formData.duration),
        language: formData.language,
        genre: formData.genre,
        releaseDate: formData.releaseDate,
        status: formData.status
      });

      setMessage('Movie added successfully!');

      setTimeout(() => {
        navigate('/movies');
      }, 1500);

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to add movie.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-white rounded-xl shadow-lg border">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Add New Movie
      </h1>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">
            Movie Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">
              Duration (Minutes)
            </label>
            <input
              type="number"
              name="duration"
              required
              value={formData.duration}
              onChange={handleChange}
              className="w-full border rounded p-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Language
            </label>
            <input
              type="text"
              name="language"
              required
              value={formData.language} 
              onChange={handleChange}
              className="w-full border rounded p-3"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Genre
          </label>
          <input
            type="text"
            name="genre"
            required
            value={formData.genre}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Release Date
          </label>
          <input
            type="date"
            name="releaseDate"
            required
            value={formData.releaseDate}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded p-3"
          >
            <option value="UPCOMING">Upcoming</option>
            <option value="NOW_SHOWING">Now Showing</option>
            <option value="ENDED">Ended</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold p-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Adding Movie...' : 'Add Movie'}
        </button>
      </form>
    </div>
  );
};

export default AddMovie;