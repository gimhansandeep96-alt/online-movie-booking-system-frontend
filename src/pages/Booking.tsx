import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface ShowDetails {
  id: string;
  movieTitle: string;
  theatreName: string;
  showDate: string;
  showTime: string;
  ticketPrice: number;
}

const ALL_SEATS = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
];

const Booking: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<ShowDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]); // Already booked seats from backend
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchShowAndSeats();
  }, [showId]);

  const fetchShowAndSeats = async () => {
    try {
      setLoading(true);
      const showRes = await api.get(`/shows/${showId}`);
      setShow(showRes.data);

      // Book කර ඇති seats ලබා ගැනීමට (optional API endpoint එකක් තියෙනවා නම්)
      const bookedRes = await api.get(`/shows/${showId}/booked-seats`);
      setBookedSeats(bookedRes.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Show විස්තර ලබාගැනීමට අපොහොසත් විය.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: string) => {
    if (bookedSeats.includes(seat)) return; // Already booked නම් select කරන්න බෑ

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const calculateTotal = () => {
    return show ? selectedSeats.length * show.ticketPrice : 0;
  };

  const handleBookingSubmit = async () => {
    if (selectedSeats.length === 0) {
      setMessage({ type: 'error', text: 'කරුණාකර අවම වශයෙන් එක ආසනයක්වත් (Seat) තෝරන්න.' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const bookingData = {
        showId,
        seats: selectedSeats,
        totalAmount: calculateTotal(),
      };

      await api.post('/bookings', bookingData);
      setMessage({ type: 'success', text: 'Booking එක සාර්ථකයි!' });

      setTimeout(() => {
        navigate('/history'); // Booking history page එකට navigate වීම
      }, 2000);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Booking එක සිදුකිරීමේදී දෝෂයක් සිදු විය.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center p-6 text-blue-600">Loading show details...</p>;
  if (!show) return <p className="text-center p-6 text-red-500">Show details not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Seat Booking</h1>

      {/* Show Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
        <h2 className="text-xl font-bold text-blue-700">{show.movieTitle}</h2>
        <div className="flex flex-wrap gap-6 mt-2 text-gray-600">
          <p><strong>Theatre:</strong> {show.theatreName}</p>
          <p><strong>Date:</strong> {show.showDate}</p>
          <p><strong>Time:</strong> {show.showTime}</p>
          <p><strong>Price per seat:</strong> LKR {show.ticketPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Screen Indicator */}
      <div className="w-full bg-gray-300 text-center text-xs py-1 rounded tracking-widest text-gray-700 font-semibold mb-8 uppercase">
        --- SCREEN THIS WAY ---
      </div>

      {/* Seat Layout Grid */}
      <div className="grid grid-cols-6 gap-3 max-w-md mx-auto mb-8">
        {ALL_SEATS.map((seat) => {
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          let seatStyle = 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100';
          if (isBooked) {
            seatStyle = 'bg-red-400 text-white cursor-not-allowed';
          } else if (isSelected) {
            seatStyle = 'bg-blue-600 text-white font-bold border-blue-600';
          }

          return (
            <button
              key={seat}
              disabled={isBooked}
              onClick={() => handleSeatClick(seat)}
              className={`p-3 text-center rounded border font-medium transition ${seatStyle}`}
            >
              {seat}
            </button>
          );
        })}
      </div>

      {/* Summary & Confirm */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-600">Selected Seats: <span className="font-bold text-gray-800">{selectedSeats.join(', ') || 'None'}</span></p>
            <p className="text-gray-600">Total Tickets: <span className="font-bold text-gray-800">{selectedSeats.length}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">LKR {calculateTotal().toFixed(2)}</p>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded mb-4 text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleBookingSubmit}
          disabled={submitting || selectedSeats.length === 0}
          className={`w-full py-3 rounded-lg text-white font-bold text-lg transition ${
            submitting || selectedSeats.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {submitting ? 'Confirming Booking...' : 'Confirm & Proceed to Pay'}
        </button>
      </div>
    </div>
  );
};

export default Booking;