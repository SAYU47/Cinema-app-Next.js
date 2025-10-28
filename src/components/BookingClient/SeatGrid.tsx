'use client';
import { BookingSeat, SessionInfo } from '@/types/booking';

interface SeatGridProps {
  session: SessionInfo;
  selectedSeats: BookingSeat[];
  isAuthorized: boolean;
  onSeatClick: (rowNumber: number, seatNumber: number) => void;
  getSeatStatus: (row: number, column: number) => string;
  isSeatDisabled: (status: string) => boolean;
}

export default function SeatGrid({
  session,
  selectedSeats,
  isAuthorized,
  onSeatClick,
  getSeatStatus,
  isSeatDisabled,
}: SeatGridProps) {
  const rows = session.seats?.rows || 0;
  const columns = session.seats?.seatsPerRow || 0;

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex flex-col items-center gap-2">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-2">
            <span className="w-12 text-sm font-medium text-gray-600 whitespace-nowrap">
              {`ряд ${rowIndex + 1}`}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: columns }, (_, columnIndex) => {
                const status = getSeatStatus(rowIndex, columnIndex);
                const rowNumber = rowIndex + 1;
                const seatNumber = columnIndex + 1;
                const disabled = isSeatDisabled(status);

                return (
                  <button
                    key={columnIndex}
                    onClick={() => onSeatClick(rowNumber, seatNumber)}
                    disabled={disabled}
                    className={`
                      w-8 h-8 rounded border-2 text-xs font-medium transition-all
                      ${
                        status === 'available'
                          ? 'bg-green-500 border-green-600 hover:bg-green-600 text-white cursor-pointer'
                          : status === 'booked'
                            ? 'bg-red-500 border-red-600 cursor-not-allowed text-white'
                            : 'bg-blue-500 border-blue-600 text-white cursor-pointer'
                      }
                      ${!isAuthorized && status === 'available' ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {columnIndex + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
