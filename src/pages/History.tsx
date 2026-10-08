import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import type { BookingDTO, ShowDTO, MovieDTO } from '../types';

interface FullBookingDetails extends BookingDTO {
  show?: ShowDTO;
  movie?: MovieDTO;
}

const History: React.FC = () => {
  const [bookings, setBookings] = useState<FullBookingDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || '1';
      const response = await api.get<BookingDTO[]>(`/bookings/user/${userId}`);

      const detailedBookings = await Promise.all(
        response.data.map(async (booking) => {
          try {
            const showRes = await api.get<ShowDTO>(`/shows/${booking.showId}`);
            const movieRes = await api.get<MovieDTO>(`/movies/${showRes.data.movieId}`);
            return {
              ...booking,
              show: showRes.data,
              movie: movieRes.data,
            };
          } catch {
            return booking;
          }
        })
      );

      setBookings(detailedBookings);
      setError(null);
    } catch (err: any) {
      setError('Failed to load booking history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setMessage(null);

      await api.delete(`/bookings/${bookingId}/cancel`);
      
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
        )
      );

      setMessage({ type: 'success', text: 'Booking cancelled successfully.' });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to cancel booking.',
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 border">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Booking History</h1>

      {message && (
        <div
          className={`p-3 rounded-lg mb-6 text-center font-medium ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading && (
        <p className="text-center text-blue-600 font-semibold py-8">Loading booking history...</p>
      )}

      {error && (
        <p className="text-center text-red-500 font-semibold py-8">{error}</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p className="text-center text-gray-500 py-8">No booking records found.</p>
      )}

      {!loading && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const bookingDate = booking.bookingTime
              ? new Date(booking.bookingTime).toLocaleString()
              : 'N/A';

            const isCancelled = booking.status === 'CANCELLED';

            return (
              <div
                key={booking.id}
                className="border rounded-xl p-5 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800">
                      {booking.movie?.title || `Show #${booking.showId}`}
                    </h2>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                        isCancelled
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {booking.status || 'CONFIRMED'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    <strong>Booking ID:</strong> #{booking.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Seats Reserved:</strong> {booking.numberOfSeats}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Booked Date:</strong> {bookingDate}
                  </p>
                  <p className="text-sm text-gray-800 font-semibold">
                    Total Amount: LKR {booking.totalPrice?.toFixed(2)}
                  </p>
                </div>

                <div className="w-full md:w-auto text-right">
                  {!isCancelled ? (
                    <button
                      onClick={() => booking.id && handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className={`w-full md:w-auto px-4 py-2 rounded-lg text-white font-semibold transition ${
                        cancellingId === booking.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  ) : (
                    <span className="text-sm font-semibold text-gray-400">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;