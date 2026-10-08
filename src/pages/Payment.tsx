import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { BookingDTO, PaymentDTO } from '../types';

const Payment: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('CARD');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get<BookingDTO>(`/bookings/${bookingId}`);
      setBooking(response.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to retrieve booking details.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) return;

    const paymentPayload = {
      bookingId: booking.id,
      amount: booking.totalPrice,
      paymentMethod: paymentMethod,
      status: 'SUCCESS',
      transactionId: `TXN-${Date.now()}`
    };

    try {
      setSubmitting(true);
      setMessage(null);

      await api.post('/payments', paymentPayload);
      setMessage({ type: 'success', text: 'Payment successful! Redirecting to booking history...' });

      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Payment processing failed. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center p-6 text-blue-600 font-semibold">Loading payment details...</p>;
  if (!booking) return <p className="text-center p-6 text-red-500 font-semibold">Booking record not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 border">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Payment Process</h1>

      <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Order Summary</h2>
        <div className="space-y-1 text-sm text-gray-600">
          <p><strong>Booking ID:</strong> #{booking.id}</p>
          <p><strong>Number of Seats:</strong> {booking.numberOfSeats}</p>
          <p className="text-base text-gray-800 mt-2">
            <strong>Total Amount:</strong> <span className="text-green-600 font-bold">LKR {booking.totalPrice?.toFixed(2)}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Select Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CARD">Credit / Debit Card</option>
            <option value="ONLINE_BANKING">Online Banking</option>
            <option value="WALLET">Digital Wallet</option>
          </select>
        </div>

        {paymentMethod === 'CARD' && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Card Number</label>
              <input
                type="text"
                placeholder="4532 •••• •••• 8900"
                required
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  required
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">CVC / CVV</label>
                <input
                  type="password"
                  placeholder="123"
                  maxLength={4}
                  required
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`p-3 rounded text-center text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-lg text-white font-bold text-lg transition ${
            submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {submitting ? 'Processing Payment...' : `Pay LKR ${booking.totalPrice?.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default Payment;