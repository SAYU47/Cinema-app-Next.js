import { BookingSeat } from '@/types/booking';

interface BookingInfoProps {
  selectedSeats: BookingSeat[];
  bookingLoading: boolean;
  onBooking: () => void;
}

export default function BookingInfo({
  selectedSeats,
  bookingLoading,
  onBooking,
}: BookingInfoProps) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">
          Информация о бронировании
        </h3>
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Выбрано мест:{' '}
            <span className="font-semibold">{selectedSeats.length}</span>
          </p>
        </div>

        <button
          onClick={onBooking}
          disabled={bookingLoading}
          className={`
            w-full max-w-xs py-3 px-6 rounded-lg font-semibold text-white transition-colors
            ${
              !bookingLoading
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          {bookingLoading ? 'Бронируем...' : 'Забронировать'}
        </button>
      </div>
    </div>
  );
}
