import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type {
  ShowDTO,
  MovieDTO,
  TheatreDTO,
  BookingDTO
} from '../types';

interface FullShowDetails extends ShowDTO {
  movie?: MovieDTO;
  theatre?: TheatreDTO;
}

const ALL_SEATS = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
];

const Booking: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<FullShowDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (showId) {
      fetchShowInfo();
    }
  }, [showId]);

  const fetchShowInfo = async () => {
    try {
      setLoading(true);
      const showRes = await api.get<ShowDTO>(`/shows/${showId}`);
      
      const [movieRes, theatreRes] = await Promise.all([
        api.get<MovieDTO>(`/movies/${showRes.data.movieId}`),
        api.get<TheatreDTO>(`/theatres/${showRes.data.theatreId}`)
      ]);

      setShow({
        ...showRes.data,
        movie: movieRes.data,
        theatre: theatreRes.data
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Show detail faild.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: string) => {
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
      setMessage({ type: 'error', text: 'please select one seat .' });
      return;
    }

    const userId = Number(localStorage.getItem('userId')) || 1; 

    const bookingPayload: BookingDTO = {
      userId: userId,
      showId: Number(showId),
      numberOfSeats: selectedSeats.length,
      totalPrice: calculateTotal(),
      status: 'PENDING'
    };

    try {
      setSubmitting(true);
      setMessage(null);

      const response = await api.post('/bookings', bookingPayload);
      setMessage({ type: 'success', text: 'Booking is scucess!' });

      setTimeout(() => {
        navigate(`/payment/${response.data.id || ''}`);
      }, 1500);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Booking eror.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center p-6 text-blue-600 font-semibold">Loading show details...</p>;
  if (!show) return <p className="text-center p-6 text-red-500 font-semibold">Show details not found.</p>;

  const showTimeDate = new Date(show.startTime);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 border">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Seat Booking</h1>

      <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
        <h2 className="text-xl font-bold text-blue-700">{show.movie?.title}</h2>
        <div className="flex flex-wrap gap-6 mt-2 text-gray-600">
          <p><strong>Theatre:</strong> {show.theatre?.name}</p>
          <p><strong>Date:</strong> {showTimeDate.toLocaleDateString()}</p>
          <p><strong>Time:</strong> {showTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Ticket Price:</strong> LKR {show.ticketPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="w-full bg-gray-300 text-center text-xs py-1 rounded tracking-widest text-gray-700 font-semibold mb-8 uppercase">
        --- SCREEN THIS WAY ---
      </div>

      <div className="grid grid-cols-6 gap-3 max-w-md mx-auto mb-8">
        {ALL_SEATS.map((seat) => {
          const isSelected = selectedSeats.includes(seat);
          return (
            <button
              key={seat}
              onClick={() => handleSeatClick(seat)}
              className={`p-3 text-center rounded border font-medium transition ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold border-blue-600 shadow'
                  : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100'
              }`}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-600">Selected Seats: <span className="font-bold text-gray-800">{selectedSeats.join(', ') || 'None'}</span></p>
            <p className="text-gray-600">Number of Seats: <span className="font-bold text-gray-800">{selectedSeats.length}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Price</p>
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
          {submitting ? 'Processing Booking...' : 'Confirm & Proceed'}
        </button>
      </div>
    </div>
  );
};

export default Booking;