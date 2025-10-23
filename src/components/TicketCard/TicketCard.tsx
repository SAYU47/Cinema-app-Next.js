import { BookingSeat, BookingWithMovieInfo } from "@/types/booking";


interface TicketCardProps {
  booking: BookingWithMovieInfo;
  showPayButton: boolean;
  onPayment?: (bookingId: string) => void;
  isPaying?: boolean;
  timeLeft?: number;
}

export default function TicketCard({ 
  booking, 
  showPayButton, 
  onPayment, 
  isPaying = false,
  timeLeft 
}: TicketCardProps) {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatSessionDate = (startTime: string) => {
    const date = new Date(startTime);
    return {
      date: date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit'
      }),
      time: date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const sessionDate = booking.movieSessionInfo?.startTime 
    ? formatSessionDate(booking.movieSessionInfo.startTime)
    : null;

  const formatSeats = (seats: BookingSeat[]) => {
    return seats.map(seat => `Ряд ${seat.rowNumber}, место ${seat.seatNumber}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {booking.movieTitle}
          </h3>
          <p className="text-gray-600 mb-1">
            {booking.cinemaName}
            {sessionDate && ` • ${sessionDate.date} ${sessionDate.time}`}
          </p>
          <p className="text-gray-500 text-sm">
            Забронировано: {new Date(booking.bookedAt).toLocaleDateString('ru-RU')}
          </p>
        </div>
        
        {showPayButton && onPayment && (
          <div className="text-right space-y-2">
            {timeLeft !== undefined && (
              <div className="text-sm text-red-600 font-medium">
                Осталось {formatTime(timeLeft)}
              </div>
            )}
            <button
              onClick={() => onPayment(booking.id)}
              disabled={isPaying}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaying ? 'Оплата...' : 'Оплатить'}
            </button>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-700 mb-2">Места:</p>
        <div className="flex flex-wrap gap-2">
          {formatSeats(booking.seats).map((seat, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium"
            >
              {seat}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        {!showPayButton && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.isPaid 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {booking.isPaid ? 'Оплачено' : 'Ожидает оплаты'}
          </span>
        )}
      </div>
    </div>
  );
}