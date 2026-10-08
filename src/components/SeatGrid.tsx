import React from 'react';

interface SeatGridProps {
  allSeats: string[];
  selectedSeats: string[];
  bookedSeats?: string[];
  onSeatClick: (seat: string) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({
  allSeats,
  selectedSeats,
  bookedSeats = [],
  onSeatClick,
}) => {
  return (
    <div className="w-full max-w-md mx-auto my-6">
      <div className="w-full bg-gray-300 text-center text-xs py-1.5 rounded tracking-widest text-gray-700 font-semibold mb-8 uppercase">
        --- SCREEN THIS WAY ---
      </div>

      <div className="grid grid-cols-6 gap-3">
        {allSeats.map((seat) => {
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          let buttonStyle = 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100';

          if (isBooked) {
            buttonStyle = 'bg-red-400 text-white border-red-400 cursor-not-allowed';
          } else if (isSelected) {
            buttonStyle = 'bg-blue-600 text-white border-blue-600 font-bold shadow';
          }

          return (
            <button
              key={seat}
              type="button"
              disabled={isBooked}
              onClick={() => onSeatClick(seat)}
              className={`p-3 text-center rounded-lg border font-medium text-sm transition-all duration-150 ${buttonStyle}`}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 mt-6 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-100 border border-gray-300 rounded inline-block"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-600 rounded inline-block"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-400 rounded inline-block"></span>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;